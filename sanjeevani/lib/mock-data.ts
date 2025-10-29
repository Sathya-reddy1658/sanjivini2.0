export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  availability: "available" | "busy" | "offline";
  hospital: string;
  phone: string;
  email: string;
  consultationFee: number;
  languages: string[];
  image: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  emergency: string;
  email: string;
  website: string;
  rating: number;
  distance: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  departments: string[];
  facilities: string[];
  hours: string;
  emergencyHours: string;
}

export const mockDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Priya Sharma",
    specialty: "Emergency Medicine",
    qualification: "MBBS, MD (Emergency Medicine)",
    experience: 15,
    rating: 4.9,
    availability: "available",
    hospital: "CMC Vellore",
    phone: "+91 98765 43210",
    email: "priya.sharma@cmcvellore.ac.in",
    consultationFee: 800,
    languages: ["English", "Hindi", "Tamil"],
    image: "/api/placeholder/100/100",
  },
  {
    id: "doc2",
    name: "Dr. Arjun Reddy",
    specialty: "General Physician",
    qualification: "MBBS, MD (General Medicine)",
    experience: 12,
    rating: 4.8,
    availability: "available",
    hospital: "Apollo Hospitals Vellore",
    phone: "+91 97654 32109",
    email: "arjun.reddy@apollovellore.com",
    consultationFee: 600,
    languages: ["English", "Telugu", "Tamil"],
    image: "/api/placeholder/100/100",
  },
  {
    id: "doc3",
    name: "Dr. Meera Krishnan",
    specialty: "Internal Medicine",
    qualification: "MBBS, MD, DNB",
    experience: 18,
    rating: 4.9,
    availability: "busy",
    hospital: "Fortis Hospital Vellore",
    phone: "+91 96543 21098",
    email: "meera.krishnan@fortis.in",
    consultationFee: 900,
    languages: ["English", "Tamil", "Malayalam"],
    image: "/api/placeholder/100/100",
  },
  {
    id: "doc4",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: 20,
    rating: 4.9,
    availability: "available",
    hospital: "GKNM Hospital",
    phone: "+91 95432 10987",
    email: "rajesh.kumar@gknm.org",
    consultationFee: 1200,
    languages: ["English", "Hindi", "Tamil"],
    image: "/api/placeholder/100/100",
  },
];

export const mockHospitals: Hospital[] = [
  {
    id: "hosp1",
    name: "Christian Medical College (CMC) Vellore",
    type: "Multi-Specialty Tertiary Care Hospital",
    address: "Ida Scudder Road",
    city: "Vellore",
    state: "Tamil Nadu",
    zipCode: "632004",
    phone: "+91 416 228 1000",
    emergency: "+91 416 228 2102",
    email: "info@cmcvellore.ac.in",
    website: "www.cmch-vellore.edu",
    rating: 4.9,
    distance: "3.5 km",
    coordinates: { lat: 12.9249, lng: 79.1353 },
    departments: [
      "Emergency",
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Pediatrics",
      "Oncology",
      "Nephrology",
    ],
    facilities: [
      "24/7 Emergency",
      "ICU",
      "NICU",
      "Operation Theater",
      "Pharmacy",
      "Blood Bank",
      "Laboratory",
      "Radiology",
      "Ambulance Service",
    ],
    hours: "24/7",
    emergencyHours: "24/7",
  },
  {
    id: "hosp2",
    name: "Apollo Hospitals Vellore",
    type: "Multi-Specialty Hospital",
    address: "Kilpauk Garden Road, Thillaiganga Nagar",
    city: "Vellore",
    state: "Tamil Nadu",
    zipCode: "632001",
    phone: "+91 416 223 4000",
    emergency: "+91 416 223 4999",
    email: "info@apollovellore.com",
    website: "www.apollohospitals.com",
    rating: 4.7,
    distance: "5.2 km",
    coordinates: { lat: 12.9165, lng: 79.1325 },
    departments: [
      "Emergency",
      "Cardiology",
      "Neurosurgery",
      "Gastroenterology",
      "Orthopedics",
      "Pediatrics",
    ],
    facilities: [
      "24/7 Emergency",
      "ICU",
      "NICU",
      "Blood Bank",
      "Pharmacy",
      "Advanced Diagnostics",
      "CT Scan",
      "MRI",
    ],
    hours: "24/7",
    emergencyHours: "24/7",
  },
  {
    id: "hosp3",
    name: "Fortis Hospital Vellore",
    type: "Multi-Specialty Hospital",
    address: "Sathuvachari Main Road",
    city: "Vellore",
    state: "Tamil Nadu",
    zipCode: "632009",
    phone: "+91 416 667 1000",
    emergency: "+91 416 667 1911",
    email: "vellore@fortishealthcare.com",
    website: "www.fortishealthcare.com",
    rating: 4.6,
    distance: "2.8 km",
    coordinates: { lat: 12.9698, lng: 79.1452 },
    departments: [
      "Cardiology",
      "Neurology",
      "Oncology",
      "Nephrology",
      "Gastroenterology",
      "Urology",
    ],
    facilities: [
      "Advanced Diagnostics",
      "Cath Lab",
      "MRI",
      "CT Scan",
      "24/7 Emergency",
      "ICU",
      "Dialysis Center",
    ],
    hours: "24/7",
    emergencyHours: "24/7",
  },
  {
    id: "hosp4",
    name: "GKNM Hospital",
    type: "Multi-Specialty Hospital",
    address: "Pappanaickenpalayam Road, Near VIT",
    city: "Vellore",
    state: "Tamil Nadu",
    zipCode: "632014",
    phone: "+91 416 224 5000",
    emergency: "+91 416 224 5108",
    email: "info@gknmhospital.org",
    website: "www.gknmhospital.org",
    rating: 4.8,
    distance: "1.5 km",
    coordinates: { lat: 12.9716, lng: 79.1594 },
    departments: [
      "Interventional Cardiology",
      "Cardiac Surgery",
      "Neurology",
      "Orthopedics",
      "General Medicine",
    ],
    facilities: [
      "24/7 Cardiac Emergency",
      "Cardiac Cath Lab",
      "Operation Theater",
      "ICU",
      "Pharmacy",
      "Laboratory",
    ],
    hours: "24/7",
    emergencyHours: "24/7",
  },
  {
    id: "hosp5",
    name: "VIT Health Centre",
    type: "Campus Medical Centre",
    address: "VIT University Campus, Katpadi",
    city: "Vellore",
    state: "Tamil Nadu",
    zipCode: "632014",
    phone: "+91 416 224 3091",
    emergency: "+91 416 224 3092",
    email: "healthcentre@vit.ac.in",
    website: "www.vit.ac.in",
    rating: 4.5,
    distance: "0.5 km",
    coordinates: { lat: 12.9698, lng: 79.1559 },
    departments: [
      "General Medicine",
      "Dental",
      "Emergency Care",
      "Preventive Medicine",
    ],
    facilities: [
      "24/7 Emergency",
      "Pharmacy",
      "Laboratory",
      "X-Ray",
      "Ambulance Service",
    ],
    hours: "24/7",
    emergencyHours: "24/7",
  },
];
