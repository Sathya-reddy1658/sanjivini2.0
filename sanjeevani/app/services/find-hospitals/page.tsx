"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Stethoscope,
  Upload,
  Loader2,
  AlertCircle,
  FileImage,
  Video,
  Activity,
  TrendingUp,
  MapPin,
  Locate
} from "lucide-react";
import { analyzeSymptoms, type AnalysisResult } from "@/lib/gemini";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function FindHospitals() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    symptoms: "",
    severity: "medium",
    location: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock IoT data (in real app, fetch from device)
  const [deviceData] = useState({
    heartRate: 75,
    temperature: 98.6,
    bloodOxygen: 98,
    bloodPressure: "120/80",
  });

  // Get user's current location
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setFormData({
          ...formData,
          location: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to get your location. Please enter it manually or check browser permissions.");
        setGettingLocation(false);
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if user selected severe symptoms (redirect to Google Meet)
      if (formData.severity === "high") {
        // Show scheduling message for 2-3 seconds
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 second delay

        // Redirect to Google Meet
        window.location.href = "https://meet.google.com/bqx-npvm-pyt";
        return;
      }

      // Analyze symptoms with Gemini AI for non-severe cases
      const analysis: AnalysisResult = await analyzeSymptoms(
        formData.symptoms,
        formData.severity,
        image || undefined,
        deviceData
      );

      // Store analysis result and location in sessionStorage
      sessionStorage.setItem("analysisResult", JSON.stringify(analysis));
      sessionStorage.setItem("patientData", JSON.stringify({
        symptoms: formData.symptoms,
        severity: formData.severity,
        deviceData,
        userLocation,
        locationText: formData.location,
      }));

      // Redirect to results page
      router.push("/services/find-hospitals/results");
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Find Doctors & Hospitals</h1>
          <p className="text-muted-foreground">
            Tell us about your symptoms and we'll help you find the right care
          </p>
        </div>

        {/* IoT Device Status Card */}
        <Card className="mb-6 border-blue-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Connected Device - Current Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{deviceData.heartRate}</div>
                <div className="text-xs text-muted-foreground">bpm</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">{deviceData.temperature}°F</div>
                <div className="text-xs text-muted-foreground">Temperature</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{deviceData.bloodOxygen}%</div>
                <div className="text-xs text-muted-foreground">SpO2</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{deviceData.bloodPressure}</div>
                <div className="text-xs text-muted-foreground">BP</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              These vitals will be included in your consultation
            </p>
          </CardContent>
        </Card>

        {/* Symptom Analysis Form */}
        <Card>
          <CardHeader>
            <CardTitle>Symptom Analysis</CardTitle>
            <CardDescription>
              Please provide detailed information about your symptoms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Your Location
                </label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter city, zip code, or address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                  >
                    {gettingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll use this to find nearby hospitals and doctors. Click the location button to auto-detect.
                </p>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <label htmlFor="symptoms" className="text-sm font-medium flex items-center gap-2">
                  Describe Your Symptoms
                  <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms in detail... (e.g., headache, fever, cough, duration, intensity)"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be as specific as possible. Include when symptoms started and their severity.
                </p>
              </div>

              {/* Severity Level */}
              <div className="space-y-2">
                <label htmlFor="severity" className="text-sm font-medium flex items-center gap-2">
                  How severe would you rate your symptoms?
                  <span className="text-destructive">*</span>
                </label>
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full p-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="low">Mild - Manageable discomfort</option>
                  <option value="medium">Moderate - Noticeable discomfort</option>
                  <option value="high">Severe - Significant pain or distress</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Upload Image (Optional)
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    {image ? (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <FileImage className="w-5 h-5" />
                        <span>{image.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload an image of affected area
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <label htmlFor="video" className="text-sm font-medium flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Upload Video (Optional) - Coming Soon
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center opacity-50 cursor-not-allowed">
                  <Video className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Video upload feature will be available soon
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-4 rounded-md bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Analysis Failed</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      AI-Powered Analysis
                    </p>
                    <p className="text-muted-foreground">
                      Your symptoms and vital signs will be analyzed by our AI system.
                      Based on the severity, we'll either show you nearby doctors/hospitals
                      or connect you directly with an available doctor for immediate consultation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {formData.severity === "high"
                      ? "Scheduling Emergency Consultation..."
                      : "Analyzing Your Symptoms..."}
                  </>
                ) : (
                  <>
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Analyze & Find Care
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
