// src/app/services/page.js
"use client";

import { motion } from "framer-motion";
import ServiceCard from "@/components/ServiceCard";

export default function ServicesPage() {
  const allServices = [
    {
      id: 1,
      title: "Baby Sitting",
      description:
        "Professional and caring baby sitters for your little ones. Safe, trusted, and experienced caregivers who understand child development.",
      icon: "👶",
      price: 500,
      unit: "hour",
      features: [
        "Age-appropriate activities",
        "Meal preparation",
        "Homework help",
        "Emergency trained",
      ],
    },
    {
      id: 2,
      title: "Elderly Care",
      description:
        "Compassionate care for seniors with assistance in daily activities, companionship, and medical support for better quality of life.",
      icon: "👴",
      price: 600,
      unit: "hour",
      features: [
        "Personal care",
        "Medication reminders",
        "Companionship",
        "Light housekeeping",
      ],
    },
    {
      id: 3,
      title: "Sick People Care",
      description:
        "Specialized home care for patients with medical assistance, recovery support, and comfort in familiar surroundings.",
      icon: "🏥",
      price: 700,
      unit: "hour",
      features: [
        "Nursing care",
        "Vital monitoring",
        "Post-surgery care",
        "IV therapy",
      ],
    },
    {
      id: 4,
      title: "Disability Care",
      description:
        "Dedicated support for individuals with disabilities, helping them maintain independence and dignity in daily life.",
      icon: "♿",
      price: 650,
      unit: "hour",
      features: [
        "Mobility assistance",
        "Personal care",
        "Therapy support",
        "Adaptive equipment help",
      ],
    },
    {
      id: 5,
      title: "Overnight Care",
      description:
        "24-hour care service providing peace of mind with round-the-clock attention for your loved ones at home.",
      icon: "🌙",
      price: 800,
      unit: "hour",
      features: [
        "Night monitoring",
        "Emergency response",
        "Sleep assistance",
        "Medication management",
      ],
    },
    {
      id: 6,
      title: "Companion Care",
      description:
        "Social companionship service reducing loneliness and isolation with engaging activities and meaningful conversations.",
      icon: "💙",
      price: 450,
      unit: "hour",
      features: [
        "Social activities",
        "Meal companionship",
        "Light errands",
        "Emotional support",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-200 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Care Services
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive caregiving solutions tailored to meet your
              family&apos;s unique needs. Professional, compassionate, and
              always available when you need us most.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2  px-4 py-2 rounded-full shadow-md">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">Verified Caregivers</span>
              </div>
              <div className="flex items-center space-x-2  px-4 py-2 rounded-full shadow-md">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2  px-4 py-2 rounded-full shadow-md">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-medium">Flexible Scheduling</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Can't Find What You Need?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We offer customized care plans to meet your specific requirements.
              Contact us to discuss your unique situation.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
