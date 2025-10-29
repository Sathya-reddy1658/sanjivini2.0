export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  qualification: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  videoConsultation?: boolean;
  inPersonConsultation?: boolean;
  languages: string[];
  image: string;
  hospital: string;
  address: string;
  about: string;
  availability: DayAvailability[];
  nextAvailable: Date;
}

export interface DayAvailability {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available?: boolean;
  isBooked?: boolean;
  type: "morning" | "afternoon" | "evening";
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: Date;
  time: string;
  duration: number;
  fee: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  type: "video" | "in-person";
  reason: string;
  notes?: string;
  createdAt: Date;
}

export const specialties = [
  {
    name: "Cardiology",
    icon: "❤️",
    description: "Heart and cardiovascular system",
    subSpecialties: ["Interventional Cardiology", "Pediatric Cardiology", "Electrophysiology"]
  },
  {
    name: "Dermatology",
    icon: "🩺",
    description: "Skin, hair, and nail conditions",
    subSpecialties: ["Cosmetic Dermatology", "Pediatric Dermatology", "Dermatopathology"]
  },
  {
    name: "Orthopedics",
    icon: "🦴",
    description: "Bones, joints, and muscles",
    subSpecialties: ["Sports Medicine", "Joint Replacement", "Spine Surgery"]
  },
  {
    name: "Pediatrics",
    icon: "👶",
    description: "Children's health and development",
    subSpecialties: ["Neonatology", "Pediatric Cardiology", "Developmental Pediatrics"]
  },
  {
    name: "Neurology",
    icon: "🧠",
    description: "Brain and nervous system",
    subSpecialties: ["Stroke Medicine", "Epilepsy", "Movement Disorders"]
  },
  {
    name: "General Medicine",
    icon: "⚕️",
    description: "Primary healthcare and general illnesses",
    subSpecialties: ["Family Medicine", "Internal Medicine", "Preventive Medicine"]
  },
  {
    name: "Gynecology",
    icon: "👩",
    description: "Women's reproductive health",
    subSpecialties: ["Obstetrics", "Fertility", "Menopause Management"]
  },
  {
    name: "ENT",
    icon: "👂",
    description: "Ear, nose, and throat",
    subSpecialties: ["Audiology", "Rhinology", "Head and Neck Surgery"]
  },
  {
    name: "Ophthalmology",
    icon: "👁️",
    description: "Eye care and vision",
    subSpecialties: ["Retina", "Cataract Surgery", "Glaucoma"]
  },
  {
    name: "Psychiatry",
    icon: "🧘",
    description: "Mental health and wellness",
    subSpecialties: ["Child Psychiatry", "Addiction Medicine", "Geriatric Psychiatry"]
  }
];

// Generate time slots for availability
const generateAvailabilitySlots = (day: string): TimeSlot[] => {
  const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  const afternoonSlots = ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];
  const eveningSlots = ["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"];

  const slots: TimeSlot[] = [];

  morningSlots.forEach(time => {
    slots.push({ time, available: Math.random() > 0.3, type: "morning" });
  });

  afternoonSlots.forEach(time => {
    slots.push({ time, available: Math.random() > 0.3, type: "afternoon" });
  });

  eveningSlots.forEach(time => {
    slots.push({ time, available: Math.random() > 0.4, type: "evening" });
  });

  return slots;
};

// Generate time slots for booking (used in booking page)
export const generateTimeSlots = (startTime: string, endTime: string, date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
  ];

  times.forEach((time, index) => {
    const hour = parseInt(time.split(":")[0]);
    const isPM = time.includes("PM");
    const actualHour = isPM && hour !== 12 ? hour + 12 : hour;

    let type: "morning" | "afternoon" | "evening" = "morning";
    if (actualHour >= 14 && actualHour < 17) type = "afternoon";
    else if (actualHour >= 17) type = "evening";

    slots.push({
      time,
      isBooked: Math.random() > 0.7, // 30% chance slot is already booked
      type
    });
  });

  return slots;
};

