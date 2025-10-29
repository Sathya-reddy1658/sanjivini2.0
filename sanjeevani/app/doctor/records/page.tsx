"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Activity,
  Pill,
  Stethoscope,
  User,
  Calendar,
  Download,
  Eye,
  Filter,
  Heart,
  Thermometer,
  Droplet
} from "lucide-react";
import { mockPatientRecords, type PatientRecord } from "@/lib/doctor-data";
import { format } from "date-fns";

export default function RecordsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Active" | "Follow-up Required" | "Recovered">("all");
  const [records] = useState<PatientRecord[]>(mockPatientRecords);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.prescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || record.status === filterStatus;

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Comprehensive patient medical records and history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold">{records.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
                <p className="text-3xl font-bold">
                  {records.filter((r) => r.status === "Active").length}
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
                <p className="text-sm text-muted-foreground">Follow-ups</p>
                <p className="text-3xl font-bold">
                  {records.filter((r) => r.status === "Follow-up Required").length}
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
                  {records.filter((r) => r.status === "Recovered").length}
                </p>
              </div>
              <Stethoscope className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by patient name, diagnosis, or prescription..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "Active" ? "default" : "outline"}
                onClick={() => setFilterStatus("Active")}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "Follow-up Required" ? "default" : "outline"}
                onClick={() => setFilterStatus("Follow-up Required")}
                size="sm"
              >
                Follow-up
              </Button>
              <Button
                variant={filterStatus === "Recovered" ? "default" : "outline"}
                onClick={() => setFilterStatus("Recovered")}
                size="sm"
              >
                Recovered
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {filteredRecords.length} Record{filteredRecords.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        {filteredRecords.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg">
              No medical records found matching your criteria
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {record.patientName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <CardTitle className="mb-2">{record.patientName}</CardTitle>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {record.age} yrs • {record.gender}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Droplet className="w-3 h-3 mr-1" />
                            {record.bloodGroup}
                          </Badge>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last visit: {format(new Date(record.lastVisit), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/doctor/patients/${record.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Diagnosis */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold mb-1">Diagnosis</p>
                        <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                      </div>
                    </div>
                  </div>

                  {/* Prescription */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Pill className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold mb-1">Prescription</p>
                        <p className="text-sm text-muted-foreground">{record.prescription}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div>
                    <p className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-500" />
                      Vital Signs
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <p className="text-xs text-muted-foreground">Heart Rate</p>
                        </div>
                        <p className="text-lg font-bold">{record.vitalSigns.heartRate} bpm</p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <p className="text-xs text-muted-foreground">Blood Pressure</p>
                        </div>
                        <p className="text-lg font-bold">{record.vitalSigns.bloodPressure}</p>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <p className="text-xs text-muted-foreground">Temperature</p>
                        </div>
                        <p className="text-lg font-bold">{record.vitalSigns.temperature}°F</p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-green-500" />
                          <p className="text-xs text-muted-foreground">SpO2</p>
                        </div>
                        <p className="text-lg font-bold">{record.vitalSigns.bloodOxygen}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="pt-4 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <p>Total Appointments: {record.appointmentCount}</p>
                    </div>
                    <Button
                      onClick={() => router.push(`/doctor/patients/${record.id}`)}
                    >
                      View Full Record
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
