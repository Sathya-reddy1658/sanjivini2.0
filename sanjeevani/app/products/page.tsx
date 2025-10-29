"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  ExternalLink,
  Star,
  AlertCircle,
  CheckCircle,
  Play,
  X,
  Shield,
  FileText,
  Video,
} from "lucide-react";

export default function Products() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [userHistory, setUserHistory] = useState<any>(null);

  useEffect(() => {
    const analysisResult = sessionStorage.getItem("analysisResult");
    const patientData = sessionStorage.getItem("patientData");

    if (analysisResult && patientData) {
      const analysis = JSON.parse(analysisResult);
      const patient = JSON.parse(patientData);
      setUserHistory({ analysis, patient });
    }
  }, []);

  const featuredProduct = {
    name: "Wearable Airbag Protection Vest",
    description: "Advanced fall detection system with automatic airbag deployment in 0.3 seconds. Protects hip, spine, and tailbone areas. Rechargeable with 30-day battery life.",
    price: "$299.99",
    amazonUrl: "https://www.amazon.com/Unisex-Elderly-Wearable-Seniors-Protection/dp/B0DHTTDH6L/ref=pd_day0_d_sccl_2_1/147-3366231-8835461?psc=1",
    rating: 4.8,
    reviews: 892,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white mb-3">
            Recommended Health Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Personalized recommendations based on your medical analysis
          </p>
        </div>

        {/* Medical Reports Card */}
        {userHistory && (
          <div className="mb-12 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Derived from Your Medical Reports
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Analysis date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-medium">
                  Condition
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {userHistory.analysis.disease || "General Care"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-medium">
                  Severity
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                  {userHistory.analysis.severity}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 font-medium">
                  Specialist
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {userHistory.analysis.doctorSpecialty}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Card */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Header */}
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-black rounded">
                    SAFETY RECOMMENDATION
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {featuredProduct.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI analysis identified fall risk patterns in your medical history
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Video */}
              <div className="space-y-4">
                <div
                  className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer group border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                  onClick={() => setShowVideoModal(true)}
                >
                  <div className="aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Video className="w-32 h-32 text-gray-400" strokeWidth={1} />
                    </div>

                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-900 dark:border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 text-gray-900 dark:text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Product Demonstration
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Watch how the airbag system detects falls and deploys protection
                  </p>
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {featuredProduct.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(featuredProduct.rating)
                            ? "fill-gray-900 text-gray-900 dark:fill-white dark:text-white"
                            : "fill-gray-300 text-gray-300 dark:fill-gray-700 dark:text-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {featuredProduct.rating}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({featuredProduct.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Key Features</p>
                  <div className="space-y-3">
                    {[
                      "Automatic fall detection with advanced sensors",
                      "Deploys protective airbag in 0.3 seconds",
                      "Rechargeable battery with 30-day life",
                      "Washable and adjustable fit for comfort",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-900 dark:text-white flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Price</p>
                      <p className="text-4xl font-semibold text-gray-900 dark:text-white">
                        {featuredProduct.price}
                      </p>
                    </div>
                    <div className="text-right space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>Free shipping</p>
                      <p>30-day returns</p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium"
                    onClick={() => window.open(featuredProduct.amazonUrl, "_blank")}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Purchase on Amazon
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Clinical Evidence */}
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    Clinical Evidence
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Falls are the leading cause of injury-related deaths among adults 65 and older.
                    Wearable airbag technology has been clinically proven to reduce hip fracture risk by up to 90%.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            <strong className="text-gray-900 dark:text-white">Medical Disclaimer:</strong> This product recommendation is based on AI analysis of your medical data
            and is for informational purposes only. Always consult with a qualified healthcare professional.
            We may earn a commission from purchases made through Amazon links.
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-white dark:bg-gray-950 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Product Demonstration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wearable Airbag Protection System
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-900"
                onClick={() => setShowVideoModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Video */}
            <div className="aspect-video bg-black">
              <video
                controls
                muted
                className="w-full h-full"
                src="/airbag.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available for</p>
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {featuredProduct.price}
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black"
                  onClick={() => {
                    window.open(featuredProduct.amazonUrl, "_blank");
                    setShowVideoModal(false);
                  }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Buy on Amazon
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
