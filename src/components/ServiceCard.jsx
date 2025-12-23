import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceCard({ service, index = 0 }) {
  const getServiceIcon = (id) => {
    const icons = {
      1: "👶",
      2: "👴",
      3: "🏥",
    };
    return icons[id] || "💙";
  };

  const getServiceColor = (id) => {
    const colors = {
      1: "from-pink-400 to-rose-500",
      2: "from-blue-400 to-indigo-500",
      3: "from-green-400 to-teal-500",
    };
    return colors[id] || "from-blue-400 to-purple-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className=" rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
    >
      <div
        className={`h-2 bg-gradient-to-r ${getServiceColor(service.id)}`}
      ></div>
      <div className="p-8">
        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {getServiceIcon(service.id)}
        </div>
        <h3 className="text-2xl font-bold text-gray-200 mb-3">
          {service.title}
        </h3>
        <p className="text-gray-300 mb-4">{service.description}</p>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-blue-600">
              ৳{service.price}
            </span>
            <span className="text-gray-400 text-sm ml-2">/ {service.unit}</span>
          </div>
        </div>
        <Link
          href={`/service/${service.id}`}
          className="inline-flex items-center justify-center w-full px-6 py-3 border text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          View Details
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
