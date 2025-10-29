"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, Hospital, Phone, Stethoscope, Star, Navigation, ArrowLeft } from "lucide-react";
import {
  getPincodeCoordinates,
  getHospitalsNearby,
  getDoctorsNearby,
} from "@/lib/openstreetmap";
import { toast } from "@/components/ui/use-toast";

interface HospitalType {
  id: string;
  name: string;
  distance: number;
  address: string;
  phone: string;
  type: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  address: string;
  phone: string;
  consultationFee: number;
  rating: number;
  distance: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

function HospitalSkeleton() {
  return (
    <div className="group p-6 rounded-xl border bg-card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-7 bg-muted-foreground/20 rounded w-48 mb-3" />
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
            <div className="h-4 bg-muted-foreground/20 rounded w-64" />
          </div>
          <div className="h-4 bg-muted-foreground/20 rounded w-24" />
        </div>
        <div className="w-32 h-9 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  );
}

function HospitalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState<"hospitals" | "doctors">("hospitals");

  useEffect(() => {
    const pincodeParam = searchParams.get("pincode");
    if (!pincodeParam) {
      router.push("/");
      return;
    }

    setPincode(pincodeParam);

    const fetchData = async () => {
      try {
        const coordinates = await getPincodeCoordinates(pincodeParam);
        if (!coordinates) {
          toast({
            title: "Pincode Not Found",
            description: `Could not find pincode ${pincodeParam}. Showing results for Vellore area.`,
            variant: "default",
          });
        }

        const [nearbyHospitals, nearbyDoctors] = await Promise.all([
          getHospitalsNearby(coordinates || { lat: 12.9698, lon: 79.1559 }),
          getDoctorsNearby(coordinates || { lat: 12.9698, lon: 79.1559 }),
        ]);

        setHospitals(nearbyHospitals);
        setDoctors(nearbyDoctors);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Showing default results.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, router]);

  const getDirections = (lat: number, lon: number) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <HospitalSkeleton />
        <HospitalSkeleton />
        <HospitalSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Pincode Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Results for Pincode</h2>
              <p className="text-3xl font-bold text-primary">{pincode}</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Selector */}
      <div className="flex gap-4">
        <Button
          variant={activeTab === "hospitals" ? "default" : "outline"}
          onClick={() => setActiveTab("hospitals")}
          className="flex-1"
        >
          <Hospital className="w-4 h-4 mr-2" />
          Hospitals ({hospitals.length})
        </Button>
        <Button
          variant={activeTab === "doctors" ? "default" : "outline"}
          onClick={() => setActiveTab("doctors")}
          className="flex-1"
        >
          <Stethoscope className="w-4 h-4 mr-2" />
          Doctors ({doctors.length})
        </Button>
      </div>

      {/* Hospitals List */}
      {activeTab === "hospitals" && (
        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <Hospital className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{hospital.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {hospital.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 ml-15">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${hospital.phone}`} className="text-sm text-primary hover:underline">
                          {hospital.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-600">
                          {hospital.distance.toFixed(1)} km away
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button
                      size="sm"
                      onClick={() => getDirections(hospital.coordinates.lat, hospital.coordinates.lon)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${hospital.phone}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Doctors List */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>

                    <div className="space-y-2 ml-15">
                      <div className="flex items-center gap-2">
                        <Hospital className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{doctor.hospital}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{doctor.address}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">{doctor.rating}</span>
                        </div>
                        <span className="text-sm">
                          Fee: <span className="font-semibold text-green-600">₹{doctor.consultationFee}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <Navigation className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-semibold text-blue-600">
                            {doctor.distance.toFixed(1)} km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/services/appointments/book?doctorId=${doctor.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Book
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(doctor.coordinates.lat, doctor.coordinates.lon)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <div className="container max-w-4xl py-8 mx-auto min-h-screen px-4">
      <div className="flex items-center justify-center mb-8 gap-3">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Nearby Healthcare
        </h1>
        <Hospital className="w-8 h-8 text-red-400" />
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <HospitalSkeleton />
            <HospitalSkeleton />
            <HospitalSkeleton />
          </div>
        }
      >
        <HospitalsContent />
      </Suspense>
    </div>
  );
}
