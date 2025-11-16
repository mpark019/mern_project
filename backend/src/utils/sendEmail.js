import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email configuration error: EMAIL_USER or EMAIL_PASS is not set");
    throw new Error("Email service is not configured. Please check environment variables.");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    
    // Provide more specific error messages
    if (error.code === "EAUTH") {
      throw new Error("Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS. For Gmail, you may need to use an App Password instead of your regular password.");
    } else if (error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
      throw new Error("Could not connect to email service. Please check your internet connection.");
    } else if (error.responseCode === 535) {
      throw new Error("Gmail authentication failed. Please use an App Password (not your regular password). Enable 2FA and generate an App Password in your Google Account settings.");
    }
    
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};
