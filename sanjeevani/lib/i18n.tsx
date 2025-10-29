"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es" | "hi" | "fr" | "de";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Header
    home: "Home",
    connectDevice: "Connect Your Device",
    services: "Services",
    resources: "Resources",
    patientLogin: "Patient Login",
    findCare: "Find Care",

    // Services
    findHospitals: "Find Hospitals",
    aiHealthAssistant: "AI Health Assistant",
    emergencyServices: "Emergency Services",
    bookAppointment: "Book Appointment",

    // Resources
    healthArticles: "Health Articles",
    faqs: "FAQs",
    patientEducation: "Patient Education",

    // Device page
    deviceMonitoring: "Device Monitoring",
    realTimeMetrics: "Real-time health metrics from your wearable device",
    deviceConnected: "Device Connected",
    deviceDisconnected: "Device Disconnected",
    lastUpdate: "Last update",

    // Health metrics
    heartRate: "Heart Rate",
    temperature: "Temperature",
    bloodOxygen: "Blood Oxygen",
    bloodPressure: "Blood Pressure",
    respiratoryRate: "Respiratory Rate",
    stepsToday: "Steps Today",
    caloriesBurned: "Calories Burned",

    // Common
    search: "Search",
    loading: "Loading",
    backToHome: "Back to Home",
  },
  es: {
    // Header
    home: "Inicio",
    connectDevice: "Conectar Tu Dispositivo",
    services: "Servicios",
    resources: "Recursos",
    patientLogin: "Inicio de Sesión",
    findCare: "Encontrar Atención",

    // Services
    findHospitals: "Buscar Hospitales",
    aiHealthAssistant: "Asistente de Salud IA",
    emergencyServices: "Servicios de Emergencia",
    bookAppointment: "Reservar Cita",

    // Resources
    healthArticles: "Artículos de Salud",
    faqs: "Preguntas Frecuentes",
    patientEducation: "Educación del Paciente",

    // Device page
    deviceMonitoring: "Monitoreo de Dispositivo",
    realTimeMetrics: "Métricas de salud en tiempo real desde tu dispositivo portátil",
    deviceConnected: "Dispositivo Conectado",
    deviceDisconnected: "Dispositivo Desconectado",
    lastUpdate: "Última actualización",

    // Health metrics
    heartRate: "Frecuencia Cardíaca",
    temperature: "Temperatura",
    bloodOxygen: "Oxígeno en Sangre",
    bloodPressure: "Presión Arterial",
    respiratoryRate: "Frecuencia Respiratoria",
    stepsToday: "Pasos Hoy",
    caloriesBurned: "Calorías Quemadas",

    // Common
    search: "Buscar",
    loading: "Cargando",
    backToHome: "Volver al Inicio",
  },
  hi: {
    // Header
    home: "होम",
    connectDevice: "अपना उपकरण कनेक्ट करें",
    services: "सेवाएं",
    resources: "संसाधन",
    patientLogin: "रोगी लॉगिन",
    findCare: "देखभाल खोजें",

    // Services
    findHospitals: "अस्पताल खोजें",
    aiHealthAssistant: "AI स्वास्थ्य सहायक",
    emergencyServices: "आपातकालीन सेवाएं",
    bookAppointment: "अपॉइंटमेंट बुक करें",

    // Resources
    healthArticles: "स्वास्थ्य लेख",
    faqs: "सामान्य प्रश्न",
    patientEducation: "रोगी शिक्षा",

    // Device page
    deviceMonitoring: "उपकरण निगरानी",
    realTimeMetrics: "आपके पहनने योग्य उपकरण से वास्तविक समय स्वास्थ्य मेट्रिक्स",
    deviceConnected: "उपकरण कनेक्टेड",
    deviceDisconnected: "उपकरण डिस्कनेक्टेड",
    lastUpdate: "अंतिम अपडेट",

    // Health metrics
    heartRate: "हृदय गति",
    temperature: "तापमान",
    bloodOxygen: "रक्त ऑक्सीजन",
    bloodPressure: "रक्तचाप",
    respiratoryRate: "श्वसन दर",
    stepsToday: "आज कदम",
    caloriesBurned: "कैलोरी बर्न",

    // Common
    search: "खोजें",
    loading: "लोड हो रहा है",
    backToHome: "होम पर वापस",
  },
  fr: {
    // Header
    home: "Accueil",
    connectDevice: "Connecter Votre Appareil",
    services: "Services",
    resources: "Ressources",
    patientLogin: "Connexion Patient",
    findCare: "Trouver des Soins",

    // Services
    findHospitals: "Trouver des Hôpitaux",
    aiHealthAssistant: "Assistant Santé IA",
    emergencyServices: "Services d'Urgence",
    bookAppointment: "Prendre Rendez-vous",

    // Resources
    healthArticles: "Articles de Santé",
    faqs: "FAQ",
    patientEducation: "Éducation des Patients",

    // Device page
    deviceMonitoring: "Surveillance de l'Appareil",
    realTimeMetrics: "Métriques de santé en temps réel de votre appareil portable",
    deviceConnected: "Appareil Connecté",
    deviceDisconnected: "Appareil Déconnecté",
    lastUpdate: "Dernière mise à jour",

    // Health metrics
    heartRate: "Fréquence Cardiaque",
    temperature: "Température",
    bloodOxygen: "Oxygène Sanguin",
    bloodPressure: "Pression Artérielle",
    respiratoryRate: "Fréquence Respiratoire",
    stepsToday: "Pas Aujourd'hui",
    caloriesBurned: "Calories Brûlées",

    // Common
    search: "Rechercher",
    loading: "Chargement",
    backToHome: "Retour à l'Accueil",
  },
  de: {
    // Header
    home: "Startseite",
    connectDevice: "Gerät Verbinden",
    services: "Dienstleistungen",
    resources: "Ressourcen",
    patientLogin: "Patientenanmeldung",
    findCare: "Pflege Finden",

    // Services
    findHospitals: "Krankenhäuser Finden",
    aiHealthAssistant: "KI-Gesundheitsassistent",
    emergencyServices: "Notfalldienste",
    bookAppointment: "Termin Buchen",

    // Resources
    healthArticles: "Gesundheitsartikel",
    faqs: "Häufig Gestellte Fragen",
    patientEducation: "Patientenaufklärung",

    // Device page
    deviceMonitoring: "Geräteüberwachung",
    realTimeMetrics: "Echtzeit-Gesundheitsmetriken von Ihrem tragbaren Gerät",
    deviceConnected: "Gerät Verbunden",
    deviceDisconnected: "Gerät Getrennt",
    lastUpdate: "Letztes Update",

    // Health metrics
    heartRate: "Herzfrequenz",
    temperature: "Temperatur",
    bloodOxygen: "Blutsauerstoff",
    bloodPressure: "Blutdruck",
    respiratoryRate: "Atemfrequenz",
    stepsToday: "Schritte Heute",
    caloriesBurned: "Verbrannte Kalorien",

    // Common
    search: "Suchen",
    loading: "Laden",
    backToHome: "Zurück zur Startseite",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "hi" as Language, name: "हिन्दी", flag: "🇮🇳" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
];
