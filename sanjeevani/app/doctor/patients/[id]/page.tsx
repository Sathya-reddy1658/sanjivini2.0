"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Activity,
  Droplet,
  Calendar,
  FileText,
  Heart,
  Thermometer,
  Wind,
  Phone,
  Mail,
  User,
  Download,
  Edit,
  Save
} from "lucide-react";
import { Line } from "react-chartjs-2";
import { mockPatientRecords } from "@/lib/doctor-data";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const patient = mockPatientRecords.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Patient Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Mock vital signs history for chart
  const vitalSignsHistory = {
    labels: ["1 week ago", "5 days ago", "3 days ago", "Yesterday", "Today"],
    datasets: [
      {
        label: "Heart Rate (bpm)",
        data: [75, 78, 76, 80, patient.vitalSigns.heartRate],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        yAxisID: "y",
      },
      {
        label: "Blood Oxygen (%)",
        data: [98, 97, 98, 96, patient.vitalSigns.bloodOxygen],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Heart Rate (bpm)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Blood Oxygen (%)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Mock appointment history
  const appointmentHistory = [
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      diagnosis: "Hypertension monitoring",
      prescription: "Continued current medication",
      notes: "Blood pressure improving, continue monitoring",
    },
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      diagnosis: "Annual checkup",
      prescription: "Metformin 500mg BD, Amlodipine 5mg OD",
      notes: "Diabetes well controlled, slight elevation in BP",
    },
    {
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      diagnosis: "Diabetes follow-up",
      prescription: "Metformin 500mg BD",
      notes: "HbA1c levels improved significantly",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500";
      case "Follow-up Required":
        return "bg-orange-500";
      case "Recovered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Patient Record</h1>
              <p className="text-muted-foreground">Complete medical history and records</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Patient Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {patient.patientName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <CardTitle className="text-3xl mb-2">{patient.patientName}</CardTitle>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">{patient.age} years</Badge>
                    <Badge variant="outline">{patient.gender}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Droplet className="w-3 h-3" />
                      {patient.bloodGroup}
                    </Badge>
                    <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {patient.patientEmail}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {patient.patientPhone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-4xl font-bold text-blue-600">{patient.appointmentCount}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Current Vital Signs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="text-2xl font-bold">{patient.vitalSigns.heartRate}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Wind className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">SpO2</p>
                    <p className="text-2xl font-bold">{patient.vitalSigns.bloodOxygen}</p>
                    <p className="text-xs text-muted-foreground">%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <Thermometer className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="text-2xl font-bold">{patient.vitalSigns.temperature}</p>
                    <p className="text-xs text-muted-foreground">°F</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="text-xl font-bold">{patient.vitalSigns.bloodPressure}</p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Visit</p>
                <p className="font-semibold">{patient.lastVisit.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Diagnosis</p>
                <p className="font-semibold">{patient.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Prescription</p>
                <p className="text-sm">{patient.prescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vital Signs Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vital Signs Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={vitalSignsHistory} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Appointment History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentHistory.map((apt, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">{apt.diagnosis}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {apt.date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold mb-1">Prescription</p>
                      <p className="text-sm text-muted-foreground">{apt.prescription}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{apt.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor's Notes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Doctor's Notes</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
              >
                {isEditingNotes ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Notes
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingNotes ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about the patient's condition, treatment plan, or observations..."
                className="min-h-[200px]"
              />
            ) : (
              <div className="text-muted-foreground">
                {notes || "No notes added yet. Click 'Edit Notes' to add notes."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
