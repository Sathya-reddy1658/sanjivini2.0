"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Video,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Download,
  MessageSquare
} from "lucide-react";

interface Appointment {
  id?: string;
  doctorId?: string;
  doctorName: string;
  doctorSpecialty?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  consultationType: "video" | "in-person";
  symptoms: string;
  status: "confirmed" | "completed" | "cancelled" | "pending";
  fee: number;
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    // Load appointment from session storage if just booked
    const newAppointment = sessionStorage.getItem("newAppointment");
    if (newAppointment) {
      const appointment = JSON.parse(newAppointment);
      setAppointments([{ ...appointment, id: Date.now().toString() }]);
      sessionStorage.removeItem("newAppointment");
    }

    // TODO: Load from Firestore
    // For now, adding mock appointments
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        doctorName: "Dr. Ranghaiah",
        doctorSpecialty: "Cardiology",
        patientName: "malinga",
        patientEmail: "john@example.com",
        patientPhone: "+1 (555) 123-4567",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toDateString(),
        time: "10:00 AM",
        consultationType: "video",
        symptoms: "Chest pain and irregular heartbeat",
        status: "confirmed",
        fee: 150
      },
      {
        id: "2",
        doctorName: "Dr. James Wilson",
        doctorSpecialty: "Dermatology",
        patientName: "John Doe",
        patientEmail: "john@example.com",
        patientPhone: "+1 (555) 123-4567",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toDateString(),
        time: "2:00 PM",
        consultationType: "in-person",
        symptoms: "Skin rash on arms",
        status: "completed",
        fee: 120
      }
    ];

    setAppointments((prev) => {
      const combined = [...prev, ...mockAppointments];
      // Remove duplicates
      const unique = combined.filter(
        (apt, index, self) => index === self.findIndex((a) => a.id === apt.id)
      );
      return unique;
    });
  }, []);

  const getFilteredAppointments = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);

      if (filter === "upcoming") {
        return aptDate >= now && (apt.status === "confirmed" || apt.status === "pending");
      } else if (filter === "past") {
        return aptDate < now || apt.status === "completed" || apt.status === "cancelled";
      }
      return true;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleJoinConsultation = (appointment: Appointment) => {
    if (appointment.consultationType === "video") {
      router.push(`/consultation/connect?appointmentId=${appointment.id}`);
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    // TODO: Update Firestore
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt))
    );
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold">My Appointments</h1>
              <p className="text-muted-foreground">Manage your healthcare consultations</p>
            </div>
          </div>
          <Button onClick={() => router.push("/services/appointments")}>
            <Plus className="w-4 h-4 mr-2" /> Book New Appointment
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Appointments
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            onClick={() => setFilter("past")}
          >
            Past
          </Button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No appointments found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === "upcoming"
                ? "You don't have any upcoming appointments"
                : filter === "past"
                ? "You don't have any past appointments"
                : "You haven't booked any appointments yet"}
            </p>
            <Button onClick={() => router.push("/services/appointments")}>
              <Plus className="w-4 h-4 mr-2" /> Book Your First Appointment
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const aptDate = new Date(appointment.date);
              const isUpcoming = aptDate >= new Date() && appointment.status === "confirmed";

              return (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {appointment.doctorName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1">
                            {appointment.doctorName}
                          </CardTitle>
                          {appointment.doctorSpecialty && (
                            <p className="text-sm text-blue-600 font-semibold mb-2">
                              {appointment.doctorSpecialty}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1 capitalize">{appointment.status}</span>
                            </Badge>
                            <Badge variant="secondary">
                              {appointment.consultationType === "video" ? (
                                <><Video className="w-3 h-3 mr-1" /> Video Call</>
                              ) : (
                                <><MapPin className="w-3 h-3 mr-1" /> In-Person</>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Consultation Fee</div>
                        <div className="text-2xl font-bold text-blue-600">${appointment.fee}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold">
                            {new Date(appointment.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold">{appointment.time}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{appointment.patientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{appointment.patientPhone}</span>
                        </div>
                      </div>
                    </div>

                    {appointment.symptoms && (
                      <div className="pt-3 border-t">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold mb-1">Symptoms / Reason</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.symptoms}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t">
                      {isUpcoming && appointment.consultationType === "video" && (
                        <Button
                          className="flex-1"
                          onClick={() => handleJoinConsultation(appointment)}
                        >
                          <Video className="w-4 h-4 mr-2" /> Join Video Call
                        </Button>
                      )}
                      {isUpcoming && appointment.consultationType === "in-person" && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            window.open("https://www.google.com/maps", "_blank");
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2" /> Get Directions
                        </Button>
                      )}
                      {appointment.status === "completed" && (
                        <Button variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" /> Download Prescription
                        </Button>
                      )}
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" /> Chat
                      </Button>
                      {appointment.status === "confirmed" && (
                        <Button
                          variant="destructive"
                          onClick={() => appointment.id && handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
