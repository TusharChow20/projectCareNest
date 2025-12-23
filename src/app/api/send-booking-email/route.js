import nodemailer from "nodemailer";

export function GET() {
  return Response.json({ message: "Booking email API is active" });
}

export async function POST(req) {
  console.log("📧 Email API called");

  try {
    const booking = await req.json();
    console.log("📋 Processing booking:", booking.id);

    // Validate required fields
    if (!booking.userEmail || !booking.serviceName) {
      console.error("❌ Missing required fields");
      return Response.json(
        { success: false, error: "Missing required booking data" },
        { status: 400 }
      );
    }

    // SOLUTION: Try multiple connection methods
    // Method 1: Use port 587 with STARTTLS (more likely to work)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Changed from 465 to 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
      connectionTimeout: 10000, // 10 second timeout
      greetingTimeout: 10000,
    });

    console.log("🔐 Email config:", {
      user: process.env.EMAIL_USER ? "✓ Set" : "✗ Missing",
      pass: process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing",
      port: 587,
    });

    // Verify transporter (with timeout)
    console.log("🔐 Verifying email credentials...");
    try {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Verification timeout")), 10000)
        ),
      ]);
      console.log("✅ Email transporter verified");
    } catch (verifyError) {
      console.error(
        "⚠️ Verification failed, but continuing:",
        verifyError.message
      );
      // Continue anyway - sometimes verify fails but sending works
    }

    // Create detailed email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-id { background: #fff; padding: 15px; border-left: 4px solid #667eea; 
                         margin: 20px 0; font-weight: bold; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; 
                         border-bottom: 1px solid #e5e7eb; }
            .label { color: #6b7280; font-weight: 500; }
            .value { color: #111827; font-weight: 600; }
            .total { background: #eff6ff; padding: 20px; margin: 20px 0; border-radius: 8px; 
                    text-align: center; }
            .total-amount { font-size: 32px; color: #2563eb; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .status-badge { display: inline-block; padding: 6px 16px; background: #fef3c7; 
                           color: #92400e; border-radius: 20px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing CareNest</p>
            </div>
            
            <div class="content">
              <div class="booking-id">
                📌 Booking ID: ${booking.id}
              </div>

              <h2 style="color: #111827; margin-top: 30px;">Service Details</h2>
              <div class="detail-row">
                <span class="label">Service</span>
                <span class="value">${booking.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration</span>
                <span class="value">${booking.duration} ${
      booking.durationType
    }</span>
              </div>
              <div class="detail-row">
                <span class="label">Status</span>
                <span class="value"><span class="status-badge">${
                  booking.status
                }</span></span>
              </div>

              <h2 style="color: #111827; margin-top: 30px;">Service Location</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; line-height: 1.8;">
                  <strong>${booking.location.fullAddress}</strong><br>
                  ${booking.location.area}, ${booking.location.city}<br>
                  ${booking.location.district}, ${booking.location.division}
                </p>
              </div>

              ${
                booking.specialInstructions
                  ? `
                <h2 style="color: #111827; margin-top: 30px;">Special Instructions</h2>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                  <p style="margin: 0;">${booking.specialInstructions}</p>
                </div>
              `
                  : ""
              }

              <div class="total">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Amount</p>
                <div class="total-amount">৳${booking.totalCost.toLocaleString()}</div>
                <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px;">
                  💳 Payment after service completion
                </p>
              </div>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #111827;">📞 Next Steps</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                  <li>Our team will contact you within 24 hours</li>
                  <li>You can track your booking status in "My Bookings"</li>
                  <li>Keep your booking ID for reference</li>
                </ul>
              </div>

              <div class="footer">
                <p>Need help? Contact us at support@carenest.com</p>
                <p style="margin-top: 10px;">
                  <a href="https://carenest.com" style="color: #2563eb; text-decoration: none;">
                    Visit CareNest
                  </a>
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Booking Confirmed! 🎉

Booking ID: ${booking.id}

SERVICE DETAILS
---------------
Service: ${booking.serviceName}
Duration: ${booking.duration} ${booking.durationType}
Status: ${booking.status}

SERVICE LOCATION
----------------
${booking.location.fullAddress}
${booking.location.area}, ${booking.location.city}
${booking.location.district}, ${booking.location.division}

${
  booking.specialInstructions
    ? `SPECIAL INSTRUCTIONS\n--------------------\n${booking.specialInstructions}\n\n`
    : ""
}
TOTAL AMOUNT: ৳${booking.totalCost.toLocaleString()}
(Payment after service completion)

Our team will contact you within 24 hours.
Track your booking at: https://carenest.com/my-bookings

Need help? Contact: support@carenest.com
    `;

    // Send email with timeout
    console.log("📤 Attempting to send email...");
    const info = await Promise.race([
      transporter.sendMail({
        from: `"CareNest Bookings" <${process.env.EMAIL_USER}>`,
        to: booking.userEmail,
        subject: `✅ Booking Confirmed - ${booking.serviceName} (${booking.id})`,
        text: emailText,
        html: emailHtml,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Send timeout after 20 seconds")),
          20000
        )
      ),
    ]);

    console.log("✅ Email sent successfully:", info.messageId);
    console.log("📧 Sent to:", booking.userEmail);

    return Response.json({
      success: true,
      messageId: info.messageId,
      recipient: booking.userEmail,
    });
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);

    // Provide helpful error messages
    let userMessage = "Failed to send confirmation email";
    if (error.code === "ESOCKET" || error.code === "ETIMEDOUT") {
      userMessage =
        "Email service temporarily unavailable. Your booking is saved, but email notification failed.";
    } else if (error.code === "EAUTH") {
      userMessage = "Email authentication failed. Please contact support.";
    }

    return Response.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: userMessage,
      },
      { status: 500 }
    );
  }
}
