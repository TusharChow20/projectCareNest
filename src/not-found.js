"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="text-6xl mb-4">🤔</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/#services"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse Services
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-gray-300"
        >
          <p className="text-gray-600 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/#services"
              className="text-blue-600 hover:text-purple-600 font-medium"
            >
              Our Services
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/#about"
              className="text-blue-600 hover:text-purple-600 font-medium"
            >
              About Us
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/my-bookings"
              className="text-blue-600 hover:text-purple-600 font-medium"
            >
              My Bookings
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/#contact"
              className="text-blue-600 hover:text-purple-600 font-medium"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
