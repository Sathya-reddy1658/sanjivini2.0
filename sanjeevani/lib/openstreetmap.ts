// Indian Pincode to Coordinates mapping for Vellore area
const pincodeToCoordinates: Record<string, { lat: number; lon: number; city: string }> = {
  // Vellore area pincodes
  "632001": { lat: 12.9165, lon: 79.1325, city: "Vellore" },
  "632002": { lat: 12.9200, lon: 79.1300, city: "Vellore" },
  "632003": { lat: 12.9180, lon: 79.1400, city: "Vellore" },
  "632004": { lat: 12.9249, lon: 79.1353, city: "Vellore" },
  "632006": { lat: 12.9100, lon: 79.1450, city: "Vellore" },
  "632009": { lat: 12.9698, lon: 79.1452, city: "Vellore" },
  "632014": { lat: 12.9698, lon: 79.1559, city: "Vellore (VIT)" },
  "632055": { lat: 12.9800, lon: 79.1600, city: "Katpadi" },
  // Nearby areas
  "632101": { lat: 12.8500, lon: 79.1200, city: "Ranipet" },
  "632102": { lat: 12.8600, lon: 79.1300, city: "Ranipet" },
  "632401": { lat: 12.7000, lon: 79.3000, city: "Tirupattur" },
  "632601": { lat: 12.5500, lon: 78.9500, city: "Ambur" },
};

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Hospital {
  id: string;
  name: string;
  distance: number;
  address: string;
  phone: string;
  type: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get coordinates from pincode
export async function getPincodeCoordinates(pincode: string): Promise<Coordinates | null> {
  // Remove any whitespace
  const cleanPincode = pincode.trim();

  // Check our local database first
  if (pincodeToCoordinates[cleanPincode]) {
    return {
      lat: pincodeToCoordinates[cleanPincode].lat,
      lon: pincodeToCoordinates[cleanPincode].lon,
    };
  }

  // If not found, return VIT campus as default (for demo purposes)
  console.log(`Pincode ${cleanPincode} not found, using default VIT location`);
  return {
    lat: 12.9698,
    lon: 79.1559,
  };
}

// Get hospitals near coordinates
export async function getHospitalsNearby(coordinates: Coordinates): Promise<Hospital[]> {
  // Local hospital data for Vellore area
  const hospitals = [
    {
      id: "hosp1",
      name: "Christian Medical College (CMC) Vellore",
      address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
      phone: "+91 416 228 1000",
      type: "Multi-Specialty Tertiary Care Hospital",
      coordinates: { lat: 12.9249, lon: 79.1353 },
    },
    {
      id: "hosp2",
      name: "Apollo Hospitals Vellore",
      address: "Kilpauk Garden Road, Thillaiganga Nagar, Vellore, Tamil Nadu 632001",
      phone: "+91 416 223 4000",
      type: "Multi-Specialty Hospital",
      coordinates: { lat: 12.9165, lon: 79.1325 },
    },
    {
      id: "hosp3",
      name: "Fortis Hospital Vellore",
      address: "Sathuvachari Main Road, Vellore, Tamil Nadu 632009",
      phone: "+91 416 667 1000",
      type: "Multi-Specialty Hospital",
      coordinates: { lat: 12.9698, lon: 79.1452 },
    },
    {
      id: "hosp4",
      name: "GKNM Hospital",
      address: "Pappanaickenpalayam Road, Near VIT, Vellore, Tamil Nadu 632014",
      phone: "+91 416 224 5000",
      type: "Multi-Specialty Hospital",
      coordinates: { lat: 12.9716, lon: 79.1594 },
    },
    {
      id: "hosp5",
      name: "VIT Health Centre",
      address: "VIT University Campus, Katpadi, Vellore, Tamil Nadu 632014",
      phone: "+91 416 224 3091",
      type: "Campus Medical Centre",
      coordinates: { lat: 12.9698, lon: 79.1559 },
    },
    {
      id: "hosp6",
      name: "Aravind Eye Hospital Vellore",
      address: "Thotapalayam Road, Vellore, Tamil Nadu 632004",
      phone: "+91 416 222 5000",
      type: "Eye Care Specialist Hospital",
      coordinates: { lat: 12.9320, lon: 79.1280 },
    },
    {
      id: "hosp7",
      name: "Lakshmi Hospitals",
      address: "Gandhi Road, Vellore, Tamil Nadu 632006",
      phone: "+91 416 222 3456",
      type: "General Hospital",
      coordinates: { lat: 12.9100, lon: 79.1450 },
    },
  ];

  // Calculate distance for each hospital
  const hospitalsWithDistance = hospitals.map((hospital) => ({
    ...hospital,
    distance: calculateDistance(
      coordinates.lat,
      coordinates.lon,
      hospital.coordinates.lat,
      hospital.coordinates.lon
    ),
  }));

  // Sort by distance
  hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

  return hospitalsWithDistance;
}

// Format hospital data for display
export function formatHospitalData(hospital: Hospital, userLat: number, userLon: number): Hospital {
  return {
    ...hospital,
    distance: calculateDistance(userLat, userLon, hospital.coordinates.lat, hospital.coordinates.lon),
  };
}

// Get doctors near coordinates
export async function getDoctorsNearby(coordinates: Coordinates) {
  const doctors = [
    {
      id: "doc1",
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      hospital: "CMC Vellore",
      address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
      phone: "+91 416 228 1000",
      consultationFee: 1200,
      rating: 4.9,
      coordinates: { lat: 12.9249, lon: 79.1353 },
    },
    {
      id: "doc2",
      name: "Dr. Lakshmi Iyer",
      specialty: "Dermatology",
      hospital: "Apollo Hospitals Vellore",
      address: "Kilpauk Garden Road, Thillaiganga Nagar, Vellore, Tamil Nadu 632001",
      phone: "+91 416 223 4000",
      consultationFee: 800,
      rating: 4.8,
      coordinates: { lat: 12.9165, lon: 79.1325 },
    },
    {
      id: "doc3",
      name: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      hospital: "VIT Health Centre",
      address: "VIT University Campus, Katpadi, Vellore, Tamil Nadu 632014",
      phone: "+91 416 224 3091",
      consultationFee: 700,
      rating: 4.9,
      coordinates: { lat: 12.9698, lon: 79.1559 },
    },
    {
      id: "doc4",
      name: "Dr. Arjun Reddy",
      specialty: "Orthopedics",
      hospital: "Fortis Hospital Vellore",
      address: "Sathuvachari Main Road, Vellore, Tamil Nadu 632009",
      phone: "+91 416 667 1000",
      consultationFee: 1000,
      rating: 4.8,
      coordinates: { lat: 12.9698, lon: 79.1452 },
    },
    {
      id: "doc5",
      name: "Dr. Meera Krishnan",
      specialty: "General Medicine",
      hospital: "GKNM Hospital",
      address: "Pappanaickenpalayam Road, Near VIT, Vellore, Tamil Nadu 632014",
      phone: "+91 416 224 5000",
      consultationFee: 600,
      rating: 4.9,
      coordinates: { lat: 12.9716, lon: 79.1594 },
    },
    {
      id: "doc6",
      name: "Dr. Vikram Patel",
      specialty: "Neurology",
      hospital: "CMC Vellore",
      address: "Ida Scudder Road, Vellore, Tamil Nadu 632004",
      phone: "+91 416 228 1000",
      consultationFee: 1100,
      rating: 4.9,
      coordinates: { lat: 12.9249, lon: 79.1353 },
    },
    {
      id: "doc7",
      name: "Dr. Ananya Das",
      specialty: "Ophthalmology",
      hospital: "Aravind Eye Hospital Vellore",
      address: "Thotapalayam Road, Vellore, Tamil Nadu 632004",
      phone: "+91 416 222 5000",
      consultationFee: 500,
      rating: 4.9,
      coordinates: { lat: 12.9320, lon: 79.1280 },
    },
  ];

  // Calculate distance for each doctor
  const doctorsWithDistance = doctors.map((doctor) => ({
    ...doctor,
    distance: calculateDistance(
      coordinates.lat,
      coordinates.lon,
      doctor.coordinates.lat,
      doctor.coordinates.lon
    ),
  }));

  // Sort by distance
  doctorsWithDistance.sort((a, b) => a.distance - b.distance);

  return doctorsWithDistance;
}
