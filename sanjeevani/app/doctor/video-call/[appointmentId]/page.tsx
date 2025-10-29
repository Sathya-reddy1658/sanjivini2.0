"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Maximize,
  FileText,
  Activity,
  User,
  Clock
} from "lucide-react";
import { WebRTCManager } from "@/lib/webrtc-config";
import { mockAppointments } from "@/lib/doctor-data";

export default function DoctorVideoCallPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = use(params);
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string; time: Date }>>([]);
  const [chatInput, setChatInput] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcManager = useRef<WebRTCManager | null>(null);
  const callStartTime = useRef<Date | null>(null);

  const appointment = mockAppointments.find((apt) => apt.id === appointmentId);
  const doctorId = typeof window !== "undefined" ? sessionStorage.getItem("doctorId") || "doctor-1" : "doctor-1";

  useEffect(() => {
    let durationInterval: NodeJS.Timeout;

    const initializeCall = async () => {
      try {
        setConnectionStatus("Requesting camera and microphone access...");

        // Initialize WebRTC manager
        webrtcManager.current = new WebRTCManager(
          appointmentId,
          doctorId,
          (remoteStream) => {
            // Handle remote stream
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setIsConnected(true);
            setConnectionStatus("Connected");
            callStartTime.current = new Date();

            // Start call duration counter
            durationInterval = setInterval(() => {
              if (callStartTime.current) {
                const duration = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
                setCallDuration(duration);
              }
            }, 1000);
          },
          (state) => {
            // Handle connection state changes
            switch (state) {
              case "connecting":
                setConnectionStatus("Connecting...");
                break;
              case "connected":
                setConnectionStatus("Connected");
                setIsConnected(true);
                break;
              case "disconnected":
                setConnectionStatus("Disconnected");
                setIsConnected(false);
                break;
              case "failed":
                setConnectionStatus("Connection failed");
                setIsConnected(false);
                break;
            }
          }
        );

        // Get local media stream
        const localStream = await webrtcManager.current.getUserMedia(true, true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        setConnectionStatus("Connecting to patient...");

        // For demo purposes, simulate connection without actual signaling server
        // In production, uncomment the following line to connect to signaling server
        // await webrtcManager.current.connectToSignalingServer();

        // Initialize peer connection
        webrtcManager.current.initializePeerConnection();

        // Simulate successful connection for demo
        setTimeout(() => {
          setIsConnected(true);
          setIsConnecting(false);
          setConnectionStatus("Connected");
          callStartTime.current = new Date();

          durationInterval = setInterval(() => {
            if (callStartTime.current) {
              const duration = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
              setCallDuration(duration);
            }
          }, 1000);

          // Simulate remote stream (for demo - shows local stream mirrored)
          if (remoteVideoRef.current && localStream) {
            remoteVideoRef.current.srcObject = localStream;
          }
        }, 2000);
      } catch (error) {
        console.error("Error initializing call:", error);
        setConnectionStatus("Failed to access camera/microphone");
        setIsConnecting(false);
      }
    };

    initializeCall();

    return () => {
      if (durationInterval) {
        clearInterval(durationInterval);
      }
      if (webrtcManager.current) {
        webrtcManager.current.cleanup();
      }
    };
  }, [appointmentId, doctorId]);

  const handleToggleVideo = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);
    if (webrtcManager.current) {
      webrtcManager.current.toggleVideo(newState);
    }
  };

  const handleToggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    if (webrtcManager.current) {
      webrtcManager.current.toggleAudio(newState);
    }
  };

  const handleEndCall = () => {
    if (webrtcManager.current) {
      webrtcManager.current.cleanup();
    }
    router.push("/doctor/dashboard");
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([
        ...chatMessages,
        { sender: "You", message: chatInput, time: new Date() },
      ]);
      setChatInput("");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-white text-xl font-semibold">
            {appointment?.patientName || "Patient"}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant={isConnected ? "default" : "secondary"} className="bg-green-500">
              <Activity className="w-3 h-3 mr-1" />
              {connectionStatus}
            </Badge>
            {isConnected && (
              <span className="text-white text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(callDuration)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-white border-white">
            <FileText className="w-4 h-4 mr-2" />
            Patient Record
          </Button>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video (Patient) */}
        <div className="w-full h-full bg-gray-800 relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {appointment?.patientName.split(" ").map((n) => n[0]).join("") || "P"}
                </div>
                <p className="text-white text-lg mb-2">{connectionStatus}</p>
                {isConnecting && (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Doctor) - Picture in Picture */}
        <div className="absolute bottom-24 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden shadow-2xl border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          {!videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-white text-sm font-semibold mb-1">{msg.sender}</p>
                  <p className="text-gray-300 text-sm">{msg.message}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {msg.time.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white px-3 py-2 rounded"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex justify-center items-center gap-4">
          <Button
            variant={audioEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleToggleAudio}
          >
            {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            variant={videoEnabled ? "default" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleToggleVideo}
          >
            {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-16 h-16"
            onClick={handleEndCall}
          >
            <PhoneOff className="w-7 h-7" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 text-white border-white"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 text-white border-white"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Connection Info Card */}
      {isConnecting && (
        <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Setting up video call...</h3>
            <p className="text-muted-foreground">{connectionStatus}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
