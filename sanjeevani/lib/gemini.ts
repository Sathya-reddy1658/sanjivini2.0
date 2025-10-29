import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface AnalysisResult {
  severity: "low" | "medium" | "high";
  diagnosis: string;
  recommendations: string[];
  urgency: string;
  requiresConsultation: boolean;
  disease: string;
  preventionMethods: string[];
  homeRemedies: string[];
  doctorSpecialty: string;
  foodToAvoid: string[];
  foodToEat: string[];
  medicines: string[];
  precautions: string[];
}

export async function analyzeSymptoms(
  symptoms: string,
  severityLevel: string,
  image?: File,
  vitalSigns?: {
    heartRate: number;
    temperature: number;
    bloodOxygen: number;
    bloodPressure: string;
  }
): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = `You are a medical AI assistant. Analyze the following patient information and provide a detailed assessment:

Symptoms: ${symptoms}
Patient-reported Severity: ${severityLevel}`;

    if (vitalSigns) {
      prompt += `

Current Vital Signs:
- Heart Rate: ${vitalSigns.heartRate} bpm
- Temperature: ${vitalSigns.temperature}°F
- Blood Oxygen: ${vitalSigns.bloodOxygen}%
- Blood Pressure: ${vitalSigns.bloodPressure} mmHg`;
    }

    prompt += `

Please provide a comprehensive structured analysis in the following JSON format:
{
  "severity": "low" | "medium" | "high",
  "diagnosis": "Brief preliminary diagnosis",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "urgency": "Description of how urgent this case is",
  "requiresConsultation": true/false (true if severity is high or medium),
  "disease": "Name of the potential condition or disease",
  "preventionMethods": ["prevention method 1", "prevention method 2", ...],
  "homeRemedies": ["home remedy 1", "home remedy 2", ...],
  "doctorSpecialty": "Recommended medical specialist (e.g., Cardiologist, Dermatologist, General Physician)",
  "foodToAvoid": ["food item 1", "food item 2", ...],
  "foodToEat": ["healthy food 1", "healthy food 2", ...],
  "medicines": ["over-the-counter medicine 1", "medicine 2", ...] (only suggest OTC medicines, mention 'Prescription required' for others),
  "precautions": ["precaution 1", "precaution 2", ...]
}

Consider the vital signs when determining severity. High heart rate, abnormal temperature, or low blood oxygen should increase severity level.
Provide practical, actionable advice that patients can follow while seeking professional medical care.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0]);
      return analysisResult;
    }

    // Fallback if JSON parsing fails
    return {
      severity: severityLevel === "high" ? "high" : severityLevel === "medium" ? "medium" : "low",
      diagnosis: "Unable to parse AI response. Please consult a doctor.",
      recommendations: ["Seek medical attention", "Monitor symptoms closely"],
      urgency: "Please consult with a healthcare provider",
      requiresConsultation: true,
      disease: "Condition requires medical evaluation",
      preventionMethods: ["Maintain good hygiene", "Regular health checkups"],
      homeRemedies: ["Rest adequately", "Stay hydrated"],
      doctorSpecialty: "General Physician",
      foodToAvoid: ["Processed foods", "Excessive sugar"],
      foodToEat: ["Fresh fruits", "Vegetables", "Whole grains"],
      medicines: ["Consult doctor for appropriate medication"],
      precautions: ["Monitor symptoms", "Avoid strenuous activities"],
    };
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Fallback analysis based on severity and vital signs
    const isVitalsAbnormal = vitalSigns && (
      vitalSigns.heartRate > 100 ||
      vitalSigns.heartRate < 60 ||
      vitalSigns.temperature > 100 ||
      vitalSigns.bloodOxygen < 95
    );

    const severity: "low" | "medium" | "high" =
      severityLevel === "high" || isVitalsAbnormal
        ? "high"
        : severityLevel === "medium"
        ? "medium"
        : "low";

    return {
      severity,
      diagnosis: `Based on your symptoms (${symptoms}), we recommend seeking medical attention.`,
      recommendations: [
        "Monitor your symptoms closely",
        severity === "high"
          ? "Seek immediate medical attention"
          : "Schedule an appointment with a healthcare provider",
        "Keep track of any changes in symptoms",
      ],
      urgency:
        severity === "high"
          ? "High priority - immediate consultation recommended"
          : severity === "medium"
          ? "Moderate priority - consultation within 24 hours"
          : "Low priority - can schedule regular appointment",
      requiresConsultation: severity !== "low",
      disease: "Condition based on reported symptoms",
      preventionMethods: [
        "Regular hand washing",
        "Maintain healthy lifestyle",
        "Get adequate rest",
        "Stay hydrated"
      ],
      homeRemedies: [
        "Rest and relaxation",
        "Drink plenty of fluids",
        "Maintain comfortable temperature",
        "Eat nutritious meals"
      ],
      doctorSpecialty: "General Physician",
      foodToAvoid: [
        "Processed foods",
        "High sugar items",
        "Spicy foods",
        "Fried foods"
      ],
      foodToEat: [
        "Fresh fruits",
        "Vegetables",
        "Lean proteins",
        "Whole grains",
        "Plenty of water"
      ],
      medicines: [
        "Consult healthcare provider for appropriate medication",
        "Pain relievers (if needed, as directed)",
        "Follow doctor's prescription"
      ],
      precautions: [
        "Avoid strenuous activities",
        "Monitor vital signs regularly",
        "Maintain good hygiene",
        "Get adequate sleep"
      ],
    };
  }
}
