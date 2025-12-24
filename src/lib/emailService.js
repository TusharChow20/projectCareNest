const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

/**
 * Send booking confirmation email with invoice
 * @param {Object} bookingData - Booking information
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name
 */
const sendBookingInvoice = async (bookingData, userEmail, userName) => {
  const {
    serviceName,
    duration,
    division,
    district,
    city,
    area,
    address,
    totalCost,
    bookingId,
    bookingDate,
    serviceIcon
  } = bookingData;

  const emailContent = {
    sender: {
      name: 'CareNest',  
      email: 'carenest039@gmail.com'
    },
    to: [
      {
        email: userEmail,
        name: userName
      }
    ],
    subject: `Booking Confirmation - ${serviceName} | Care.xyz`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .invoice-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .invoice-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .invoice-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 1.2em;
            color: #667eea;
          }
          .label {
            font-weight: 600;
            color: #555;
          }
          .value {
            color: #333;
          }
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            background: #ffd700;
            color: #333;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 0.9em;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for choosing Care.xyz</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your booking has been successfully confirmed. Here are the details:</p>
          
          <div class="invoice-box">
            <h3 style="margin-top: 0; color: #667eea;">📋 Booking Invoice</h3>
            
            <div class="invoice-row">
              <span class="label">Booking ID:</span>
              <span class="value">#${bookingId}</span>
            </div>
            
            <div class="invoice-row">
              <span class="label">Service:</span>
              <span class="value">${serviceIcon} ${serviceName}</span>
            </div>
            
            <div class="invoice-row">
              <span class="label">Duration:</span>
              <span class="value">${duration}</span>
            </div>
            
            <div class="invoice-row">
              <span class="label">Booking Date:</span>
              <span class="value">${bookingDate}</span>
            </div>
            
            <div class="invoice-row">
              <span class="label">Status:</span>
              <span class="value"><span class="status-badge">Pending</span></span>
            </div>
            
            <hr style="margin: 20px 0;">
            
            <h4 style="color: #667eea;">📍 Service Location:</h4>
            <div class="invoice-row">
              <span class="label">Division:</span>
              <span class="value">${division}</span>
            </div>
            <div class="invoice-row">
              <span class="label">District:</span>
              <span class="value">${district}</span>
            </div>
            <div class="invoice-row">
              <span class="label">City:</span>
              <span class="value">${city}</span>
            </div>
            <div class="invoice-row">
              <span class="label">Area:</span>
              <span class="value">${area}</span>
            </div>
            <div class="invoice-row">
              <span class="label">Full Address:</span>
              <span class="value">${address}</span>
            </div>
            
            <hr style="margin: 20px 0;">
            
            <div class="invoice-row">
              <span class="label">Total Cost:</span>
              <span class="value">৳${totalCost}</span>
            </div>
          </div>
          
          <p>Our team will review your booking and confirm shortly. You will receive a notification once your booking status changes.</p>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/my-bookings" class="button">
              View My Bookings
            </a>
          </center>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <strong>Need help?</strong><br>
            Contact us at support@care.xyz or call +880-XXXX-XXXXXX
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 Care.xyz - Professional & Trusted Care Services</p>
          <p>Making caregiving easy, secure, and accessible for everyone</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const result = await apiInstance.sendTransacEmail(emailContent);
    console.log('Email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send booking confirmation email');
  }
};

/**
 * Send booking status update email
 * @param {Object} updateData - Update information
 * @param {string} userEmail - User's email
 * @param {string} userName - User's name
 */
const sendStatusUpdateEmail = async (updateData, userEmail, userName) => {
  const { serviceName, bookingId, newStatus } = updateData;

  const statusMessages = {
    Confirmed: {
      title: '✅ Booking Confirmed',
      message: 'Great news! Your booking has been confirmed.',
      color: '#10b981'
    },
    Completed: {
      title: '🎉 Service Completed',
      message: 'Your service has been successfully completed. Thank you for using Care.xyz!',
      color: '#667eea'
    },
    Cancelled: {
      title: '❌ Booking Cancelled',
      message: 'Your booking has been cancelled as requested.',
      color: '#ef4444'
    }
  };

  const statusInfo = statusMessages[newStatus] || statusMessages.Confirmed;

  const emailContent = {
    sender: {
      name: 'Care.xyz',
      email: 'noreply@care.xyz'
    },
    to: [{ email: userEmail, name: userName }],
    subject: `${statusInfo.title} - Booking #${bookingId}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: ${statusInfo.color};
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${statusInfo.title}</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>${statusInfo.message}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Booking ID:</strong> #${bookingId}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const result = await apiInstance.sendTransacEmail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
};

module.exports = {
  sendBookingInvoice,
  sendStatusUpdateEmail
};