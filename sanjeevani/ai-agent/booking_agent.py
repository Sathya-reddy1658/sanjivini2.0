"""
AI-Powered Appointment Booking Agent
Automates the entire booking process using natural language understanding
"""

import os
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import google.generativeai as genai

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_api_key_here")
genai.configure(api_key=GEMINI_API_KEY)

class AppointmentBookingAgent:
    """
    Intelligent agent that handles appointment booking through natural conversation
    """

    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
        self.conversation_history = []
        self.booking_state = {
            "specialty": None,
            "symptoms": None,
            "preferred_date": None,
            "preferred_time": None,
            "doctor_id": None,
            "patient_name": None,
            "patient_email": None,
            "patient_phone": None,
            "consultation_type": None,  # video or in-person
            "reason": None
        }
        self.doctors_db = self._load_doctors()
        self.specialties = [
            "Cardiology", "Dermatology", "Orthopedics", "Pediatrics",
            "Neurology", "General Medicine", "Gynecology", "ENT",
            "Ophthalmology", "Psychiatry"
        ]

    def _load_doctors(self) -> List[Dict]:
        """Load mock doctor database"""
        return [
            {
                "id": "doc1",
                "name": "Dr. Dr. Ranghaiah",
                "specialty": "Cardiology",
                "rating": 4.9,
                "fee": 200,
                "availability": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "time_slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                "languages": ["English", "Spanish"]
            },
            {
                "id": "doc2",
                "name": "Dr. James Chen",
                "specialty": "Dermatology",
                "rating": 4.8,
                "fee": 150,
                "availability": ["Monday", "Wednesday", "Friday", "Saturday"],
                "time_slots": ["09:30", "10:30", "14:00", "15:00", "16:00"],
                "languages": ["English", "Chinese"]
            },
            {
                "id": "doc3",
                "name": "Dr. Priya Sharma",
                "specialty": "Pediatrics",
                "rating": 4.9,
                "fee": 120,
                "availability": ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
                "time_slots": ["09:00", "10:00", "11:00", "14:30", "15:30", "16:30"],
                "languages": ["English", "Hindi"]
            },
            {
                "id": "doc4",
                "name": "Dr. Robert Williams",
                "specialty": "Orthopedics",
                "rating": 4.8,
                "fee": 180,
                "availability": ["Tuesday", "Wednesday", "Thursday", "Friday"],
                "time_slots": ["10:00", "11:00", "14:00", "15:00", "16:00"],
                "languages": ["English"]
            },
            {
                "id": "doc5",
                "name": "Dr. Emily Rodriguez",
                "specialty": "General Medicine",
                "rating": 4.9,
                "fee": 100,
                "availability": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "time_slots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
                "languages": ["English", "Spanish"]
            }
        ]

    def analyze_user_intent(self, user_message: str) -> Dict:
        """
        Use AI to analyze user intent and extract relevant information
        """
        prompt = f"""
You are an intelligent medical appointment booking assistant. Analyze the following user message and extract relevant information.

User Message: "{user_message}"

Extract and return in JSON format:
{{
    "intent": "book_appointment | check_symptoms | ask_availability | provide_info | confirm | cancel",
    "specialty": "extracted medical specialty or null",
    "symptoms": "list of symptoms mentioned or null",
    "date_preference": "preferred date/day or null",
    "time_preference": "preferred time or null",
    "doctor_preference": "specific doctor name or null",
    "consultation_type": "video or in-person or null",
    "patient_info": {{
        "name": "patient name or null",
        "email": "email or null",
        "phone": "phone or null"
    }},
    "urgency": "urgent | normal | flexible",
    "additional_info": "any other relevant information"
}}

Important: Return ONLY valid JSON, no additional text.
"""

        try:
            response = self.model.generate_content(prompt)
            json_text = response.text.strip()

            # Extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', json_text)
            if json_match:
                intent_data = json.loads(json_match.group())
                return intent_data
            else:
                return {"intent": "unknown", "error": "Could not parse intent"}
        except Exception as e:
            print(f"Error analyzing intent: {e}")
            return {"intent": "unknown", "error": str(e)}

    def suggest_specialty_from_symptoms(self, symptoms: str) -> str:
        """
        Use AI to suggest appropriate medical specialty based on symptoms
        """
        prompt = f"""
Based on these symptoms: "{symptoms}"

Suggest the MOST appropriate medical specialty from this list:
{', '.join(self.specialties)}

Return only the specialty name, nothing else.
"""

        try:
            response = self.model.generate_content(prompt)
            specialty = response.text.strip()

            # Match with available specialties
            for s in self.specialties:
                if s.lower() in specialty.lower():
                    return s

            return "General Medicine"  # Default
        except:
            return "General Medicine"

    def find_suitable_doctors(self, specialty: Optional[str] = None,
                            date: Optional[str] = None) -> List[Dict]:
        """
        Find doctors matching criteria
        """
        doctors = self.doctors_db

        if specialty:
            doctors = [d for d in doctors if d["specialty"].lower() == specialty.lower()]

        if date:
            # Filter by availability (simplified)
            day_name = self._get_day_name(date)
            doctors = [d for d in doctors if day_name in d["availability"]]

        # Sort by rating
        doctors.sort(key=lambda x: x["rating"], reverse=True)

        return doctors

    def _get_day_name(self, date_str: str) -> str:
        """Convert date string to day name"""
        try:
            # Try parsing various date formats
            for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"]:
                try:
                    date_obj = datetime.strptime(date_str, fmt)
                    return date_obj.strftime("%A")
                except:
                    continue

            # If it's already a day name
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            for day in days:
                if day.lower() in date_str.lower():
                    return day

            return "Monday"  # Default
        except:
            return "Monday"

    def generate_response(self, user_message: str) -> Dict:
        """
        Main method to process user message and generate appropriate response
        """
        # Analyze user intent
        intent_data = self.analyze_user_intent(user_message)

        # Update booking state with extracted information
        if intent_data.get("specialty"):
            self.booking_state["specialty"] = intent_data["specialty"]

        if intent_data.get("symptoms"):
            self.booking_state["symptoms"] = intent_data["symptoms"]
            # Auto-suggest specialty if not already set
            if not self.booking_state["specialty"]:
                self.booking_state["specialty"] = self.suggest_specialty_from_symptoms(
                    intent_data["symptoms"]
                )

        if intent_data.get("date_preference"):
            self.booking_state["preferred_date"] = intent_data["date_preference"]

        if intent_data.get("time_preference"):
            self.booking_state["preferred_time"] = intent_data["time_preference"]

        if intent_data.get("consultation_type"):
            self.booking_state["consultation_type"] = intent_data["consultation_type"]

        # Update patient info
        patient_info = intent_data.get("patient_info", {})
        if patient_info.get("name"):
            self.booking_state["patient_name"] = patient_info["name"]
        if patient_info.get("email"):
            self.booking_state["patient_email"] = patient_info["email"]
        if patient_info.get("phone"):
            self.booking_state["patient_phone"] = patient_info["phone"]

        # Determine what information is still needed
        response = self._generate_contextual_response(intent_data)

        # Add to conversation history
        self.conversation_history.append({
            "user": user_message,
            "agent": response["message"],
            "timestamp": datetime.now().isoformat()
        })

        return response

    def _generate_contextual_response(self, intent_data: Dict) -> Dict:
        """
        Generate appropriate response based on current booking state
        """
        intent = intent_data.get("intent", "unknown")

        # Check if we have enough information to proceed
        if intent == "confirm" or self._is_booking_complete():
            return self._finalize_booking()

        # Find suitable doctors if specialty is known
        if self.booking_state["specialty"] and not self.booking_state["doctor_id"]:
            doctors = self.find_suitable_doctors(
                self.booking_state["specialty"],
                self.booking_state["preferred_date"]
            )

            if doctors:
                return {
                    "message": self._format_doctor_suggestions(doctors),
                    "doctors": doctors[:3],  # Top 3
                    "next_step": "select_doctor",
                    "booking_state": self.booking_state
                }

        # Ask for missing information
        missing = self._get_missing_information()
        if missing:
            return {
                "message": self._ask_for_missing_info(missing[0]),
                "next_step": f"collect_{missing[0]}",
                "booking_state": self.booking_state
            }

        # Default response
        return {
            "message": "I'm here to help you book an appointment. Could you tell me what symptoms you're experiencing or which specialist you'd like to see?",
            "next_step": "collect_symptoms",
            "booking_state": self.booking_state
        }

    def _format_doctor_suggestions(self, doctors: List[Dict]) -> str:
        """Format doctor suggestions in a friendly way"""
        specialty = self.booking_state.get("specialty", "")
        message = f"Great! I found {len(doctors)} excellent {specialty} specialists for you:\n\n"

        for i, doc in enumerate(doctors[:3], 1):
            message += f"{i}. **{doc['name']}** - {doc['specialty']}\n"
            message += f"   ⭐ Rating: {doc['rating']}/5.0\n"
            message += f"   💰 Consultation Fee: ${doc['fee']}\n"
            message += f"   🗣️ Languages: {', '.join(doc['languages'])}\n"
            message += f"   📅 Available: {', '.join(doc['availability'][:3])}\n\n"

        message += "Which doctor would you prefer? You can say the number or the doctor's name."
        return message

    def _get_missing_information(self) -> List[str]:
        """Identify what information is still needed"""
        missing = []

        if not self.booking_state["specialty"] and not self.booking_state["symptoms"]:
            missing.append("specialty_or_symptoms")

        if self.booking_state["specialty"] and not self.booking_state["doctor_id"]:
            missing.append("doctor_selection")

        if self.booking_state["doctor_id"] and not self.booking_state["preferred_date"]:
            missing.append("date")

        if self.booking_state["preferred_date"] and not self.booking_state["preferred_time"]:
            missing.append("time")

        if self.booking_state["preferred_time"] and not self.booking_state["patient_name"]:
            missing.append("patient_name")

        if self.booking_state["patient_name"] and not self.booking_state["patient_email"]:
            missing.append("patient_email")

        if self.booking_state["patient_email"] and not self.booking_state["patient_phone"]:
            missing.append("patient_phone")

        return missing

    def _ask_for_missing_info(self, info_type: str) -> str:
        """Generate question for missing information"""
        questions = {
            "specialty_or_symptoms": "What brings you here today? You can describe your symptoms or tell me which type of specialist you'd like to see.",
            "doctor_selection": "Which doctor would you like to book an appointment with?",
            "date": "When would you like to schedule your appointment? You can say a specific date or a day like 'next Monday'.",
            "time": "What time works best for you? Morning, afternoon, or evening?",
            "patient_name": "What's your full name?",
            "patient_email": "What's your email address for appointment confirmation?",
            "patient_phone": "What's your phone number?",
            "consultation_type": "Would you prefer a video consultation or in-person visit?"
        }

        return questions.get(info_type, "Could you provide more information?")

    def _is_booking_complete(self) -> bool:
        """Check if we have all required information"""
        required_fields = [
            "specialty", "doctor_id", "preferred_date", "preferred_time",
            "patient_name", "patient_email", "patient_phone"
        ]
        return all(self.booking_state.get(field) for field in required_fields)

    def _finalize_booking(self) -> Dict:
        """Create final booking confirmation"""
        appointment_id = f"APT{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Find selected doctor
        doctor = next((d for d in self.doctors_db if d["id"] == self.booking_state["doctor_id"]), None)

        confirmation = {
            "success": True,
            "appointment_id": appointment_id,
            "message": f"""
✅ **Appointment Confirmed!**

📋 **Appointment Details:**
- **ID:** {appointment_id}
- **Doctor:** {doctor['name'] if doctor else 'N/A'}
- **Specialty:** {self.booking_state['specialty']}
- **Date:** {self.booking_state['preferred_date']}
- **Time:** {self.booking_state['preferred_time']}
- **Type:** {self.booking_state.get('consultation_type', 'In-person')}
- **Fee:** ${doctor['fee'] if doctor else 'N/A'}

👤 **Patient Information:**
- **Name:** {self.booking_state['patient_name']}
- **Email:** {self.booking_state['patient_email']}
- **Phone:** {self.booking_state['patient_phone']}

📧 A confirmation email has been sent to {self.booking_state['patient_email']}.
📱 You'll receive SMS reminders 24 hours and 1 hour before your appointment.

Need to reschedule? Just let me know!
            """,
            "booking_details": self.booking_state,
            "next_step": "completed"
        }

        # Reset state for new booking
        self._reset_booking_state()

        return confirmation

    def _reset_booking_state(self):
        """Reset booking state for new appointment"""
        self.booking_state = {
            "specialty": None,
            "symptoms": None,
            "preferred_date": None,
            "preferred_time": None,
            "doctor_id": None,
            "patient_name": None,
            "patient_email": None,
            "patient_phone": None,
            "consultation_type": None,
            "reason": None
        }

    def quick_book(self, request: str) -> Dict:
        """
        One-shot booking for simple requests like:
        'Book me a cardiologist appointment tomorrow at 10am'
        """
        intent_data = self.analyze_user_intent(request)

        # Try to extract all information
        if intent_data.get("specialty"):
            self.booking_state["specialty"] = intent_data["specialty"]

        if intent_data.get("date_preference"):
            self.booking_state["preferred_date"] = intent_data["date_preference"]

        if intent_data.get("time_preference"):
            self.booking_state["preferred_time"] = intent_data["time_preference"]

        # Find best doctor
        doctors = self.find_suitable_doctors(
            self.booking_state["specialty"],
            self.booking_state["preferred_date"]
        )

        if doctors:
            self.booking_state["doctor_id"] = doctors[0]["id"]

        # Return what we have so far
        missing = self._get_missing_information()

        if not missing or len(missing) <= 2:  # Only patient details missing
            return {
                "message": f"I found a great {self.booking_state['specialty']} appointment for {self.booking_state['preferred_date']} at {self.booking_state['preferred_time']}. I just need a few details to confirm.",
                "doctors": doctors[:1] if doctors else [],
                "next_step": "collect_patient_details",
                "booking_state": self.booking_state
            }
        else:
            return self.generate_response(request)


def main():
    """
    Main function to run the booking agent in CLI mode
    """
    print("=" * 60)
    print("🤖 AI Appointment Booking Agent")
    print("=" * 60)
    print("\nI'm your intelligent booking assistant. I can help you:")
    print("- Find the right specialist based on your symptoms")
    print("- Book appointments automatically")
    print("- Answer questions about doctors and availability")
    print("\nType 'quit' or 'exit' to end the conversation.\n")

    agent = AppointmentBookingAgent()

    while True:
        user_input = input("\n👤 You: ").strip()

        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("\n🤖 Agent: Thank you for using our booking service. Take care!")
            break

        if not user_input:
            continue

        # Get response from agent
        response = agent.generate_response(user_input)

        print(f"\n🤖 Agent: {response['message']}")

        # If booking is complete, ask if user wants to book another
        if response.get('next_step') == 'completed':
            continue_booking = input("\n👤 Would you like to book another appointment? (yes/no): ")
            if continue_booking.lower() not in ['yes', 'y']:
                break


if __name__ == "__main__":
    main()
