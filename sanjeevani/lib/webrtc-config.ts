// WebRTC Configuration and Utilities

export const SIGNALING_SERVER = process.env.NEXT_PUBLIC_SIGNALING_SERVER || "ws://localhost:3001";

// STUN/TURN server configuration for WebRTC
export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
    // Add TURN server for production (required for NAT traversal)
    // {
    //   urls: "turn:your-turn-server.com:3478",
    //   username: "username",
    //   credential: "password",
    // },
  ],
  iceCandidatePoolSize: 10,
};

export interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate" | "join-room" | "leave-room" | "user-joined" | "user-left";
  roomId?: string;
  userId?: string;
  data?: any;
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private websocket: WebSocket | null = null;
  private roomId: string;
  private userId: string;
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onConnectionStateChange?: (state: RTCPeerConnectionState) => void;

  constructor(
    roomId: string,
    userId: string,
    onRemoteStream?: (stream: MediaStream) => void,
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void
  ) {
    this.roomId = roomId;
    this.userId = userId;
    this.onRemoteStreamCallback = onRemoteStream;
    this.onConnectionStateChange = onConnectionStateChange;
  }

  // Initialize WebSocket connection to signaling server
  async connectToSignalingServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(SIGNALING_SERVER);

        this.websocket.onopen = () => {
          console.log("Connected to signaling server");
          // Join the room
          this.sendSignalingMessage({
            type: "join-room",
            roomId: this.roomId,
            userId: this.userId,
          });
          resolve();
        };

        this.websocket.onmessage = (event) => {
          const message: SignalingMessage = JSON.parse(event.data);
          this.handleSignalingMessage(message);
        };

        this.websocket.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log("Disconnected from signaling server");
        };
      } catch (error) {
        console.error("Failed to connect to signaling server:", error);
        reject(error);
      }
    });
  }

  // Get user media (camera and microphone)
  async getUserMedia(videoEnabled = true, audioEnabled = true): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: videoEnabled ? { width: 1280, height: 720, facingMode: "user" } : false,
        audio: audioEnabled ? { echoCancellation: true, noiseSuppression: true } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }

  // Initialize peer connection
  initializePeerConnection(): void {
    this.peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    this.remoteStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream!.addTrack(track);
      });
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream!);
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: "ice-candidate",
          roomId: this.roomId,
          userId: this.userId,
          data: event.candidate,
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log("Connection state:", state);
      if (this.onConnectionStateChange && state) {
        this.onConnectionStateChange(state);
      }
    };
  }

  // Create and send offer
  async createOffer(): Promise<void> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized");
    }

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.sendSignalingMessage({
        type: "offer",
        roomId: this.roomId,
        userId: this.userId,
        data: offer,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  // Handle signaling messages
  private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
    if (!this.peerConnection) return;

    try {
      switch (message.type) {
        case "offer":
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.data)
          );
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.sendSignalingMessage({
            type: "answer",
            roomId: this.roomId,
            userId: this.userId,
            data: answer,
          });
          break;

        case "answer":
          await this.peerConnection.setRemoteDescription(
            new RTCSessionDescription(message.data)
          );
          break;

        case "ice-candidate":
          await this.peerConnection.addIceCandidate(
            new RTCIceCandidate(message.data)
          );
          break;

        case "user-joined":
          console.log("User joined:", message.userId);
          // Create offer when another user joins
          await this.createOffer();
          break;

        case "user-left":
          console.log("User left:", message.userId);
          break;
      }
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  }

  // Send signaling message through WebSocket
  private sendSignalingMessage(message: SignalingMessage): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    }
  }

  // Toggle video
  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  // Toggle audio
  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  // Clean up resources
  cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }

    if (this.websocket) {
      this.sendSignalingMessage({
        type: "leave-room",
        roomId: this.roomId,
        userId: this.userId,
      });
      this.websocket.close();
    }

    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.websocket = null;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }
}
