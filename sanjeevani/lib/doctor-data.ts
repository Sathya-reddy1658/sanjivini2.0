// Mock data for doctor dashboard

export interface PatientRecord {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  lastVisit: Date;
  diagnosis: string;
  prescription: string;
  vitalSigns: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    bloodOxygen: number;
  };
  status: "Active" | "Recovered" | "Follow-up Required";
  appointmentCount: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  time: string;
  type: "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "ongoing";
  symptoms: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: "appointment" | "report" | "emergency" | "message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  patientName?: string;
  appointmentId?: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  completedToday: number;
  pendingReports: number;
  videoConsultations: number;
  inPersonVisits: number;
}

// Mock patient records
export const mockPatientRecords: PatientRecord[] = [
  {
    id: "p1",
    patientName: "Ramesh Kumar",
    patientEmail: "ramesh.kumar@email.com",
    patientPhone: "+91 98765 43210",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    diagnosis: "Hypertension, Type 2 Diabetes",
    prescription: "Metformin 500mg BD, Amlodipine 5mg OD",
    vitalSigns: {
      heartRate: 78,
      bloodPressure: "138/88",
      temperature: 98.4,
      bloodOxygen: 97,
    },
    status: "Follow-up Required",
    appointmentCount: 12,
  },
  {
    id: "p2",
    patientName: "Sneha Reddy",
    patientEmail: "sneha.reddy@email.com",
    patientPhone: "+91 97654 32109",
    age: 32,
    gender: "Female",
    bloodGroup: "A+",
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    diagnosis: "Migraine, Anxiety",
    prescription: "Sumatriptan 50mg PRN, Alprazolam 0.25mg BD",
    vitalSigns: {
      heartRate: 72,
      bloodPressure: "118/76",
      temperature: 98.2,
      bloodOxygen: 99,
    },
    status: "Active",
    appointmentCount: 8,
  },
  {
    id: "p3",
    patientName: "Arun Menon",
    patientEmail: "arun.menon@email.com",
    patientPhone: "+91 96543 21098",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    diagnosis: "Coronary Artery Disease",
    prescription: "Aspirin 75mg OD, Atorvastatin 40mg OD",
    vitalSigns: {
      heartRate: 68,
      bloodPressure: "128/82",
      temperature: 98.6,
      bloodOxygen: 98,
    },
    status: "Follow-up Required",
    appointmentCount: 15,
  },
  {
    id: "p4",
    patientName: "Kavya Nair",
    patientEmail: "kavya.nair@email.com",
    patientPhone: "+91 95432 10987",
    age: 28,
    gender: "Female",
    bloodGroup: "AB+",
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    diagnosis: "Seasonal Allergies",
    prescription: "Cetirizine 10mg OD, Fluticasone nasal spray",
    vitalSigns: {
      heartRate: 75,
      bloodPressure: "115/72",
      temperature: 98.3,
      bloodOxygen: 99,
    },
    status: "Recovered",
    appointmentCount: 4,
  },
  {
    id: "p5",
    patientName: "Vijay Sharma",
    patientEmail: "vijay.sharma@email.com",
    patientPhone: "+91 94321 09876",
    age: 65,
    gender: "Male",
    bloodGroup: "O-",
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    diagnosis: "Osteoarthritis, Chronic Back Pain",
    prescription: "Ibuprofen 400mg TDS, Calcium supplement",
    vitalSigns: {
      heartRate: 70,
      bloodPressure: "135/85",
      temperature: 98.5,
      bloodOxygen: 96,
    },
    status: "Active",
    appointmentCount: 20,
  },
  {
    id: "p6",
    patientName: "Divya Iyer",
    patientEmail: "divya.iyer@email.com",
    patientPhone: "+91 93210 98765",
    age: 42,
    gender: "Female",
    bloodGroup: "A-",
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    diagnosis: "Hypothyroidism",
    prescription: "Levothyroxine 100mcg OD",
    vitalSigns: {
      heartRate: 65,
      bloodPressure: "120/78",
      temperature: 98.1,
      bloodOxygen: 98,
    },
    status: "Active",
    appointmentCount: 10,
  },
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientName: "Ramesh Kumar",
    patientId: "p1",
    date: new Date(),
    time: "10:00 AM",
    type: "video",
    status: "scheduled",
    symptoms: "Follow-up for blood pressure monitoring",
  },
  {
    id: "a2",
    patientName: "Kavya Nair",
    patientId: "p4",
    date: new Date(),
    time: "11:30 AM",
    type: "in-person",
    status: "scheduled",
    symptoms: "Worsening seasonal allergies",
  },
  {
    id: "a3",
    patientName: "Arun Menon",
    patientId: "p3",
    date: new Date(),
    time: "2:00 PM",
    type: "video",
    status: "scheduled",
    symptoms: "Chest discomfort, routine cardiac check",
  },
  {
    id: "a4",
    patientName: "Sneha Reddy",
    patientId: "p2",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: "9:00 AM",
    type: "video",
    status: "scheduled",
    symptoms: "Severe migraine episodes",
  },
  {
    id: "a5",
    patientName: "Vijay Sharma",
    patientId: "p5",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: "3:30 PM",
    type: "in-person",
    status: "scheduled",
    symptoms: "Back pain management review",
  },
  {
    id: "a6",
    patientName: "Divya Iyer",
    patientId: "p6",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    time: "11:00 AM",
    type: "video",
    status: "completed",
    symptoms: "Thyroid medication review",
    notes: "Increased dosage to 125mcg. Follow-up in 3 months.",
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "appointment",
    title: "New Appointment Request",
    message: "Ramesh Kumar has requested an appointment for tomorrow at 10:00 AM",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    patientName: "Ramesh Kumar",
    appointmentId: "a1",
  },
  {
    id: "n2",
    type: "report",
    title: "Lab Report Available",
    message: "Blood test results for Arun Menon are now available for review",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    patientName: "Arun Menon",
  },
  {
    id: "n3",
    type: "emergency",
    title: "Emergency Alert",
    message: "Patient Vijay Sharma triggered an emergency alert - High blood pressure detected",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    patientName: "Vijay Sharma",
  },
  {
    id: "n4",
    type: "message",
    title: "Patient Message",
    message: "Sneha Reddy sent you a message about medication side effects",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    patientName: "Sneha Reddy",
  },
  {
    id: "n5",
    type: "appointment",
    title: "Appointment Reminder",
    message: "You have 3 appointments scheduled for today",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
  },
];

