"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const heroImages = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80",
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  const services = [
    {
      id: 1,
      title: "Baby Sitting",
      description:
        "Professional and caring babysitters you can trust with your children.",
      icon: "👶",
    },
    {
      id: 2,
      title: "Elderly Care",
      description:
        "Compassionate senior care with daily assistance and companionship.",
      icon: "👴",
    },
    {
      id: 3,
      title: "Medical Home Care",
      description:
        "Specialized support for patients needing medical attention at home.",
      icon: "🏥",
    },
  ];

  const stats = [
    { number: "5000+", label: "Families Served" },
    { number: "500+", label: "Verified Caregivers" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="bg-[#0B0F19] text-gray-100">
      {/* HERO */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Care That Feels
              <span className="block bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Like Home
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-400 max-w-xl">
              Trusted caregiving services designed for families who value
              safety, dignity, and peace of mind.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/services"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Explore Services
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src={heroImages[currentImage]}
              alt="Caregiving service"
              fill
              priority
              className="relative w-full h-[420px] rounded-2xl overflow-hidden"
            />

            <div className="absolute inset-0 bg-black/40 flex items-end p-6">
              <p className="text-lg font-semibold text-white">
                Trusted Care for Your Loved Ones
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-blue-400">
                {stat.number}
              </div>
              <p className="mt-2 text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Our Services</h2>
            <p className="mt-4 text-gray-400">
              Reliable care solutions tailored to your family’s needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#111827] p-8 rounded-2xl border border-gray-800 hover:border-blue-600 transition"
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <Link
                  href={`/service/${service.id}`}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Learn more →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">What Families Say</h2>
            <p className="mt-4 text-gray-400">
              Real stories from families who trust CareNest
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Ayesha Rahman",
                role: "Mother of 2",
                text: "CareNest gave us peace of mind. The babysitter was professional, caring, and reliable.",
              },
              {
                name: "Mahmud Hasan",
                role: "Son & Caregiver",
                text: "The elderly care service was outstanding. My father felt respected and comfortable.",
              },
              {
                name: "Nusrat Jahan",
                role: "Working Professional",
                text: "Medical home care support was timely and compassionate. Highly recommended.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#111827] p-8 rounded-2xl border border-gray-800"
              >
                <p className="text-gray-300 mb-6">“{t.text}”</p>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-400">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="max-w-2xl mx-auto text-blue-100 mb-8">
          Join thousands of families who trust CareNest for professional,
          reliable caregiving.
        </p>
        <Link
          href="/register"
          className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:scale-105 transition"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
