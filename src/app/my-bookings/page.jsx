"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toast from "@/components/Toast";
import Image from "next/image";
import Swal from "sweetalert2";

export default function MyBookingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/my-bookings");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userId = user.uid || user.email;
        const res = await fetch(
          `/api/bookings?userId=${encodeURIComponent(userId)}`
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setToast({ message: "Failed to load bookings", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const userId = user.uid || user.email;
      const res = await fetch(`/api/bookings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          bookingId: bookingId,
          status: "Cancelled",
        }),
      });

      if (!res.ok) throw new Error("Failed to cancel booking");

      // Update the local state to reflect the change
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "Cancelled" } : b
        )
      );

      Swal.fire({
        title: "Cancelled!",
        text: "Your booking has been cancelled successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to cancel booking. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "Delete Booking?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const userId = user.uid || user.email;
      const res = await fetch(
        `/api/bookings?userId=${encodeURIComponent(
          userId
        )}&bookingId=${bookingId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete booking");

      // Remove the booking from local state
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));

      Swal.fire({
        title: "Deleted!",
        text: "Your booking has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete booking. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const filteredBookings = bookings.filter((b) =>
    filter === "all" ? true : b.status.toLowerCase() === filter
  );

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return map[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen py-8 md:py-12">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-300">
            Manage and track all your service bookings
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex gap-2 rounded-lg p-2">
            {["all", "pending", "confirmed", "completed", "cancelled"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 md:px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-all ${
                    filter === s
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        {/* Empty */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-200 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-400 mb-6">
              {filter === "all"
                ? "You haven't made any bookings yet"
                : `No ${filter} bookings found`}
            </p>
            <button
              onClick={() => router.push("/#services")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-4 md:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={booking.serviceIcon}
                        alt={booking.serviceName}
                        width={70}
                        height={70}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-gray-200">
                          {booking.serviceName}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 text-sm font-semibold border rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-gray-200">
                      <p>
                        ⏱ {booking.duration} {booking.durationType}
                      </p>
                      <p className="text-blue-500 font-bold text-lg">
                        ৳{booking.totalCost}
                      </p>
                      <p className="text-sm text-gray-400">
                        Booked on {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <div className="space-y-3 text-gray-300 text-sm">
                      <p>
                        📍 {booking.location.fullAddress},{" "}
                        {booking.location.city}
                      </p>
                      {booking.specialInstructions && (
                        <p>ℹ {booking.specialInstructions}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        router.push(`/service/${booking.serviceId}`)
                      }
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      View Service
                    </button>

                    {booking.status === "Pending" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === "Completed" && (
                      <button
                        onClick={() =>
                          router.push(`/booking/${booking.serviceId}`)
                        }
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                      >
                        Book Again
                      </button>
                    )}

                    {(booking.status === "Cancelled" ||
                      booking.status === "Completed") && (
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
