import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// Create table on first run (auto-migration)
async function ensureTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        user_name TEXT,
        service_id TEXT NOT NULL,
        service_name TEXT NOT NULL,
        service_icon TEXT,
        duration INTEGER NOT NULL,
        duration_type TEXT NOT NULL,
        location JSONB NOT NULL,
        special_instructions TEXT,
        total_cost INTEGER NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_bookings 
      ON bookings(user_id, created_at DESC)
    `;
  } catch (error) {
    console.log("Table already exists or error:", error.message);
  }
}

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

    await ensureTableExists();

    const bookings = await sql`
      SELECT 
        id,
        user_id as "userId",
        user_email as "userEmail",
        user_name as "userName",
        service_id as "serviceId",
        service_name as "serviceName",
        service_icon as "serviceIcon",
        duration,
        duration_type as "durationType",
        location,
        special_instructions as "specialInstructions",
        total_cost as "totalCost",
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM bookings
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    console.log(`✅ Found ${bookings.length} booking(s) for user ${userId}`);

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
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

    await ensureTableExists();

    // Insert booking into database
    await sql`
      INSERT INTO bookings (
        id, user_id, user_email, user_name,
        service_id, service_name, service_icon,
        duration, duration_type,
        location, special_instructions,
        total_cost, status, created_at
      ) VALUES (
        ${booking.id},
        ${booking.userId},
        ${booking.userEmail},
        ${booking.userName || null},
        ${booking.serviceId},
        ${booking.serviceName},
        ${booking.serviceIcon || null},
        ${booking.duration},
        ${booking.durationType},
        ${JSON.stringify(booking.location)},
        ${booking.specialInstructions || null},
        ${booking.totalCost},
        ${booking.status},
        NOW()
      )
    `;

    console.log("✅ Booking saved to Neon:", booking.id);

    // Send email notification (async, don't block response)
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    fetch(`${baseUrl}/api/send-booking-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    }).catch((err) => console.warn("Email send failed:", err.message));

    return NextResponse.json(
      {
        success: true,
        booking,
        message: "Booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error.message,
      },
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

    await ensureTableExists();

    // Build update query dynamically
    const updateFields = [];
    const values = [];

    if (status) {
      updateFields.push("status = $" + (values.length + 1));
      values.push(status);
    }

    if (updates) {
      Object.entries(updates).forEach(([key, value]) => {
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        updateFields.push(`${dbKey} = $${values.length + 1}`);
        values.push(value);
      });
    }

    updateFields.push("updated_at = NOW()");

    values.push(bookingId);
    values.push(userId);

    const result = await sql`
      UPDATE bookings 
      SET ${sql.raw(updateFields.join(", "))}
      WHERE id = ${bookingId} AND user_id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log("✅ Booking updated:", bookingId);

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking", details: error.message },
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

    await ensureTableExists();

    const result = await sql`
      DELETE FROM bookings
      WHERE id = ${bookingId} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log("✅ Booking deleted:", bookingId);

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking", details: error.message },
      { status: 500 }
    );
  }
}
