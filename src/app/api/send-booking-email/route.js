import nodemailer from "nodemailer";

export function GET() {
  return Response.json({
    message: "Booking email API is active",
    env: {
      emailUser: process.env.EMAIL_USER ? "✓ Set" : "✗ Missing",
      emailPass: process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing",
    },
  });
}

export async function POST(req) {
  console.log("📧 Email API called at:", new Date().toISOString());

  try {
    const booking = await req.json();
    console.log("📋 Processing booking:", booking.id);
    console.log("📧 Recipient:", booking.userEmail);

    // Validate required fields
    if (!booking.userEmail || !booking.serviceName) {
      console.error("❌ Missing required fields");
      return Response.json(
        { success: false, error: "Missing required booking data" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Email credentials not configured");
      return Response.json(
        {
          success: false,
          error: "Email credentials not configured",
          debug: {
            emailUser: process.env.EMAIL_USER ? "Set" : "Missing",
            emailPass: process.env.EMAIL_PASS ? "Set" : "Missing",
          },
        },
        { status: 500 }
      );
    }

    console.log("🔐 Email config:");
    console.log("   User:", process.env.EMAIL_USER);
    console.log(
      "   Pass:",
      process.env.EMAIL_PASS
        ? "***" + process.env.EMAIL_PASS.slice(-4)
        : "Missing"
    );

    // Create transporter with detailed config
    const transporter = nodemailer.createTransport({
      service: "gmail", // Simplified - let nodemailer handle the config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug output
      logger: true, // Log to console
    });

    // Verify connection (with short timeout for Vercel)
    console.log("🔐 Verifying email connection...");
    try {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Verification timeout")), 5000)
        ),
      ]);
      console.log("✅ Email transporter verified successfully");
    } catch (verifyError) {
      console.warn("⚠️ Verification failed:", verifyError.message);
      console.warn("⚠️ Attempting to send anyway...");
    }

    // Create email content
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

Need help? Contact: support@carenest.com
    `;

    // Send email with timeout (8 seconds for Vercel's 10s limit)
    console.log("📤 Sending email to:", booking.userEmail);

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
          () => reject(new Error("Email send timeout after 8 seconds")),
          8000
        )
      ),
    ]);

    console.log("✅ Email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 Response:", info.response);

    return Response.json({
      success: true,
      messageId: info.messageId,
      recipient: booking.userEmail,
    });
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("   Error name:", error.name);
    console.error("   Error message:", error.message);
    console.error("   Error code:", error.code);
    console.error("   Stack:", error.stack);

    // Detailed error messages
    let userMessage = "Failed to send confirmation email";
    let troubleshooting = "";

    if (error.code === "EAUTH" || error.message.includes("authentication")) {
      userMessage = "Email authentication failed";
      troubleshooting =
        "Check if you're using a Gmail App Password (not regular password)";
    } else if (
      error.code === "ESOCKET" ||
      error.code === "ETIMEDOUT" ||
      error.message.includes("timeout")
    ) {
      userMessage = "Email service timeout";
      troubleshooting =
        "Gmail SMTP may be blocked or slow. Consider using a different email service.";
    } else if (error.code === "ECONNECTION") {
      userMessage = "Cannot connect to email server";
      troubleshooting = "Check your internet connection and Gmail settings";
    }

    return Response.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        userMessage,
        troubleshooting,
        debug: {
          emailUser: process.env.EMAIL_USER ? "Set" : "Missing",
          emailPass: process.env.EMAIL_PASS ? "Set" : "Missing",
        },
      },
      { status: 500 }
    );
  }
}
