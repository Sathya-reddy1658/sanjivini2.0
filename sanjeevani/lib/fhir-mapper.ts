import type { AnalysisResult } from "./gemini";

// FHIR R4 Resource Types
export interface FHIRPatient {
  resourceType: "Patient";
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
    profile: string[];
  };
  identifier: Array<{
    system: string;
    value: string;
  }>;
  active: boolean;
  name: Array<{
    use: string;
    text: string;
  }>;
  gender?: string;
  birthDate?: string;
}

export interface FHIRObservation {
  resourceType: "Observation";
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  status: "final" | "preliminary" | "registered";
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  effectiveDateTime: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  valueString?: string;
}

export interface FHIRCondition {
  resourceType: "Condition";
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  clinicalStatus: {
    coding: Array<{
      system: string;
      code: string;
    }>;
  };
  verificationStatus: {
    coding: Array<{
      system: string;
      code: string;
    }>;
  };
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  severity?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  onsetDateTime: string;
  recordedDate: string;
  note?: Array<{
    text: string;
  }>;
}

export interface FHIRMedicationRequest {
  resourceType: "MedicationRequest";
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  status: "active" | "draft" | "completed";
  intent: "proposal" | "plan" | "order";
  medicationCodeableConcept: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  authoredOn: string;
  requester?: {
    reference: string;
  };
  note?: Array<{
    text: string;
  }>;
}

export interface FHIRPractitioner {
  resourceType: "Practitioner";
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  identifier: Array<{
    system: string;
    value: string;
  }>;
  active: boolean;
  name: Array<{
    use: string;
    text: string;
  }>;
  qualification: Array<{
    code: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
      text: string;
    };
  }>;
}

export interface FHIRNutritionOrder {
  resourceType: "NutritionOrder";
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  status: "draft" | "active" | "on-hold" | "completed" | "cancelled";
  intent: "proposal" | "plan" | "order";
  patient: {
    reference: string;
  };
  dateTime: string;
  orderer?: {
    reference: string;
  };
  oralDiet?: {
    type?: Array<{
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
      text: string;
    }>;
    nutrient?: Array<{
      modifier?: {
        coding: Array<{
          system: string;
          code: string;
          display: string;
        }>;
        text: string;
      };
    }>;
    texture?: Array<{
      modifier?: {
        coding: Array<{
          system: string;
          code: string;
          display: string;
        }>;
      };
    }>;
    instruction?: string;
  };
}

export interface FHIRBundle {
  resourceType: "Bundle";
  id: string;
  meta: {
    lastUpdated: string;
    source: string;
  };
  type: "collection" | "document" | "message" | "transaction";
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: any;
  }>;
}

// Generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Map Gemini Analysis to FHIR Resources
export function mapToFHIRResources(
  analysis: AnalysisResult,
  patientData: {
    name?: string;
    symptoms: string;
    vitalSigns?: {
      heartRate: number;
      temperature: number;
      bloodOxygen: number;
      bloodPressure: string;
    };
  }
): {
  patient: FHIRPatient;
  observations: FHIRObservation[];
  condition: FHIRCondition;
  medicationRequests: FHIRMedicationRequest[];
  practitioner: FHIRPractitioner;
  nutritionOrder: FHIRNutritionOrder;
  bundle: FHIRBundle;
} {
  const timestamp = getCurrentTimestamp();
  const patientId = generateId();
  const baseUrl = "https://healthcare.googleapis.com/v1/projects/sanjeevani-health/locations/us-central1/datasets/production/fhirStores/main/fhir";

  // Patient Resource
  const patient: FHIRPatient = {
    resourceType: "Patient",
    id: patientId,
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      source: "#gemini-ai-analysis",
      profile: ["http://hl7.org/fhir/StructureDefinition/Patient"],
    },
    identifier: [
      {
        system: "urn:oid:sanjeevani.patient.id",
        value: `PAT-${patientId}`,
      },
    ],
    active: true,
    name: [
      {
        use: "official",
        text: patientData.name || "Patient",
      },
    ],
  };

  // Observation Resources (Vital Signs)
  const observations: FHIRObservation[] = [];

  if (patientData.vitalSigns) {
    // Heart Rate
    observations.push({
      resourceType: "Observation",
      id: generateId(),
      meta: {
        versionId: "1",
        lastUpdated: timestamp,
        source: "#vital-signs-monitor",
      },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8867-4",
            display: "Heart rate",
          },
        ],
        text: "Heart Rate",
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: patientData.vitalSigns.heartRate,
        unit: "beats/minute",
        system: "http://unitsofmeasure.org",
        code: "/min",
      },
    });

    // Temperature
    observations.push({
      resourceType: "Observation",
      id: generateId(),
      meta: {
        versionId: "1",
        lastUpdated: timestamp,
        source: "#vital-signs-monitor",
      },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8310-5",
            display: "Body temperature",
          },
        ],
        text: "Body Temperature",
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: patientData.vitalSigns.temperature,
        unit: "degrees Fahrenheit",
        system: "http://unitsofmeasure.org",
        code: "[degF]",
      },
    });

    // Blood Oxygen
    observations.push({
      resourceType: "Observation",
      id: generateId(),
      meta: {
        versionId: "1",
        lastUpdated: timestamp,
        source: "#vital-signs-monitor",
      },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "2708-6",
            display: "Oxygen saturation in Arterial blood",
          },
        ],
        text: "Oxygen Saturation",
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: timestamp,
      valueQuantity: {
        value: patientData.vitalSigns.bloodOxygen,
        unit: "%",
        system: "http://unitsofmeasure.org",
        code: "%",
      },
    });

    // Blood Pressure
    observations.push({
      resourceType: "Observation",
      id: generateId(),
      meta: {
        versionId: "1",
        lastUpdated: timestamp,
        source: "#vital-signs-monitor",
      },
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "85354-9",
            display: "Blood pressure panel",
          },
        ],
        text: "Blood Pressure",
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      effectiveDateTime: timestamp,
      valueString: patientData.vitalSigns.bloodPressure,
    });
  }

  // Symptoms Observation
  observations.push({
    resourceType: "Observation",
    id: generateId(),
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      source: "#patient-reported",
    },
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "survey",
            display: "Survey",
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "75325-1",
          display: "Symptom",
        },
      ],
      text: "Patient Reported Symptoms",
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: timestamp,
    valueString: patientData.symptoms,
  });

  // Condition Resource
  const severityCode =
    analysis.severity === "high" ? "24484000" :
    analysis.severity === "medium" ? "6736007" : "255604002";

  const severityDisplay =
    analysis.severity === "high" ? "Severe" :
    analysis.severity === "medium" ? "Moderate" : "Mild";

  const condition: FHIRCondition = {
    resourceType: "Condition",
    id: generateId(),
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      source: "#gemini-ai-diagnosis",
    },
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          code: "active",
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
          code: "provisional",
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-category",
            code: "encounter-diagnosis",
            display: "Encounter Diagnosis",
          },
        ],
      },
    ],
    severity: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: severityCode,
          display: severityDisplay,
        },
      ],
    },
    code: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "404684003",
          display: analysis.disease,
        },
      ],
      text: analysis.disease,
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    onsetDateTime: timestamp,
    recordedDate: timestamp,
    note: [
      {
        text: `AI Analysis: ${analysis.diagnosis}. Urgency: ${analysis.urgency}`,
      },
    ],
  };

  // Medication Request Resources
  const medicationRequests: FHIRMedicationRequest[] = analysis.medicines.map((medicine) => ({
    resourceType: "MedicationRequest",
    id: generateId(),
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      source: "#gemini-ai-treatment-plan",
    },
    status: "draft",
    intent: "proposal",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: generateId(),
          display: medicine,
        },
      ],
      text: medicine,
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    authoredOn: timestamp,
    note: [
      {
        text: "AI-suggested medication. Consult healthcare provider before use.",
      },
    ],
  }));

  // Practitioner Resource
  const practitioner: FHIRPractitioner = {
    resourceType: "Practitioner",
    id: generateId(),
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      source: "#sanjeevani-directory",
    },
    identifier: [
      {
        system: "urn:oid:sanjeevani.practitioner.id",
        value: `PRAC-${generateId()}`,
      },
    ],
    active: true,
    name: [
      {
        use: "official",
        text: `${analysis.doctorSpecialty} Specialist`,
      },
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0360",
              code: "MD",
              display: "Doctor of Medicine",
            },
          ],
          text: analysis.doctorSpecialty,
        },
      },
    ],
  };

  // Nutrition Order Resource (Diet Plan)
  const nutritionOrder: FHIRNutritionOrder = {
    resourceType: "NutritionOrder",
    id: generateId(),
    meta: {
      versionId: "1",
      lastUpdated: timestamp,
      source: "#gemini-ai-nutrition-plan",
    },
    status: "active",
    intent: "plan",
    patient: {
      reference: `Patient/${patientId}`,
    },
    dateTime: timestamp,
    oralDiet: {
      type: [
        {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "435801000124108",
              display: "Therapeutic diet",
            },
          ],
          text: "AI-Recommended Therapeutic Diet",
        },
      ],
      instruction: `FOODS TO EAT:\n${analysis.foodToEat.join('\n')}\n\nFOODS TO AVOID:\n${analysis.foodToAvoid.join('\n')}\n\nHOME REMEDIES:\n${analysis.homeRemedies.join('\n')}\n\nPREVENTION METHODS:\n${analysis.preventionMethods.join('\n')}\n\nPRECAUTIONS:\n${analysis.precautions.join('\n')}`,
    },
  };

  // Create FHIR Bundle
  const bundle: FHIRBundle = {
    resourceType: "Bundle",
    id: generateId(),
    meta: {
      lastUpdated: timestamp,
      source: "#sanjeevani-gemini-integration",
    },
    type: "collection",
    timestamp: timestamp,
    entry: [
      {
        fullUrl: `${baseUrl}/Patient/${patient.id}`,
        resource: patient,
      },
      ...observations.map((obs) => ({
        fullUrl: `${baseUrl}/Observation/${obs.id}`,
        resource: obs,
      })),
      {
        fullUrl: `${baseUrl}/Condition/${condition.id}`,
        resource: condition,
      },
      ...medicationRequests.map((med) => ({
        fullUrl: `${baseUrl}/MedicationRequest/${med.id}`,
        resource: med,
      })),
      {
        fullUrl: `${baseUrl}/Practitioner/${practitioner.id}`,
        resource: practitioner,
      },
      {
        fullUrl: `${baseUrl}/NutritionOrder/${nutritionOrder.id}`,
        resource: nutritionOrder,
      },
    ],
  };

  return {
    patient,
    observations,
    condition,
    medicationRequests,
    practitioner,
    nutritionOrder,
    bundle,
  };
}
