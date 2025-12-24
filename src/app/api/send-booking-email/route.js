// app/api/send-booking-email/route.js
import * as brevo from "@getbrevo/brevo";

// Initialize Brevo API
let apiInstance = null;

function getBrevoClient() {
  if (!apiInstance) {
    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
  }
  return apiInstance;
}

export function GET() {
  return Response.json({
    message: "Booking email API is active (Brevo)",
    env: {
      brevoApiKey: process.env.BREVO_API_KEY ? "✓ Set" : "✗ Missing",
      senderEmail: process.env.SENDER_EMAIL ? "✓ Set" : "✗ Missing",
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
    if (!process.env.BREVO_API_KEY) {
      console.error("❌ Brevo API key not configured");
      return Response.json(
        {
          success: false,
          error: "Email service not configured",
          debug: {
            brevoApiKey: "Missing",
          },
        },
        { status: 500 }
      );
    }

    console.log("🔐 Brevo API configured");
    console.log(
      "   Sender:",
      process.env.SENDER_EMAIL || "carenest039@gmail.com"
    );

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
                <span class="value">${booking.serviceIcon || "👤"} ${
      booking.serviceName
    }</span>
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
              <div class="detail-row">
                <span class="label">Booking Date</span>
                <span class="value">${new Date().toLocaleDateString(
                  "en-GB"
                )}</span>
              </div>

              <h2 style="color: #111827; margin-top: 30px;">Service Location</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; line-height: 1.8;">
                  <strong>📍 ${booking.location.fullAddress}</strong><br>
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

              <div style="text-align: center; margin-top: 30px;">
                <a href="${
                  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                }/my-bookings" 
                   style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; 
                          text-decoration: none; border-radius: 5px; font-weight: 500;">
                  View My Bookings
                </a>
              </div>

              <div class="footer">
                <p>Need help? Contact us at support@carenest.com</p>
                <p style="margin-top: 10px; font-size: 12px;">
                  © ${new Date().getFullYear()} CareNest - Professional & Trusted Care Services
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
Booking Date: ${new Date().toLocaleDateString("en-GB")}

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

NEXT STEPS
----------
- Our team will contact you within 24 hours
- Track your booking at: ${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/my-bookings
- Keep your booking ID for reference

Need help? Contact: support@carenest.com
    `;

    // Prepare Brevo email
    const sendSmtpEmail = {
      sender: {
        name: process.env.SENDER_NAME || "CareNest",
        email: process.env.SENDER_EMAIL || "carenest039@gmail.com",
      },
      to: [
        {
          email: booking.userEmail,
          name: booking.userName || "Valued Customer",
        },
      ],
      subject: `✅ Booking Confirmed - ${booking.serviceName} (${booking.id})`,
      htmlContent: emailHtml,
      textContent: emailText,
    };

    // Send email via Brevo
    console.log("📤 Sending email via Brevo to:", booking.userEmail);

    const client = getBrevoClient();
    const result = await client.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent successfully via Brevo!");
    console.log("📧 Message ID:", result.messageId);

    return Response.json({
      success: true,
      messageId: result.messageId,
      recipient: booking.userEmail,
      service: "brevo",
    });
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("   Error name:", error.name);
    console.error("   Error message:", error.message);
    console.error("   Error response:", error.response?.text);
    console.error("   Stack:", error.stack);

    // Detailed error messages
    let userMessage = "Failed to send confirmation email";
    let troubleshooting = "";

    if (
      error.message.includes("API key") ||
      error.message.includes("authentication")
    ) {
      userMessage = "Email authentication failed";
      troubleshooting =
        "Check if your Brevo API key is correct in environment variables";
    } else if (error.message.includes("sender")) {
      userMessage = "Sender email not verified";
      troubleshooting =
        "Verify your sender email in Brevo dashboard: Settings → Senders";
    } else if (
      error.message.includes("quota") ||
      error.message.includes("limit")
    ) {
      userMessage = "Email sending limit reached";
      troubleshooting = "Check your Brevo account quota or upgrade your plan";
    }

    return Response.json(
      {
        success: false,
        error: error.message,
        userMessage,
        troubleshooting,
        debug: {
          brevoApiKey: process.env.BREVO_API_KEY ? "Set" : "Missing",
          senderEmail: process.env.SENDER_EMAIL || "carenest039@gmail.com",
        },
      },
      { status: 500 }
    );
  }
}
