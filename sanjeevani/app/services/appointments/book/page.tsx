"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Video,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  Star,
  DollarSign,
  CreditCard
} from "lucide-react";
import { doctors, generateTimeSlots, type Doctor, type TimeSlot } from "@/lib/appointment-data";

export default function BookAppointmentPage() {
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [consultationType, setConsultationType] = useState<"video" | "in-person">("video");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Patient details
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [step, setStep] = useState(1); // 1: DateTime, 2: Details, 3: Confirm

  useEffect(() => {
    const doctorId = sessionStorage.getItem("selectedDoctorId");
    if (doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        // Set default consultation type based on availability
        if (doctor.videoConsultation && !doctor.inPersonConsultation) {
          setConsultationType("video");
        } else if (!doctor.videoConsultation && doctor.inPersonConsultation) {
          setConsultationType("in-person");
        }
      } else {
        router.push("/services/appointments");
      }
    } else {
      router.push("/services/appointments");
    }
  }, [router]);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
      const dayAvailability = selectedDoctor.availability.find((a) => a.day === dayOfWeek);

      if (dayAvailability) {
        const slots = generateTimeSlots(
          dayAvailability.startTime,
          dayAvailability.endTime,
          selectedDate
        );
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [selectedDate, selectedDoctor]);

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleContinue = () => {
    if (step === 1 && selectedDate && selectedTimeSlot) {
      setStep(2);
    } else if (step === 2 && patientName && patientEmail && patientPhone) {
      setStep(3);
    }
  };

  const handleConfirmBooking = () => {
    // TODO: Save to Firestore
    const appointment = {
      doctorId: selectedDoctor?.id,
      doctorName: selectedDoctor?.name,
      patientName,
      patientEmail,
      patientPhone,
      date: selectedDate?.toDateString(),
      time: selectedTimeSlot?.time,
      consultationType,
      symptoms,
      status: "confirmed",
      fee: selectedDoctor?.consultationFee
    };

    sessionStorage.setItem("newAppointment", JSON.stringify(appointment));
    router.push("/services/appointments/my-appointments");
  };

  if (!selectedDoctor) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <Button variant="ghost" onClick={() => step === 1 ? router.back() : setStep(step - 1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? "text-blue-600" : "text-muted-foreground"}`}>
              Select Date & Time
            </span>
            <span className={`text-sm font-medium ${step >= 2 ? "text-blue-600" : "text-muted-foreground"}`}>
              Patient Details
            </span>
            <span className={`text-sm font-medium ${step >= 3 ? "text-blue-600" : "text-muted-foreground"}`}>
              Confirm Booking
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Doctor Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {selectedDoctor.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <CardTitle className="text-center">{selectedDoctor.name}</CardTitle>
                <p className="text-sm text-blue-600 font-semibold text-center">
                  {selectedDoctor.specialty}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedDoctor.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({selectedDoctor.reviewCount} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-semibold">${selectedDoctor.consultationFee}</span>
                </div>
                {selectedDate && selectedTimeSlot && (
                  <>
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{selectedTimeSlot.time}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Consultation Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedDoctor.videoConsultation && (
                        <Card
                          className={`cursor-pointer transition-all ${
                            consultationType === "video"
                              ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : ""
                          }`}
                          onClick={() => setConsultationType("video")}
                        >
                          <CardContent className="pt-6 text-center">
                            <Video className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold">Video Consultation</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Connect from anywhere
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      {selectedDoctor.inPersonConsultation && (
                        <Card
                          className={`cursor-pointer transition-all ${
                            consultationType === "in-person"
                              ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : ""
                          }`}
                          onClick={() => setConsultationType("in-person")}
                        >
                          <CardContent className="pt-6 text-center">
                            <MapPin className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold">In-Person Visit</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Visit the clinic
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Select a Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                      {getNextSevenDays().map((date, index) => {
                        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
                        const isAvailable = selectedDoctor.availability.some((a) => a.day === dayOfWeek);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();

                        return (
                          <Card
                            key={index}
                            className={`cursor-pointer transition-all text-center ${
                              !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                            } ${isSelected ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}`}
                            onClick={() => isAvailable && handleDateSelect(date)}
                          >
                            <CardContent className="p-3">
                              <div className="text-xs text-muted-foreground">
                                {date.toLocaleDateString("en-US", { weekday: "short" })}
                              </div>
                              <div className="text-lg font-bold">
                                {date.getDate()}
                              </div>
                              <div className="text-xs">
                                {date.toLocaleDateString("en-US", { month: "short" })}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select a Time Slot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {availableSlots.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No available slots for this day
                        </p>
                      ) : (
                        <div className="grid grid-cols-4 gap-3">
                          {availableSlots.map((slot, index) => (
                            <Button
                              key={index}
                              variant={selectedTimeSlot?.time === slot.time ? "default" : "outline"}
                              onClick={() => handleTimeSlotSelect(slot)}
                              disabled={slot.isBooked}
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedDate || !selectedTimeSlot}
                >
                  Continue to Patient Details
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="John Doe"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Symptoms / Reason for Visit</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder="Describe your symptoms or reason for consultation..."
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="pl-10 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleContinue}
                  disabled={!patientName || !patientEmail || !patientPhone}
                >
                  Continue to Confirmation
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Your Appointment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Doctor</span>
                        <span className="text-sm font-semibold">{selectedDoctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Specialty</span>
                        <span className="text-sm font-semibold">{selectedDoctor.specialty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date</span>
                        <span className="text-sm font-semibold">
                          {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time</span>
                        <span className="text-sm font-semibold">{selectedTimeSlot?.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <Badge variant="secondary">
                          {consultationType === "video" ? (
                            <><Video className="w-3 h-3 mr-1" /> Video Consultation</>
                          ) : (
                            <><MapPin className="w-3 h-3 mr-1" /> In-Person Visit</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-sm text-muted-foreground">Patient</span>
                        <span className="text-sm font-semibold">{patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm font-semibold">{patientEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm font-semibold">{patientPhone}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-sm font-semibold">Consultation Fee</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${selectedDoctor.consultationFee}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" size="lg" onClick={handleConfirmBooking}>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Confirm & Pay ${selectedDoctor.consultationFee}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
