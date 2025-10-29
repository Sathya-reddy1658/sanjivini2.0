import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface VitalSigns {
  heartRate: number;
  temperature: number;
  bloodOxygen: number;
  bloodPressure: string;
  respiratoryRate: number;
}

export interface EmergencyDetection {
  isEmergency: boolean;
  emergencyType: "cardiac_arrest" | "heart_attack" | "choking" | "stroke" | "seizure" | "none";
  severity: "critical" | "high" | "none";
  description: string;
  immediateActions: string[];
  requiresAmbulance: boolean;
  estimatedResponseTime: string;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  emergencyType: string;
  severity: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  vitals: VitalSigns;
  timestamp: Date;
  distance: string;
  description: string;
}

/**
 * Analyzes vital signs using Gemini AI to detect medical emergencies
 */
export async function detectEmergency(
  vitals: VitalSigns,
  previousVitals?: VitalSigns
): Promise<EmergencyDetection> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Calculate sudden changes if previous vitals available
    const changes = previousVitals ? {
      heartRateChange: vitals.heartRate - previousVitals.heartRate,
      tempChange: vitals.temperature - previousVitals.temperature,
      oxygenChange: vitals.bloodOxygen - previousVitals.bloodOxygen,
    } : null;

    let prompt = `You are an emergency medical AI system. Analyze the following vital signs for life-threatening emergencies:

Current Vital Signs:
- Heart Rate: ${vitals.heartRate} bpm
- Temperature: ${vitals.temperature}°F
- Blood Oxygen (SpO2): ${vitals.bloodOxygen}%
- Blood Pressure: ${vitals.bloodPressure} mmHg
- Respiratory Rate: ${vitals.respiratoryRate} breaths/min`;

    if (changes) {
      prompt += `

Sudden Changes Detected:
- Heart Rate Change: ${changes.heartRateChange > 0 ? '+' : ''}${changes.heartRateChange} bpm
- Temperature Change: ${changes.tempChange > 0 ? '+' : ''}${changes.tempChange.toFixed(1)}°F
- Oxygen Change: ${changes.oxygenChange > 0 ? '+' : ''}${changes.oxygenChange}%`;
    }

    prompt += `

Analyze for these emergency conditions:
1. Cardiac Arrest: Heart rate < 40 or > 150, sudden drop in SpO2
2. Heart Attack: Chest pain indicators, abnormal BP, heart rate changes
3. Choking: Sudden drop in SpO2 below 90%, respiratory distress
4. Stroke: Sudden changes in vitals, BP irregularities
5. Seizure: Rapid vital sign fluctuations

Provide response in JSON format:
{
  "isEmergency": true/false,
  "emergencyType": "cardiac_arrest" | "heart_attack" | "choking" | "stroke" | "seizure" | "none",
  "severity": "critical" | "high" | "none",
  "description": "Brief emergency description",
  "immediateActions": ["action1", "action2", ...],
  "requiresAmbulance": true/false,
  "estimatedResponseTime": "X minutes"
}

Be conservative - only flag as emergency if truly life-threatening.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const detection: EmergencyDetection = JSON.parse(jsonMatch[0]);
      return detection;
    }

    // Fallback detection based on critical thresholds
    return performBasicEmergencyDetection(vitals, changes);
  } catch (error) {
    console.error("Emergency detection error:", error);
    return performBasicEmergencyDetection(vitals, null);
  }
}

/**
 * Fallback emergency detection without AI
 */
function performBasicEmergencyDetection(
  vitals: VitalSigns,
  changes: any
): EmergencyDetection {
  // Cardiac Arrest Detection
  if (vitals.heartRate < 40 || vitals.heartRate > 150) {
    return {
      isEmergency: true,
      emergencyType: "cardiac_arrest",
      severity: "critical",
      description: "Critical heart rate detected. Possible cardiac arrest.",
      immediateActions: [
        "Call 108 (Ambulance) immediately",
        "Start CPR if person is unresponsive",
        "Use AED if available",
        "Continue CPR until help arrives"
      ],
      requiresAmbulance: true,
      estimatedResponseTime: "5-8 minutes"
    };
  }

  // Choking Detection
  if (vitals.bloodOxygen < 90) {
    return {
      isEmergency: true,
      emergencyType: "choking",
      severity: "critical",
      description: "Severe oxygen deprivation detected. Possible choking or respiratory failure.",
      immediateActions: [
        "Check if person is choking",
        "Perform Heimlich maneuver if conscious",
        "Call 108 (Ambulance)",
        "Start CPR if unconscious"
      ],
      requiresAmbulance: true,
      estimatedResponseTime: "5-8 minutes"
    };
  }

  // Heart Attack Detection
  if (vitals.heartRate > 100 && vitals.bloodOxygen < 95) {
    return {
      isEmergency: true,
      emergencyType: "heart_attack",
      severity: "high",
      description: "Abnormal vitals suggesting possible heart attack.",
      immediateActions: [
        "Call 108 (Ambulance) immediately",
        "Have person sit down and stay calm",
        "Give aspirin if not allergic",
        "Monitor breathing and pulse"
      ],
      requiresAmbulance: true,
      estimatedResponseTime: "8-12 minutes"
    };
  }

  // All normal
  return {
    isEmergency: false,
    emergencyType: "none",
    severity: "none",
    description: "All vital signs are within normal range.",
    immediateActions: [],
    requiresAmbulance: false,
    estimatedResponseTime: "N/A"
  };
}

/**
 * Mock emergency alerts from nearby users
 */
export function getMockEmergencyAlerts(): EmergencyAlert[] {
  return [
    {
      id: "alert1",
      userId: "user123",
      userName: "Rajesh Patel",
      emergencyType: "Cardiac Arrest",
      severity: "CRITICAL",
      location: {
        lat: 12.9698,
        lng: 79.1559,
        address: "VIT University Campus, Katpadi, Vellore, Tamil Nadu 632014"
      },
      vitals: {
        heartRate: 35,
        temperature: 98.2,
        bloodOxygen: 85,
        bloodPressure: "90/60",
        respiratoryRate: 8
      },
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      distance: "0.5 km",
      description: "Sudden cardiac arrest detected. Patient unresponsive."
    },
    {
      id: "alert2",
      userId: "user456",
      userName: "Priya Nair",
      emergencyType: "Choking",
      severity: "CRITICAL",
      location: {
        lat: 12.9716,
        lng: 79.1594,
        address: "Pappanaickenpalayam Road, Near VIT, Vellore, Tamil Nadu 632014"
      },
      vitals: {
        heartRate: 120,
        temperature: 98.6,
        bloodOxygen: 82,
        bloodPressure: "130/85",
        respiratoryRate: 25
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      distance: "1.1 km",
      description: "Severe oxygen deprivation. Possible choking incident."
    },
    {
      id: "alert3",
      userId: "user789",
      userName: "Arun Kumar",
      emergencyType: "Heart Attack",
      severity: "HIGH",
      location: {
        lat: 12.9249,
        lng: 79.1353,
        address: "Ida Scudder Road, CMC Vellore, Tamil Nadu 632004"
      },
      vitals: {
        heartRate: 115,
        temperature: 99.1,
        bloodOxygen: 92,
        bloodPressure: "150/95",
        respiratoryRate: 22
      },
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      distance: "2.3 km",
      description: "Suspected heart attack. Chest pain and abnormal vitals."
    }
  ];
}

/**
 * Get instructional video URL based on emergency type
 */
export function getEmergencyInstructionVideo(emergencyType: string): {
  title: string;
  videoUrl: string;
  duration: string;
  steps: string[];
} {
  const videos: Record<string, any> = {
    cardiac_arrest: {
      title: "CPR - Cardiopulmonary Resuscitation",
      videoUrl: "https://www.youtube.com/embed/I7q8TplMeLE",
      duration: "3:45",
      steps: [
        "Check if person is responsive",
        "Call 108 (Ambulance) immediately",
        "Place hands on center of chest",
        "Push hard and fast (100-120 compressions/min)",
        "Give 30 compressions, then 2 rescue breaths",
        "Continue until help arrives"
      ]
    },
    choking: {
      title: "Heimlich Maneuver for Choking",
      videoUrl: "https://www.youtube.com/embed/7CgtIgSyAiU",
      duration: "2:30",
      steps: [
        "Ask 'Are you choking?'",
        "Stand behind the person",
        "Make a fist above the navel",
        "Grasp fist with other hand",
        "Give quick, upward thrusts",
        "Repeat until object dislodges"
      ]
    },
    heart_attack: {
      title: "Heart Attack First Aid Response",
      videoUrl: "https://www.youtube.com/embed/g78tRADGxZY",
      duration: "3:15",
      steps: [
        "Call 108 (Ambulance) immediately",
        "Help person sit down and rest",
        "Loosen tight clothing",
        "Give aspirin if not allergic",
        "Monitor breathing and consciousness",
        "Be ready to perform CPR"
      ]
    },
    stroke: {
      title: "Stroke Recognition and Response",
      videoUrl: "https://www.youtube.com/embed/DW3RU6YEJcE",
      duration: "2:45",
      steps: [
        "Check FAST: Face, Arms, Speech, Time",
        "Call 108 (Ambulance) immediately",
        "Note time symptoms started",
        "Keep person comfortable",
        "Do NOT give food or water",
        "Monitor vital signs"
      ]
    },
    seizure: {
      title: "Seizure First Aid",
      videoUrl: "https://www.youtube.com/embed/tJHU4_wmIaw",
      duration: "3:00",
      steps: [
        "Keep person safe from injury",
        "Cushion their head",
        "Turn on side if possible",
        "Time the seizure",
        "Do NOT restrain",
        "Call 108 (Ambulance) if seizure lasts > 5 minutes"
      ]
    }
  };

  return videos[emergencyType] || videos.cardiac_arrest;
}
