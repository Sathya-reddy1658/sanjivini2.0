"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { Send, Bot, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to load previous messages - this will fail with Firebase error
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const userId = auth.currentUser?.uid || "anonymous";
      const messagesRef = collection(db, "ai_conversations");
      const q = query(
        messagesRef,
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
      );
      const snapshot = await getDocs(q);

      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        sender: doc.data().sender,
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setMessages(messagesList);
    } catch (err: any) {
      console.error("Firebase error:", err);
      setError(`Firebase Error: ${err.message || "Firestore is not configured. Please add Firebase credentials."}`);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const userId = auth.currentUser?.uid || "anonymous";

      // Add user message to Firestore
      const messagesRef = collection(db, "ai_conversations");
      await addDoc(messagesRef, {
        userId,
        text: input,
        sender: "user",
        timestamp: new Date()
      });

      // Try to get AI response from Firestore
      const responsesRef = collection(db, "ai_responses");
      const q = query(responsesRef, where("question", "==", input));
      const snapshot = await getDocs(q);

      let responseText = "I'm an AI assistant powered by Firebase.";
      if (!snapshot.empty) {
        responseText = snapshot.docs[0].data().answer;
      }

      // Add bot response
      await addDoc(messagesRef, {
        userId,
        text: responseText,
        sender: "bot",
        timestamp: new Date()
      });

      setInput("");
      await loadMessages();
    } catch (err: any) {
      console.error("Firebase error:", err);
      setError(`Firebase Error: ${err.message || "Failed to send message. Firestore is not configured."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Bot className="w-16 h-16 mx-auto mb-4 text-rose-500" />
          <h1 className="text-4xl font-bold mb-2">AI Health Assistant</h1>
          <p className="text-muted-foreground">
            Get instant answers to your health-related questions
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Chat with AI Assistant</CardTitle>
            <CardDescription>
              Ask questions about symptoms, medications, or general health advice
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {error && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Firebase Configuration Required</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 && !error && (
                <div className="text-center text-muted-foreground py-8">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask a health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-muted-foreground hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
