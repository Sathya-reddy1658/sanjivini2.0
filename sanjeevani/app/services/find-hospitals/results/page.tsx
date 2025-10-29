"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  MessageSquare,
  Building2,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Mail,
  Globe,
  Shield,
  Home,
  Pill,
  Apple,
  XCircle,
  UserCheck,
  Info,
  FileText,
  Download
} from "lucide-react";
import { mockHospitals, mockDoctors, type Hospital, type Doctor } from "@/lib/mock-data";
import type { AnalysisResult } from "@/lib/gemini";
import { generateFHIRReport } from "@/lib/fhir-pdf-generator";
import { mapToFHIRResources } from "@/lib/fhir-mapper";

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<"doctors" | "hospitals">("doctors");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitalsWithDistance, setHospitalsWithDistance] = useState<(Hospital & { calculatedDistance: number })[]>([]);
  const [patientData, setPatientData] = useState<any>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showFHIRResources, setShowFHIRResources] = useState(false);

  useEffect(() => {
    const analysisData = sessionStorage.getItem("analysisResult");
    const storedPatientData = sessionStorage.getItem("patientData");

    if (!analysisData) {
      router.push("/services/find-hospitals");
      return;
    }

    setAnalysis(JSON.parse(analysisData));

    // Get user location from stored data
    if (storedPatientData) {
      const data = JSON.parse(storedPatientData);
      setPatientData(data);
      if (data.userLocation) {
        setUserLocation(data.userLocation);

        // Calculate distances for all hospitals
        const hospitalsWithCalcDistance = mockHospitals.map((hospital) => {
          const distance = calculateDistance(
            data.userLocation.lat,
            data.userLocation.lng,
            hospital.coordinates.lat,
            hospital.coordinates.lng
          );
          return {
            ...hospital,
            calculatedDistance: distance,
          };
        });

        // Sort by distance
        hospitalsWithCalcDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
        setHospitalsWithDistance(hospitalsWithCalcDistance);
      } else {
        // No user location, use default hospitals
        setHospitalsWithDistance(
          mockHospitals.map((h) => ({ ...h, calculatedDistance: 0 }))
        );
      }
    }
  }, [router]);

  const getDirections = (lat: number, lng: number, name: string) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`,
      "_blank"
    );
  };

  const handleGeneratePDF = async () => {
    if (!analysis || !patientData) return;

    setGeneratingPDF(true);
    try {
      await generateFHIRReport(analysis, {
        name: patientData.name || "Patient",
        symptoms: patientData.symptoms || "No symptoms provided",
        vitalSigns: patientData.vitalSigns,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getFHIRResources = () => {
    if (!analysis || !patientData) return null;

    return mapToFHIRResources(analysis, {
      name: patientData.name || "Patient",
      symptoms: patientData.symptoms || "No symptoms provided",
      vitalSigns: patientData.vitalSigns,
    });
  };

  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-6xl">
        {/* Analysis Summary - Minimal */}
        <Card className="mb-6 border-2 border-blue-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {analysis.severity === "low" ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Condition</p>
                <p className="font-semibold text-sm">{analysis.disease}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Recommended Specialist</p>
                <p className="font-semibold text-sm">{analysis.doctorSpecialty}</p>
              </div>
              <div className={`p-3 rounded-lg ${
                analysis.severity === "high"
                  ? "bg-red-50 dark:bg-red-950/30"
                  : analysis.severity === "medium"
                  ? "bg-yellow-50 dark:bg-yellow-950/30"
                  : "bg-green-50 dark:bg-green-950/30"
              }`}>
                <p className="text-xs text-muted-foreground mb-1">Severity</p>
                <p className="font-semibold text-sm capitalize">{analysis.severity}</p>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">{analysis.diagnosis}</p>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Complete analysis with recommendations, diet plan, and precautions available in the FHIR report below
            </p>
          </CardContent>
        </Card>

        {/* FHIR Report & Resources */}
        <Card className="mb-8 border-2 border-blue-500/50">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                FHIR Medical Report
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  HL7 FHIR R4
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  Google Healthcare API
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your analysis has been structured according to HL7 FHIR R4 standards for healthcare interoperability.
            </p>

            {/* Download PDF Button */}
            <Button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download FHIR Report (PDF)
                </>
              )}
            </Button>

            {/* FHIR Resources Toggle */}
            <div className="border-t pt-4">
              <Button
                onClick={() => setShowFHIRResources(!showFHIRResources)}
                variant="outline"
                className="w-full"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                {showFHIRResources ? "Hide" : "View"} FHIR Resources
              </Button>
            </div>

            {/* FHIR Resources Viewer */}
            {showFHIRResources && getFHIRResources() && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Info className="w-4 h-4" />
                  <span>Structured healthcare data according to HL7 FHIR R4 specification</span>
                </div>

                {/* Patient Resource */}
                <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 p-4 font-semibold text-blue-900 dark:text-blue-100 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Patient Resource
                    </span>
                    <Badge variant="outline" className="text-xs">Patient</Badge>
                  </summary>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(getFHIRResources()?.patient, null, 2)}
                    </pre>
                  </div>
                </details>

                {/* Observation Resources */}
                <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 p-4 font-semibold text-purple-900 dark:text-purple-100 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Observation Resources (Vitals)
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getFHIRResources()?.observations.length} observations
                    </Badge>
                  </summary>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(getFHIRResources()?.observations, null, 2)}
                    </pre>
                  </div>
                </details>

                {/* Condition Resource */}
                <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 p-4 font-semibold text-red-900 dark:text-red-100 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Condition Resource (Diagnosis)
                    </span>
                    <Badge variant="outline" className="text-xs">Condition</Badge>
                  </summary>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(getFHIRResources()?.condition, null, 2)}
                    </pre>
                  </div>
                </details>

                {/* Medication Request Resources */}
                <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 p-4 font-semibold text-indigo-900 dark:text-indigo-100 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      MedicationRequest Resources
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getFHIRResources()?.medicationRequests.length} medications
                    </Badge>
                  </summary>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(getFHIRResources()?.medicationRequests, null, 2)}
                    </pre>
                  </div>
                </details>

                {/* Practitioner Resource */}
                <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <summary className="cursor-pointer bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 p-4 font-semibold text-green-900 dark:text-green-100 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Practitioner Resource (Recommended Doctor)
                    </span>
                    <Badge variant="outline" className="text-xs">Practitioner</Badge>
                  </summary>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(getFHIRResources()?.practitioner, null, 2)}
                    </pre>
                  </div>
                </details>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm">
                  <p className="text-blue-900 dark:text-blue-100 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      These FHIR resources follow HL7 FHIR R4 specifications and are compatible with Google Healthcare API for seamless healthcare data exchange.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tab Selector */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedTab === "doctors" ? "default" : "outline"}
            onClick={() => setSelectedTab("doctors")}
            className="flex-1"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Available Doctors
          </Button>
          <Button
            variant={selectedTab === "hospitals" ? "default" : "outline"}
            onClick={() => setSelectedTab("hospitals")}
            className="flex-1"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Nearby Hospitals
          </Button>
        </div>

        {/* Doctors List */}
        {selectedTab === "doctors" && (
          <div className="grid gap-4">
            {mockDoctors
              .filter((d) => d.availability === "available")
              .map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {doctor.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{doctor.name}</h3>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                        <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{doctor.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {doctor.experience}+ years exp
                          </span>
                          <span className="text-sm font-semibold text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Available Now
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${doctor.phone}`} className="text-primary hover:underline">
                          {doctor.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${doctor.email}`} className="text-primary hover:underline">
                          {doctor.email}
                        </a>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {doctor.languages.map((lang) => (
                          <span key={lang} className="text-xs bg-muted px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1"
                        onClick={() => router.push(`/consultation/connect?doctorId=${doctor.id}`)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Consult Now (${doctor.consultationFee})
                      </Button>
                      <Button variant="outline">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Hospitals List */}
        {selectedTab === "hospitals" && (
          <div className="grid gap-4">
            {userLocation && (
              <Card className="bg-blue-500/10 border-blue-500/50">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Showing hospitals sorted by distance from your location
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                </CardContent>
              </Card>
            )}
            {(hospitalsWithDistance.length > 0 ? hospitalsWithDistance : mockHospitals.map((h) => ({ ...h, calculatedDistance: 0 }))).map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{hospital.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{hospital.type}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{hospital.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{hospital.address}</p>
                      <p className="text-sm">{hospital.city}, {hospital.state} {hospital.zipCode}</p>
                      {userLocation && hospital.calculatedDistance > 0 ? (
                        <p className="text-xs text-primary font-semibold">
                          {hospital.calculatedDistance.toFixed(1)} km away
                        </p>
                      ) : (
                        <p className="text-xs text-primary font-semibold">{hospital.distance} away</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${hospital.phone}`} className="text-sm text-primary hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-red-500" />
                      <a href={`tel:${hospital.emergency}`} className="text-sm text-red-500 hover:underline font-semibold">
                        Emergency: {hospital.emergency}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Hours: <span className="font-semibold">{hospital.hours}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${hospital.email}`} className="text-sm text-primary hover:underline">
                      {hospital.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`https://${hospital.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {hospital.website}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Departments:</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.departments.map((dept) => (
                        <span key={dept} className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Facilities:</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.facilities.map((facility) => (
                        <span key={facility} className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2 pt-4 border-t">
                    <Button
                      className="flex-1"
                      onClick={() => getDirections(hospital.coordinates.lat, hospital.coordinates.lng, hospital.name)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`tel:${hospital.phone}`)}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Hospital
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
