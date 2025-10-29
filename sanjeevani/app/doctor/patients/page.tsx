"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  ArrowLeft,
  FileText,
  Activity,
  Calendar,
  Phone,
  Mail,
  Droplet,
  User as UserIcon
} from "lucide-react";
import { mockPatientRecords, type PatientRecord } from "@/lib/doctor-data";

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Active" | "Follow-up Required" | "Recovered">("all");
  const [patients] = useState<PatientRecord[]>(mockPatientRecords);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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
    <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Patient Management</h1>
          <p className="text-muted-foreground">View and manage all patient records and medical history</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "Active" ? "default" : "outline"}
              onClick={() => setFilterStatus("Active")}
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "Follow-up Required" ? "default" : "outline"}
              onClick={() => setFilterStatus("Follow-up Required")}
            >
              Follow-up
            </Button>
            <Button
              variant={filterStatus === "Recovered" ? "default" : "outline"}
              onClick={() => setFilterStatus("Recovered")}
            >
              Recovered
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold">{patients.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold">
                    {patients.filter((p) => p.status === "Active").length}
                  </p>
                </div>
                <Activity className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Follow-up</p>
                  <p className="text-3xl font-bold">
                    {patients.filter((p) => p.status === "Follow-up Required").length}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recovered</p>
                  <p className="text-3xl font-bold">
                    {patients.filter((p) => p.status === "Recovered").length}
                  </p>
                </div>
                <FileText className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {filteredPatients.length} Patient{filteredPatients.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {filteredPatients.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg">
                No patients found matching your criteria
              </p>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {patient.patientName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <CardTitle className="mb-1">{patient.patientName}</CardTitle>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {patient.age} yrs
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {patient.gender}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Droplet className="w-3 h-3" />
                              {patient.bloodGroup}
                            </Badge>
                          </div>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-1">Diagnosis</p>
                      <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Activity className="w-4 h-4 text-red-500" />
                          {patient.vitalSigns.heartRate} bpm
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                        <p className="text-sm font-semibold">{patient.vitalSigns.bloodPressure}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">SpO2</p>
                        <p className="text-sm font-semibold">{patient.vitalSigns.bloodOxygen}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-sm font-semibold">{patient.vitalSigns.temperature}°F</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{patient.patientEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{patient.patientPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Last visit: {patient.lastVisit.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {patient.appointmentCount} appointments
                        </span>
                      </div>
                    </div>

                    <Button className="w-full mt-3" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Record
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
