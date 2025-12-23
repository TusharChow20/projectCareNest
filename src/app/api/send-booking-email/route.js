import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const booking = await req.json();

    await resend.emails.send({
      from: "CareNest <onboarding@resend.dev>",
      to: booking.userEmail,
      subject: `Booking Confirmation - ${booking.serviceName}`,
      html: `
        <h2>Booking Confirmed 🎉</h2>
        <p><strong>Name:</strong> ${booking.userName}</p>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Duration:</strong> ${booking.duration} ${booking.durationType}</p>
        <p><strong>Total:</strong> ৳${booking.totalCost}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ success: false }),
      { status: 500 }
    );
  }
}
