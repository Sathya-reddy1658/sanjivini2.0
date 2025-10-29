import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult } from "./gemini";
import { mapToFHIRResources } from "./fhir-mapper";

export async function generateFHIRReport(
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
): Promise<void> {
  const fhirResources = mapToFHIRResources(analysis, patientData);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;

  // Helper function to add new page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header with Logo and Title - Medical Blue
  doc.setFillColor(14, 116, 144); // Medical teal/blue
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("SANJEEVANI", margin, 18);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Healthcare Intelligence Platform", margin, 27);

  doc.setFontSize(10);
  doc.text("FHIR R4 Compliant Medical Report | Powered by Gemini AI", margin, 35);

  yPosition = 55;

  // FHIR & Google Badges
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - 85, 10, 35, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FHIR R4", pageWidth - 81, 15);

  doc.setFillColor(59, 130, 246);
  doc.roundedRect(pageWidth - 45, 10, 35, 8, 2, 2, "F");
  doc.text("Google", pageWidth - 42, 15);

  // Report Metadata
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Bundle ID: ${fhirResources.bundle.id}`, margin, yPosition);
  yPosition += 7;
  doc.text(`FHIR Store: projects/sanjeevani-health/locations/us-central1/datasets/production`, margin, yPosition);
  yPosition += 12;

  // Section 1: Patient Resource
  checkPageBreak(40);
  doc.setFillColor(14, 116, 144); // Medical teal
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("1. PATIENT RESOURCE", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Resource Type: ${fhirResources.patient.resourceType}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Patient ID: ${fhirResources.patient.id}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Identifier: ${fhirResources.patient.identifier[0].value}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Name: ${fhirResources.patient.name[0].text}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Status: ${fhirResources.patient.active ? "Active" : "Inactive"}`, margin, yPosition);
  yPosition += 10;

  // Section 2: Observation Resources (Vital Signs)
  checkPageBreak(50);
  doc.setFillColor(30, 64, 175); // Professional blue
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("2. OBSERVATION RESOURCES - VITAL SIGNS", margin + 2, yPosition);
  yPosition += 10;

  fhirResources.observations.forEach((obs, index) => {
    checkPageBreak(25);
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Observation ${index + 1}: ${obs.code.text}`, margin, yPosition);
    yPosition += 5;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Resource ID: ${obs.id}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Status: ${obs.status}`, margin + 5, yPosition);
    yPosition += 5;
    doc.text(`Code: ${obs.code.coding[0].code} (${obs.code.coding[0].system})`, margin + 5, yPosition);
    yPosition += 5;

    if (obs.valueQuantity) {
      doc.setFont("helvetica", "bold");
      doc.text(`Value: ${obs.valueQuantity.value} ${obs.valueQuantity.unit}`, margin + 5, yPosition);
    } else if (obs.valueString) {
      doc.setFont("helvetica", "bold");
      doc.text(`Value: ${obs.valueString}`, margin + 5, yPosition);
    }
    yPosition += 8;
  });

  // Section 3: Condition Resource
  checkPageBreak(50);
  doc.setFillColor(185, 28, 28); // Deep clinical red
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("3. CONDITION RESOURCE - DIAGNOSIS", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Resource ID: ${fhirResources.condition.id}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Clinical Status: ${fhirResources.condition.clinicalStatus.coding[0].code}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Verification: ${fhirResources.condition.verificationStatus.coding[0].code}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Severity: ${fhirResources.condition.severity?.coding[0].display} (${analysis.severity.toUpperCase()})`, margin, yPosition);
  yPosition += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Condition: ${analysis.disease}`, margin, yPosition);
  yPosition += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const diagnosisLines = doc.splitTextToSize(`Diagnosis: ${analysis.diagnosis}`, maxWidth - 10);
  doc.text(diagnosisLines, margin, yPosition);
  yPosition += diagnosisLines.length * 5 + 5;

  doc.text(`Urgency: ${analysis.urgency}`, margin, yPosition);
  yPosition += 10;

  // Section 4: Clinical Recommendations
  checkPageBreak(40);
  doc.setFillColor(21, 128, 61); // Clinical green
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("4. CLINICAL RECOMMENDATIONS", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  analysis.recommendations.forEach((rec, index) => {
    checkPageBreak(10);
    const recLines = doc.splitTextToSize(`${index + 1}. ${rec}`, maxWidth - 10);
    doc.text(recLines, margin, yPosition);
    yPosition += recLines.length * 5 + 3;
  });
  yPosition += 5;

  // Section 5: Medication Request Resources
  if (fhirResources.medicationRequests.length > 0) {
    checkPageBreak(40);
    doc.setFillColor(124, 58, 237); // Medical purple
    doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("5. MEDICATION REQUEST RESOURCES", margin + 2, yPosition);
    yPosition += 10;

    fhirResources.medicationRequests.forEach((med, index) => {
      checkPageBreak(15);
      doc.setTextColor(124, 58, 237);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Medication ${index + 1}:`, margin, yPosition);
      yPosition += 5;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Resource ID: ${med.id}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Status: ${med.status} | Intent: ${med.intent}`, margin + 5, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Medication: ${med.medicationCodeableConcept.text}`, margin + 5, yPosition);
      yPosition += 8;
    });
    yPosition += 5;
  }

  // Section 6: Nutrition Order (Diet Plan)
  checkPageBreak(60);
  doc.setFillColor(217, 119, 6); // Professional amber
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("6. NUTRITION ORDER RESOURCE - DIET PLAN", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Resource ID: ${fhirResources.nutritionOrder.id}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Status: ${fhirResources.nutritionOrder.status} | Intent: ${fhirResources.nutritionOrder.intent}`, margin, yPosition);
  yPosition += 8;

  // Foods to Eat
  checkPageBreak(30);
  doc.setFillColor(220, 252, 231);
  doc.rect(margin, yPosition - 2, maxWidth, 6, "F");
  doc.setTextColor(22, 163, 74);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FOODS TO EAT (Recommended)", margin + 2, yPosition + 2);
  yPosition += 8;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  analysis.foodToEat.forEach((food, index) => {
    checkPageBreak(10);
    doc.text(`✓ ${food}`, margin + 5, yPosition);
    yPosition += 5;
  });
  yPosition += 5;

  // Foods to Avoid
  checkPageBreak(30);
  doc.setFillColor(254, 226, 226);
  doc.rect(margin, yPosition - 2, maxWidth, 6, "F");
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FOODS TO AVOID", margin + 2, yPosition + 2);
  yPosition += 8;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  analysis.foodToAvoid.forEach((food, index) => {
    checkPageBreak(10);
    doc.text(`✗ ${food}`, margin + 5, yPosition);
    yPosition += 5;
  });
  yPosition += 8;

  // Section 7: Home Remedies & Self-Care
  checkPageBreak(40);
  doc.setFillColor(234, 88, 12); // Professional orange
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("7. HOME REMEDIES & SELF-CARE", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  analysis.homeRemedies.forEach((remedy, index) => {
    checkPageBreak(10);
    const remedyLines = doc.splitTextToSize(`• ${remedy}`, maxWidth - 10);
    doc.text(remedyLines, margin, yPosition);
    yPosition += remedyLines.length * 5 + 3;
  });
  yPosition += 5;

  // Section 8: Prevention Methods
  checkPageBreak(40);
  doc.setFillColor(37, 99, 235); // Deep professional blue
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("8. PREVENTION METHODS", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  analysis.preventionMethods.forEach((method, index) => {
    checkPageBreak(10);
    const methodLines = doc.splitTextToSize(`• ${method}`, maxWidth - 10);
    doc.text(methodLines, margin, yPosition);
    yPosition += methodLines.length * 5 + 3;
  });
  yPosition += 5;

  // Section 9: Important Precautions
  checkPageBreak(40);
  doc.setFillColor(202, 138, 4); // Deep gold/amber
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("9. IMPORTANT PRECAUTIONS", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  analysis.precautions.forEach((precaution, index) => {
    checkPageBreak(10);
    const precautionLines = doc.splitTextToSize(`⚠ ${precaution}`, maxWidth - 10);
    doc.text(precautionLines, margin, yPosition);
    yPosition += precautionLines.length * 5 + 3;
  });
  yPosition += 8;

  // Section 10: Practitioner Resource
  checkPageBreak(30);
  doc.setFillColor(5, 150, 105); // Professional teal-green
  doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("10. RECOMMENDED PRACTITIONER RESOURCE", margin + 2, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Resource ID: ${fhirResources.practitioner.id}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Specialty: ${fhirResources.practitioner.name[0].text}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Qualification: ${fhirResources.practitioner.qualification[0].code.text}`, margin, yPosition);
  yPosition += 10;

  // Disclaimer Section
  checkPageBreak(35);
  doc.setFillColor(252, 211, 77);
  doc.rect(margin, yPosition - 2, maxWidth, 30, "F");
  doc.setTextColor(120, 53, 15);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICAL DISCLAIMER", margin + 2, yPosition + 3);
  yPosition += 7;

  doc.setFont("helvetica", "normal");
  const disclaimerText = "This FHIR-compliant report is generated using AI-powered analysis (Google Gemini API) and should not replace professional medical advice, diagnosis, or treatment. The FHIR resources are structured according to HL7 FHIR R4 specifications. Always consult with a qualified healthcare provider for proper diagnosis and treatment. This report is for informational purposes only.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, maxWidth - 10);
  doc.text(disclaimerLines, margin + 2, yPosition);
  yPosition += 30;

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(14, 116, 144); // Medical teal to match header
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Sanjeevani Healthcare Intelligence | HL7 FHIR R4 | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" }
    );
    doc.text(
      `Generated: ${new Date().toLocaleString()} | Confidential Medical Report`,
      pageWidth / 2,
      pageHeight - 3,
      { align: "center" }
    );
  }

  // Save PDF
  const fileName = `FHIR_Medical_Report_${fhirResources.patient.id}_${Date.now()}.pdf`;
  doc.save(fileName);
}
