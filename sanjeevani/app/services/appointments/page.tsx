"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  Star,
  Video,
  MapPin,
  Clock,
  DollarSign,
  Languages,
  Award,
  Briefcase,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { specialties, doctors, type Doctor } from "@/lib/appointment-data";

export default function AppointmentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"all" | "video" | "in-person">("all");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterDoctors(query, selectedSpecialty, consultationType);
  };

  const handleSpecialtySelect = (specialty: string) => {
    const newSpecialty = selectedSpecialty === specialty ? null : specialty;
    setSelectedSpecialty(newSpecialty);
    filterDoctors(searchQuery, newSpecialty, consultationType);
  };

  const handleConsultationTypeChange = (type: "all" | "video" | "in-person") => {
    setConsultationType(type);
    filterDoctors(searchQuery, selectedSpecialty, type);
  };

  const filterDoctors = (
    query: string,
    specialty: string | null,
    type: "all" | "video" | "in-person"
  ) => {
    let filtered = doctors;

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(query.toLowerCase()) ||
          doc.qualification.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by specialty
    if (specialty) {
      filtered = filtered.filter((doc) => doc.specialty === specialty);
    }

    // Filter by consultation type
    if (type !== "all") {
      filtered = filtered.filter((doc) =>
        type === "video" ? doc.videoConsultation : doc.inPersonConsultation
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = (doctorId: string) => {
    sessionStorage.setItem("selectedDoctorId", doctorId);
    router.push("/services/appointments/book");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Find and consult with expert doctors</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search doctors by name, specialty, or qualification..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Consultation Type Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            variant={consultationType === "all" ? "default" : "outline"}
            onClick={() => handleConsultationTypeChange("all")}
          >
            All Doctors
          </Button>
          <Button
            variant={consultationType === "video" ? "default" : "outline"}
            onClick={() => handleConsultationTypeChange("video")}
          >
            <Video className="w-4 h-4 mr-2" /> Video Consultation
          </Button>
          <Button
            variant={consultationType === "in-person" ? "default" : "outline"}
            onClick={() => handleConsultationTypeChange("in-person")}
          >
            <MapPin className="w-4 h-4 mr-2" /> In-Person
          </Button>
        </div>

        {/* Specialties */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Specialty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {specialties.map((specialty) => (
              <Card
                key={specialty.name}
                className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                  selectedSpecialty === specialty.name
                    ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : ""
                }`}
                onClick={() => handleSpecialtySelect(specialty.name)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-2">{specialty.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{specialty.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {specialty.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Available Doctors
              {selectedSpecialty && (
                <span className="text-blue-500 ml-2">({selectedSpecialty})</span>
              )}
            </h2>
            <span className="text-muted-foreground">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {filteredDoctors.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                No doctors found matching your criteria. Try adjusting your filters.
              </p>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {doctor.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{doctor.name}</CardTitle>
                        <p className="text-sm text-blue-600 font-semibold mb-2">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{doctor.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({doctor.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {doctor.videoConsultation && (
                            <Badge variant="secondary" className="text-xs">
                              <Video className="w-3 h-3 mr-1" /> Video
                            </Badge>
                          )}
                          {doctor.inPersonConsultation && (
                            <Badge variant="secondary" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" /> In-Person
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doctor.experience} years of experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doctor.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">
                        ${doctor.consultationFee} consultation fee
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-green-600 font-medium">
                        Next available: {new Date(doctor.nextAvailable).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="pt-3 border-t flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleBookAppointment(doctor.id)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* My Appointments Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            className="rounded-full shadow-lg"
            onClick={() => router.push("/services/appointments/my-appointments")}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            My Appointments
          </Button>
        </div>
      </div>
    </div>
  );
}
