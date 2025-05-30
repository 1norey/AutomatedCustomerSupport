const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


exports.sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:8080/api/auth/verify-email/${token}`;
  const mailOptions = {
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `<p>Please verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email failed to send:", err.message);
    console.error("📬 Full error:", err);
  }
};


exports.sendPasswordResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  const mailOptions = {
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `<p>Reset your password here:</p><a href="${resetLink}">${resetLink}</a>`,
  };
  await transporter.sendMail(mailOptions);
};
