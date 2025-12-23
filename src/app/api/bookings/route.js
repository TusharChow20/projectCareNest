import { NextResponse } from "next/server";
import {
  getBookingsByUserId,
  addBooking,
  updateBooking,
  deleteBooking,
} from "@/lib/storage";

// GET - Fetch all bookings for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const bookings = getBookingsByUserId(userId);

    // Sort by creation date (newest first)
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request) {
  try {
    const booking = await request.json();

    if (!booking.userId || !booking.serviceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate booking ID if not provided
    if (!booking.id) {
      booking.id = `BK-${Date.now()}`;
    }

    // Set default status
    if (!booking.status) {
      booking.status = "Pending";
    }

    // Set creation timestamp
    booking.createdAt = new Date().toISOString();

    // Save booking
    const success = addBooking(booking);

    if (!success) {
      throw new Error("Failed to save booking");
    }

    // Optional: Send email notification
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/send-booking-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }
      );
    } catch (emailError) {
      console.warn("Email notification failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        booking,
        message: "Booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status
export async function PATCH(request) {
  try {
    const { userId, bookingId, status, updates } = await request.json();

    if (!userId || !bookingId) {
      return NextResponse.json(
        { error: "User ID and Booking ID are required" },
        { status: 400 }
      );
    }

    const updateData = {
      ...(status && { status }),
      ...(updates && updates),
      updatedAt: new Date().toISOString(),
    };

    const success = updateBooking(bookingId, updateData);

    if (!success) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookingId = searchParams.get("bookingId");

    if (!userId || !bookingId) {
      return NextResponse.json(
        { error: "User ID and Booking ID are required" },
        { status: 400 }
      );
    }

    const success = deleteBooking(bookingId);

    if (!success) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
