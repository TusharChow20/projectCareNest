"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  const allServices = [
    {
      id: 1,
      title: "Baby Sitting",
      description:
        "Professional and caring baby sitters for your little ones. Safe, trusted, and experienced caregivers who understand child development.",
      image:
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800&q=80",
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
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-md">
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
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-md">
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
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-md">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {service.title}
                      </h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-white">
                          ৳{service.price}
                        </span>
                        <span className="text-sm text-gray-200">
                          /{service.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <svg
                            className="w-5 h-5 text-green-500 flex-shrink-0"
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
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/service/${service.id}`}
                      className="block w-full text-center px-6 py-3 border text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Can&apos;t Find What You Need?
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
