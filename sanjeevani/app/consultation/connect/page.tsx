"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Clock
} from "lucide-react";
import { mockDoctors } from "@/lib/mock-data";
import { WebRTCManager } from "@/lib/webrtc-config";
import type { AnalysisResult } from "@/lib/gemini";

export default function ConsultationConnect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webrtcManager = useRef<WebRTCManager | null>(null);
  const callStartTime = useRef<Date | null>(null);

  const doctorId = searchParams?.get("doctorId");
  const appointmentId = searchParams?.get("appointmentId") || `apt-${Date.now()}`;
  const doctor = mockDoctors.find((d) => d.id === doctorId) || mockDoctors[0];
  const patientId = typeof window !== "undefined" ? sessionStorage.getItem("patientId") || `patient-${Date.now()}` : "patient-1";

  useEffect(() => {
    let durationInterval: NodeJS.Timeout;

    const analysisData = sessionStorage.getItem("analysisResult");
    if (analysisData) {
      setAnalysis(JSON.parse(analysisData));
    }

    const initializeCall = async () => {
      try {
        setConnectionStatus("Requesting camera and microphone access...");

        // Initialize WebRTC manager
        webrtcManager.current = new WebRTCManager(
          appointmentId,
          patientId,
          (remoteStream) => {
            // Handle remote stream (doctor's video)
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setConnected(true);
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
                setConnectionStatus("Connecting to doctor...");
                break;
              case "connected":
                setConnectionStatus("Connected");
                setConnected(true);
                break;
              case "disconnected":
                setConnectionStatus("Disconnected");
                setConnected(false);
                break;
              case "failed":
                setConnectionStatus("Connection failed");
                setConnected(false);
                break;
            }
          }
        );

        // Get local media stream
        const localStream = await webrtcManager.current.getUserMedia(true, true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Initialize peer connection
        webrtcManager.current.initializePeerConnection();

        // Simulate successful connection for demo
        setTimeout(() => {
          setConnected(true);
          setConnecting(false);
          setConnectionStatus("Connected");
          callStartTime.current = new Date();

          durationInterval = setInterval(() => {
            if (callStartTime.current) {
              const duration = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
              setCallDuration(duration);
            }
          }, 1000);

          // Simulate remote stream (for demo)
          if (remoteVideoRef.current && localStream) {
            remoteVideoRef.current.srcObject = localStream;
          }
        }, 2000);
      } catch (error) {
        console.error("Error initializing call:", error);
        setConnectionStatus("Failed to access camera/microphone");
        setConnecting(false);
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
  }, [appointmentId, patientId]);

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
    router.push("/");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Status */}
        <div className="mb-6 flex justify-between items-center">
          {analysis && (
            <Card className="border-2 border-red-500/50 flex-1 mr-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      High Severity Detected - Immediate Consultation
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.urgency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {connected && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              {formatDuration(callDuration)}
            </div>
          )}
        </div>

        {/* Video Consultation Area */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                {/* Doctor Video */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-lg overflow-hidden">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {connecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
                      <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                      <p className="text-white font-semibold">Connecting to {doctor.name}...</p>
                      <p className="text-gray-400 text-sm mt-2">{connectionStatus}</p>
                    </div>
                  )}
                  {!connected && !connecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                        {doctor.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="text-white font-semibold text-xl">{doctor.name}</p>
                      <p className="text-gray-300">{doctor.specialty}</p>
                    </div>
                  )}

                  {/* Local Video (PiP) */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-2xl">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    {!videoEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 bg-card border-t">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant={videoEnabled ? "default" : "destructive"}
                      size="lg"
                      className="rounded-full w-14 h-14"
                      onClick={handleToggleVideo}
                    >
                      {videoEnabled ? (
                        <Video className="w-6 h-6" />
                      ) : (
                        <VideoOff className="w-6 h-6" />
                      )}
                    </Button>
                    <Button
                      variant={audioEnabled ? "default" : "destructive"}
                      size="lg"
                      className="rounded-full w-14 h-14"
                      onClick={handleToggleAudio}
                    >
                      {audioEnabled ? (
                        <Mic className="w-6 h-6" />
                      ) : (
                        <MicOff className="w-6 h-6" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="rounded-full w-14 h-14"
                      onClick={handleEndCall}
                    >
                      <PhoneOff className="w-6 h-6" />
                    </Button>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {connected ? "Consultation in progress..." : connectionStatus}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* WebRTC Note */}
            <Card className="bg-blue-500/10 border-blue-500/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      WebRTC Integration Ready
                    </p>
                    <p className="text-muted-foreground">
                      This is a demo interface. To enable real video consultations, integrate with:
                      Twilio Video, Agora.io, or Daily.co APIs. The frontend is ready for WebRTC implementation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Doctor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Doctor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {doctor.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-center">
                  <h3 className="font-bold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-semibold">{doctor.experience}+ years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-semibold">{doctor.rating} ⭐</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hospital:</span>
                    <span className="font-semibold text-xs">{doctor.hospital}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Current Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(() => {
                    const patientData = sessionStorage.getItem("patientData");
                    const vitals = patientData ? JSON.parse(patientData).deviceData : null;
                    return vitals ? (
                      <>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-lg font-bold text-red-500">{vitals.heartRate}</div>
                          <div className="text-xs text-muted-foreground">bpm</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-lg font-bold text-orange-500">{vitals.temperature}°F</div>
                          <div className="text-xs text-muted-foreground">Temp</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-lg font-bold text-blue-500">{vitals.bloodOxygen}%</div>
                          <div className="text-xs text-muted-foreground">SpO2</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-lg font-bold text-purple-500">{vitals.bloodPressure}</div>
                          <div className="text-xs text-muted-foreground">BP</div>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Consultation Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Secure encrypted connection</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HIPAA compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Session recorded for medical records</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
