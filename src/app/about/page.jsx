// src/app/about/page.js
"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  const team = [
    { name: "Dr. Sarah Ahmed", role: "Chief Medical Officer", icon: "👩‍⚕️" },
    { name: "Michael Chen", role: "Operations Director", icon: "👨‍💼" },
    { name: "Fatima Rahman", role: "Care Coordinator", icon: "👩‍💻" },
    { name: "James Wilson", role: "Training Manager", icon: "👨‍🏫" },
  ];

  const values = [
    {
      icon: "🛡️",
      title: "Safety First",
      description:
        "Every caregiver undergoes rigorous background checks and continuous training to ensure the highest safety standards.",
    },
    {
      icon: "❤️",
      title: "Compassionate Care",
      description:
        "We believe in treating every client with dignity, respect, and genuine compassion as if they were our own family.",
    },
    {
      icon: "⭐",
      title: "Excellence",
      description:
        "We maintain the highest standards of care through ongoing training, quality assurance, and client feedback.",
    },
    {
      icon: "🤝",
      title: "Trust & Transparency",
      description:
        "Open communication and honest relationships form the foundation of everything we do at CareNest.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Families Served", icon: "👨‍👩‍👧‍👦" },
    { number: "500+", label: "Certified Caregivers", icon: "👥" },
    { number: "15+", label: "Years Experience", icon: "📅" },
    { number: "98%", label: "Client Satisfaction", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20  text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About CareNest
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Bringing professional, compassionate care to families across
              Bangladesh since 2010
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-100 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  CareNest was founded with a simple but powerful mission: to
                  provide families with access to trusted, professional
                  caregiving services that bring peace of mind and improve
                  quality of life.
                </p>
                <p>
                  What started as a small team of dedicated caregivers has grown
                  into Bangladesh's leading care service platform, serving
                  thousands of families and employing hundreds of certified
                  professionals.
                </p>
                <p>
                  Today, we continue to uphold our founding values of
                  compassion, excellence, and trust while expanding our services
                  to meet the evolving needs of modern families.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square   rounded-2xl flex items-center justify-center text-9xl">
                💙
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-300 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-200 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-300">
              Dedicated professionals committed to excellence in care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className=" rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow"
              >
                <div className="text-7xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Join the CareNest Family
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience the peace of mind that comes from knowing your loved
              ones are in safe, caring hands
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/services"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-transparent border transform hover:scale-105 transition-all shadow-lg"
              >
                Browse Services
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