export const mockDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: 15,
    rating: 4.9,
    reviewCount: 245,
    consultationFee: 1200,
    videoConsultation: true,
    inPersonConsultation: true,
    languages: ["English", "Hindi", "Tamil"],
    image: "/api/placeholder/400/400",
    hospital: "CMC Vellore",
    address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
    about: "Dr. Kumar is a board-certified cardiologist specializing in interventional procedures. He has performed over 2000 successful cardiac catheterizations and is known for his patient-centered approach.",
    availability: [
      { day: "Monday", slots: generateAvailabilitySlots("Monday") },
      { day: "Tuesday", slots: generateAvailabilitySlots("Tuesday") },
      { day: "Wednesday", slots: generateAvailabilitySlots("Wednesday") },
      { day: "Thursday", slots: generateAvailabilitySlots("Thursday") },
      { day: "Friday", slots: generateAvailabilitySlots("Friday") },
    ],
    nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "doc2",
    name: "Dr. Lakshmi Iyer",
    specialty: "Dermatology",
    subSpecialty: "Cosmetic Dermatology",
    qualification: "MBBS, MD (Dermatology), DDV",
    experience: 12,
    rating: 4.8,
    reviewCount: 189,
    consultationFee: 800,
    videoConsultation: true,
    inPersonConsultation: true,
    languages: ["English", "Tamil", "Malayalam"],
    image: "/api/placeholder/400/400",
    hospital: "Apollo Hospitals Vellore",
    address: "Kilpauk Garden Road, Thillaiganga Nagar, Vellore, Tamil Nadu 632001",
    about: "Dr. Iyer specializes in both medical and cosmetic dermatology with expertise in advanced laser treatments, anti-aging procedures, and skin cancer detection.",
    availability: [
      { day: "Monday", slots: generateAvailabilitySlots("Monday") },
      { day: "Wednesday", slots: generateAvailabilitySlots("Wednesday") },
      { day: "Friday", slots: generateAvailabilitySlots("Friday") },
      { day: "Saturday", slots: generateAvailabilitySlots("Saturday") },
    ],
    nextAvailable: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "doc3",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    subSpecialty: "Developmental Pediatrics",
    qualification: "MBBS, MD (Pediatrics), DCH",
    experience: 10,
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 700,
    videoConsultation: true,
    inPersonConsultation: true,
    languages: ["English", "Hindi", "Tamil"],
    image: "/api/placeholder/400/400",
    hospital: "VIT Health Centre",
    address: "VIT University Campus, Katpadi, Vellore, Tamil Nadu 632014",
    about: "Dr. Sharma is passionate about children's health and development. She provides comprehensive care from newborns to adolescents, with special interest in developmental milestones.",
    availability: [
      { day: "Monday", slots: generateAvailabilitySlots("Monday") },
      { day: "Tuesday", slots: generateAvailabilitySlots("Tuesday") },
      { day: "Thursday", slots: generateAvailabilitySlots("Thursday") },
      { day: "Friday", slots: generateAvailabilitySlots("Friday") },
      { day: "Saturday", slots: generateAvailabilitySlots("Saturday") },
    ],
    nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: "doc4",
    name: "Dr. Arjun Reddy",
    specialty: "Orthopedics",
    subSpecialty: "Sports Medicine",
    qualification: "MBBS, MS (Ortho), DNB",
    experience: 18,
    rating: 4.8,
    reviewCount: 198,
    consultationFee: 1000,
    videoConsultation: false,
    inPersonConsultation: true,
    languages: ["English", "Telugu", "Tamil"],
    image: "/api/placeholder/400/400",
    hospital: "Fortis Hospital Vellore",
    address: "Sathuvachari Main Road, Vellore, Tamil Nadu 632009",
    about: "Dr. Reddy specializes in sports injuries and orthopedic surgery. He has worked with professional athletes and is known for innovative treatment approaches.",
    availability: [
      { day: "Tuesday", slots: generateAvailabilitySlots("Tuesday") },
      { day: "Wednesday", slots: generateAvailabilitySlots("Wednesday") },
      { day: "Thursday", slots: generateAvailabilitySlots("Thursday") },
      { day: "Friday", slots: generateAvailabilitySlots("Friday") },
    ],
    nextAvailable: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "doc5",
    name: "Dr. Meera Krishnan",
    specialty: "General Medicine",
    subSpecialty: "Family Medicine",
    qualification: "MBBS, MD (General Medicine), DNB",
    experience: 14,
    rating: 4.9,
    reviewCount: 456,
    consultationFee: 600,
    videoConsultation: true,
    inPersonConsultation: true,
    languages: ["English", "Tamil", "Malayalam"],
    image: "/api/placeholder/400/400",
    hospital: "GKNM Hospital",
    address: "Pappanaickenpalayam Road, Near VIT, Vellore, Tamil Nadu 632014",
    about: "Dr. Krishnan provides comprehensive primary care for the entire family. She emphasizes preventive medicine and building long-term relationships with patients.",
    availability: [
      { day: "Monday", slots: generateAvailabilitySlots("Monday") },
      { day: "Tuesday", slots: generateAvailabilitySlots("Tuesday") },
      { day: "Wednesday", slots: generateAvailabilitySlots("Wednesday") },
      { day: "Thursday", slots: generateAvailabilitySlots("Thursday") },
      { day: "Friday", slots: generateAvailabilitySlots("Friday") },
    ],
    nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: "doc6",
    name: "Dr. Vikram Patel",
    specialty: "Neurology",
    subSpecialty: "Stroke Medicine",
    qualification: "MBBS, MD, DM (Neurology)",
    experience: 16,
    rating: 4.9,
    reviewCount: 167,
    consultationFee: 1100,
    videoConsultation: true,
    inPersonConsultation: false,
    languages: ["English", "Hindi", "Gujarati"],
    image: "/api/placeholder/400/400",
    hospital: "CMC Vellore",
    address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
    about: "Dr. Patel is an expert in neurological disorders with special focus on stroke prevention and treatment. He uses cutting-edge diagnostic tools and treatment protocols.",
    availability: [
      { day: "Monday", slots: generateAvailabilitySlots("Monday") },
      { day: "Wednesday", slots: generateAvailabilitySlots("Wednesday") },
      { day: "Thursday", slots: generateAvailabilitySlots("Thursday") },
      { day: "Friday", slots: generateAvailabilitySlots("Friday") },
    ],
    nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  }
];

// Export as both mockDoctors and doctors for compatibility
export const doctors = mockDoctors;

export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    doctorId: "doc1",
    doctorName: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    patientName: "Arun Kumar",
    patientEmail: "arun.kumar@example.com",
    patientPhone: "+91 98765 43210",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    duration: 30,
    fee: 1200,
    status: "confirmed",
    type: "in-person",
    reason: "Routine checkup",
    createdAt: new Date()
  },
  {
    id: "apt2",
    doctorId: "doc3",
    doctorName: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    patientName: "Deepa Nair",
    patientEmail: "deepa.nair@example.com",
    patientPhone: "+91 97654 32109",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "02:30 PM",
    duration: 30,
    fee: 700,
    status: "pending",
    type: "video",
    reason: "Child vaccination",
    createdAt: new Date()
  }
];
