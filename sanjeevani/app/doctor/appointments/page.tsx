"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Video,
  MapPin,
  Search,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Activity
} from "lucide-react";
import { mockAppointments, type Appointment } from "@/lib/doctor-data";
import { format, isToday, isFuture, isPast } from "date-fns";

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "past" | "completed" | "cancelled">("all");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    const aptDate = new Date(apt.date);

    switch (filter) {
      case "today":
        matchesFilter = isToday(aptDate);
        break;
      case "upcoming":
        matchesFilter = isFuture(aptDate) && apt.status === "scheduled";
        break;
      case "past":
        matchesFilter = isPast(aptDate) || apt.status === "completed" || apt.status === "cancelled";
        break;
      case "completed":
        matchesFilter = apt.status === "completed";
        break;
      case "cancelled":
        matchesFilter = apt.status === "cancelled";
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const todayAppointments = appointments.filter((apt) => isToday(new Date(apt.date)));
  const upcomingAppointments = appointments.filter(
    (apt) => isFuture(new Date(apt.date)) && apt.status === "scheduled"
  );
  const completedCount = appointments.filter((apt) => apt.status === "completed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "ongoing":
        return <Activity className="w-4 h-4 animate-pulse" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p className="text-muted-foreground">Manage all your appointments and consultations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-3xl font-bold">{todayAppointments.length}</p>
                </div>
                <Calendar className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
                </div>
                <Clock className="w-10 h-10 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">{completedCount}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold">{appointments.length}</p>
                </div>
                <FileText className="w-10 h-10 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by patient name or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "today" ? "default" : "outline"}
              onClick={() => setFilter("today")}
            >
              Today
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
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={filter === "cancelled" ? "default" : "outline"}
              onClick={() => setFilter("cancelled")}
            >
              Cancelled
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {filteredAppointments.length} Appointment{filteredAppointments.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg">
                No appointments found matching your criteria
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {appointment.patientName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">
                                {appointment.patientName}
                              </h3>
                              <div className="flex gap-2 mb-2">
                                <Badge className={getStatusColor(appointment.status)}>
                                  {getStatusIcon(appointment.status)}
                                  <span className="ml-1 capitalize">{appointment.status}</span>
                                </Badge>
                                <Badge variant={appointment.type === "video" ? "default" : "secondary"}>
                                  {appointment.type === "video" ? (
                                    <><Video className="w-3 h-3 mr-1" /> Video</>
                                  ) : (
                                    <><MapPin className="w-3 h-3 mr-1" /> In-Person</>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{appointment.time}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(appointment.date), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-semibold mb-1">Symptoms</p>
                              <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                            </div>

                            {appointment.notes && (
                              <div>
                                <p className="text-sm font-semibold mb-1">Notes</p>
                                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 mt-4">
                            {appointment.status === "scheduled" && appointment.type === "video" && (
                              <Button
                                onClick={() => router.push(`/doctor/video-call/${appointment.id}`)}
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join Video Call
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/doctor/patients/${appointment.patientId}`)}
                            >
                              <User className="w-4 h-4 mr-2" />
                              View Patient
                            </Button>
                            {appointment.status === "completed" && (
                              <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                View Report
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
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
