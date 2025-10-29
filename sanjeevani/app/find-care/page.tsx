"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Calendar, Heart, Loader2, Phone, Clock, Star } from "lucide-react";
import Link from "next/link";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  address: string;
  phone: string;
  rating: number;
  availability: string;
  distance: string;
}

// Mock healthcare providers data
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    location: "Vellore, Tamil Nadu",
    address: "Ida Scudder Road, CMC Vellore, Tamil Nadu 632004",
    phone: "+91 416 228 1000",
    rating: 4.8,
    availability: "Available Today",
    distance: "3.5 km",
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    location: "Vellore, Tamil Nadu",
    address: "VIT University Campus, Katpadi, Vellore, Tamil Nadu 632014",
    phone: "+91 416 224 3091",
    rating: 4.9,
    availability: "Next Available: Tomorrow",
    distance: "0.5 km",
  },
  {
    id: "3",
    name: "Dr. Meera Krishnan",
    specialty: "Family Medicine",
    location: "Vellore, Tamil Nadu",
    address: "Pappanaickenpalayam Road, Near VIT, Vellore, Tamil Nadu 632014",
    phone: "+91 416 224 5000",
    rating: 4.7,
    availability: "Available Today",
    distance: "1.5 km",
  },
  {
    id: "4",
    name: "Dr. Arjun Reddy",
    specialty: "Orthopedics",
    location: "Vellore, Tamil Nadu",
    address: "Sathuvachari Main Road, Fortis Hospital, Vellore, Tamil Nadu 632009",
    phone: "+91 416 667 1000",
    rating: 4.6,
    availability: "Next Available: 2 days",
    distance: "2.8 km",
  },
  {
    id: "5",
    name: "Dr. Lakshmi Iyer",
    specialty: "Dermatology",
    location: "Vellore, Tamil Nadu",
    address: "Kilpauk Garden Road, Apollo Hospitals, Vellore, Tamil Nadu 632001",
    phone: "+91 416 223 4000",
    rating: 4.9,
    availability: "Available Today",
    distance: "5.2 km",
  },
];

export default function FindCare() {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Provider[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Filter providers based on search criteria
    let filteredProviders = mockProviders;

    if (specialty) {
      filteredProviders = filteredProviders.filter((provider) =>
        provider.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (location) {
      filteredProviders = filteredProviders.filter((provider) =>
        provider.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setResults(filteredProviders);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Find Healthcare Providers</h1>
          <p className="text-muted-foreground">
            Search for doctors, specialists, and healthcare facilities near you
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search for Care</CardTitle>
            <CardDescription>
              Enter your location, preferred specialty, and appointment date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, State or ZIP code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="specialty" className="text-sm font-medium">
                  Specialty (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="specialty"
                    type="text"
                    placeholder="Cardiology, Pediatrics, etc."
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Providers
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:underline">
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {results.length > 0 ? `Found ${results.length} Provider${results.length > 1 ? "s" : ""}` : "No Results Found"}
              </h2>
              {results.length === 0 && (
                <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
              )}
            </div>

            {results.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{provider.name}</CardTitle>
                      <CardDescription className="text-base">{provider.specialty}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{provider.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{provider.address}</p>
                        <p className="text-xs text-muted-foreground">{provider.distance} away</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${provider.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {provider.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={`text-sm font-medium ${
                          provider.availability.includes("Today")
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {provider.availability}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1">Book Appointment</Button>
                      <Button variant="outline" className="flex-1">
                        View Profile
                      </Button>
                    </div>
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
