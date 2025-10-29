"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Navigation,
  Phone,
  Video,
  AlertTriangle,
  User,
  MapPin,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Wind,
  ArrowLeft
} from "lucide-react";
import {
  getMockEmergencyAlerts,
  getEmergencyInstructionVideo,
  type EmergencyAlert
} from "@/lib/emergency-detection";

export default function EmergencyResponsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alertId = searchParams.get("alertId");
  const [alert, setAlert] = useState<EmergencyAlert | null>(null);
  const [instructionVideo, setInstructionVideo] = useState<any>(null);

  useEffect(() => {
    if (alertId) {
      const alerts = getMockEmergencyAlerts();
      const foundAlert = alerts.find((a) => a.id === alertId);
      if (foundAlert) {
        setAlert(foundAlert);
        const emergencyTypeKey = foundAlert.emergencyType.toLowerCase().replace(" ", "_");
        const video = getEmergencyInstructionVideo(emergencyTypeKey);
        setInstructionVideo(video);
      }
    }
  }, [alertId]);

  if (!alert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading emergency details...</p>
      </div>
    );
  }

  const getTimeSince = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)}h ago`;
  };

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${alert.location.lat},${alert.location.lng}`,
      "_blank"
    );
  };

  const handleCallVictim = () => {
    window.open("tel:108");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Emergencies
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Emergency Details */}
          <div className="space-y-6">
            <Card className="border-2 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {alert.userName}
                      <span className="text-xs px-2 py-1 rounded bg-red-500 text-white">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {alert.emergencyType}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">Emergency Description</span>
                  </div>
                  <p className="text-muted-foreground">{alert.description}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className="text-sm">{alert.location.address}</p>
                  <p className="text-sm text-muted-foreground">
                    Distance: {alert.distance}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Time Elapsed</span>
                  </div>
                  <p className="text-sm text-red-600 font-semibold">
                    {getTimeSince(alert.timestamp)}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5" />
                    <span className="font-semibold">Vital Signs</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="text-lg font-bold">{alert.vitals.heartRate}</div>
                        <div className="text-xs text-muted-foreground">bpm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                      <Thermometer className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="text-lg font-bold">{alert.vitals.temperature}°F</div>
                        <div className="text-xs text-muted-foreground">Temp</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                      <Wind className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-lg font-bold">{alert.vitals.bloodOxygen}%</div>
                        <div className="text-xs text-muted-foreground">SpO2</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-lg font-bold">{alert.vitals.bloodPressure}</div>
                        <div className="text-xs text-muted-foreground">BP</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleGetDirections}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" onClick={handleCallVictim}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call 108
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instruction Video */}
          <div className="space-y-6">
            {instructionVideo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    {instructionVideo.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Duration: {instructionVideo.duration}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={instructionVideo.videoUrl}
                      title={instructionVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Step-by-Step Instructions</h4>
                    <ol className="space-y-2">
                      {instructionVideo.steps.map((step: string, index: number) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm font-semibold text-red-600">
                      Critical: Call 108 (Ambulance) immediately if not already done
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
