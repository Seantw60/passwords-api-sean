import nodemailer from "nodemailer";

let transporter;

if (process.env.NODE_ENV === "production") {
  // Production: Gmail SMTP or SendGrid
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} else {
  // Development: Ethereal Email (testing)
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || "ethereal.user@ethereal.email",
      pass: process.env.ETHEREAL_PASSWORD || "ethereal.password",
    },
  });
}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@blogger.app",
    to: email,
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    text: `Password Reset Request\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.`,
  });
}

export async function sendWelcomeEmail(email, name) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@blogger.app",
    to: email,
    subject: "Welcome to Blogger App",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for joining our blog platform.</p>
      <p>You can now start creating and sharing your thoughts.</p>
    `,
    text: `Welcome, ${name}!\n\nThank you for joining our blog platform.`,
  });
}
