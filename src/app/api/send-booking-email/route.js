import nodemailer from "nodemailer";

export function GET() {
  console.log("✅ GET route hit");
  return Response.json({ message: "API is alive" });
}

export async function POST(req) {
  console.log("🔥 POST route hit");

  try {
    const booking = await req.json();
    console.log("📦 Booking received:", booking);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🔐 EMAIL_USER:", process.env.EMAIL_USER ? "OK" : "MISSING");
    console.log("🔐 EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "MISSING");

    const info = await transporter.sendMail({
      from: `"CareNest" <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: "TEST EMAIL",
      text: "If you received this, Nodemailer works 🎉",
    });

    console.log("✅ Email sent:", info.messageId);

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Nodemailer FULL ERROR:", error);
    return new Response("Email failed", { status: 500 });
  }
}