// Dashboard statistics
export const getDashboardStats = (): DashboardStats => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = mockAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  });

  return {
    totalPatients: mockPatientRecords.length,
    todayAppointments: todayAppointments.length,
    completedToday: todayAppointments.filter((a) => a.status === "completed").length,
    pendingReports: mockNotifications.filter((n) => n.type === "report" && !n.read).length,
    videoConsultations: todayAppointments.filter((a) => a.type === "video").length,
    inPersonVisits: todayAppointments.filter((a) => a.type === "in-person").length,
  };
};

// Chart data for dashboard
export const getPatientGrowthData = () => {
  return [
    { month: "Jan", patients: 45 },
    { month: "Feb", patients: 52 },
    { month: "Mar", patients: 61 },
    { month: "Apr", patients: 68 },
    { month: "May", patients: 75 },
    { month: "Jun", patients: 82 },
  ];
};

export const getAppointmentTypeData = () => {
  return [
    { name: "Video", value: 65, color: "#3b82f6" },
    { name: "In-Person", value: 35, color: "#10b981" },
  ];
};

export const getDiagnosisDistribution = () => {
  return [
    { diagnosis: "Cardiovascular", count: 25 },
    { diagnosis: "Respiratory", count: 18 },
    { diagnosis: "Diabetes", count: 22 },
    { diagnosis: "Neurological", count: 15 },
    { diagnosis: "Orthopedic", count: 12 },
    { diagnosis: "Other", count: 8 },
  ];
};

export const getWeeklyAppointments = () => {
  return [
    { day: "Mon", appointments: 8 },
    { day: "Tue", appointments: 12 },
    { day: "Wed", appointments: 10 },
    { day: "Thu", appointments: 15 },
    { day: "Fri", appointments: 11 },
    { day: "Sat", appointments: 6 },
    { day: "Sun", appointments: 3 },
  ];
};
