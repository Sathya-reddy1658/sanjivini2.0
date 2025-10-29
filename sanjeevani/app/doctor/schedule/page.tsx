"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  MapPin,
  Plus,
  CalendarDays,
  TrendingUp
} from "lucide-react";
import { mockAppointments, type Appointment } from "@/lib/doctor-data";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

export default function SchedulePage() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Time slots from 8 AM to 6 PM
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Get appointments for a specific day and time
  const getAppointmentForSlot = (day: Date, timeSlot: string) => {
    return mockAppointments.find(apt => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, day) && apt.time === timeSlot;
    });
  };

  // Get all appointments for the week
  const weekAppointments = mockAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return weekDays.some(day => isSameDay(aptDate, day));
  });

  // Calculate week stats
  const weekStats = {
    total: weekAppointments.length,
    video: weekAppointments.filter(a => a.type === "video").length,
    inPerson: weekAppointments.filter(a => a.type === "in-person").length,
    scheduled: weekAppointments.filter(a => a.status === "scheduled").length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Weekly Schedule</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </p>
        </div>
        <Button onClick={() => router.push("/doctor/appointments")}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total This Week</p>
                <p className="text-3xl font-bold">{weekStats.total}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Video Calls</p>
                <p className="text-3xl font-bold">{weekStats.video}</p>
              </div>
              <Video className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In-Person</p>
                <p className="text-3xl font-bold">{weekStats.inPerson}</p>
              </div>
              <MapPin className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold">{weekStats.scheduled}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Week View</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header Row - Days */}
              <div className="grid grid-cols-8 border-b bg-muted/30">
                <div className="p-3 border-r font-semibold text-sm">Time</div>
                {weekDays.map((day, idx) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={idx}
                      className={`p-3 border-r text-center ${
                        isToday ? "bg-blue-50 dark:bg-blue-950" : ""
                      }`}
                    >
                      <div className={`font-semibold ${isToday ? "text-blue-600" : ""}`}>
                        {format(day, "EEE")}
                      </div>
                      <div className={`text-sm ${isToday ? "text-blue-600 font-bold" : "text-muted-foreground"}`}>
                        {format(day, "MMM d")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              {timeSlots.map((timeSlot, timeIdx) => (
                <div key={timeIdx} className="grid grid-cols-8 border-b hover:bg-muted/20 transition-colors">
                  <div className="p-3 border-r font-medium text-sm text-muted-foreground">
                    {timeSlot}
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const appointment = getAppointmentForSlot(day, timeSlot);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div
                        key={dayIdx}
                        className={`p-2 border-r min-h-[80px] ${
                          isToday ? "bg-blue-50/30 dark:bg-blue-950/10" : ""
                        }`}
                      >
                        {appointment ? (
                          <div
                            className={`p-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              appointment.type === "video"
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                            onClick={() => router.push("/doctor/appointments")}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-semibold text-xs leading-tight">
                                {appointment.patientName}
                              </p>
                              {appointment.type === "video" ? (
                                <Video className="w-3 h-3 flex-shrink-0" />
                              ) : (
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs opacity-90 line-clamp-2">
                              {appointment.symptoms}
                            </p>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-full text-xs"
                              onClick={() => router.push("/doctor/appointments")}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">Video Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">In-Person Visit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-50 dark:bg-blue-950 border"></div>
              <span className="text-sm">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Summary
          </CardTitle>
          <CardDescription>
            Appointments scheduled for this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weekAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No appointments scheduled for this week
              </p>
            ) : (
              weekAppointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push("/doctor/appointments")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {apt.patientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.symptoms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{format(new Date(apt.date), "EEE, MMM d")}</p>
                      <p className="text-xs text-muted-foreground">{apt.time}</p>
                    </div>
                    <Badge variant={apt.type === "video" ? "default" : "secondary"}>
                      {apt.type === "video" ? (
                        <><Video className="w-3 h-3 mr-1" /> Video</>
                      ) : (
                        <><MapPin className="w-3 h-3 mr-1" /> In-Person</>
                      )}
                    </Badge>
                  </div>
                </div>
              ))
            )}
            {weekAppointments.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/doctor/appointments")}
              >
                View All {weekAppointments.length} Appointments
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
