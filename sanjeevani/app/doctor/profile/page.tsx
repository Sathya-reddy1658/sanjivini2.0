"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Award,
  Calendar,
  Clock,
  Edit,
  Save,
  X,
  Settings,
  Bell,
  Lock,
  Shield,
  CheckCircle,
  TrendingUp,
  Users,
  Video
} from "lucide-react";
import { getDashboardStats } from "@/lib/doctor-data";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [stats] = useState(getDashboardStats());

  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+91 98765 43210",
    specialty: "Cardiologist",
    qualification: "MD, DM (Cardiology)",
    experience: "15 years",
    license: "MCI-12345678",
    hospital: "City General Hospital",
    address: "123 Medical Center, Bangalore, Karnataka",
    about: "Experienced cardiologist specializing in interventional cardiology and heart failure management. Committed to providing compassionate, evidence-based care.",
    consultationFee: "1500",
    languages: ["English", "Hindi", "Kannada"],
  });

  const [editData, setEditData] = useState(profileData);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    // Check if doctor is logged in
    const role = sessionStorage.getItem("userRole");
    const name = sessionStorage.getItem("doctorName") || sessionStorage.getItem("doctorEmail");

    if (role !== "doctor") {
      router.push("/doctor/login");
      return;
    }

    setDoctorName(name || "Doctor");
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    // In real app, this would make an API call
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Doctor Profile</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Manage your profile and account settings
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold">{stats.totalPatients}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-3xl font-bold">{profileData.experience.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">years</p>
              </div>
              <Award className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-3xl font-bold">{stats.videoConsultations}</p>
                <p className="text-xs text-muted-foreground">today</p>
              </div>
              <Video className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-3xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">out of 5.0</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {isEditing ? editData.name : profileData.name}
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                </div>
                <div>
                  <p className="font-semibold text-lg">{isEditing ? editData.name : profileData.name}</p>
                  <p className="text-sm text-muted-foreground">{profileData.specialty}</p>
                  <Badge className="mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Doctor
                  </Badge>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Specialty
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.specialty}
                      onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.specialty}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Qualification
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.qualification}
                      onChange={(e) => setEditData({ ...editData, qualification: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.qualification}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Hospital/Clinic
                  </label>
                  {isEditing ? (
                    <Input
                      value={editData.hospital}
                      onChange={(e) => setEditData({ ...editData, hospital: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.hospital}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Your medical credentials and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Medical License Number
                </label>
                <p className="text-sm text-muted-foreground">{profileData.license}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Years of Experience
                </label>
                {isEditing ? (
                  <Input
                    value={editData.experience}
                    onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profileData.experience}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2">Languages Spoken</label>
                <div className="flex gap-2 flex-wrap">
                  {profileData.languages.map((lang, idx) => (
                    <Badge key={idx} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2">About</label>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={editData.about}
                    onChange={(e) => setEditData({ ...editData, about: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profileData.about}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2">Consultation Fee (INR)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.consultationFee}
                    onChange={(e) => setEditData({ ...editData, consultationFee: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Rs. {profileData.consultationFee}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Availability Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy & Security
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Profile Completion</span>
                <Badge>95%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "95%" }}></div>
              </div>
              <div className="pt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Email verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Phone verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">License verified</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span className="font-medium">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
              <Button variant="outline" className="w-full mt-3" size="sm">
                <Edit className="w-3 h-3 mr-2" />
                Edit Hours
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
