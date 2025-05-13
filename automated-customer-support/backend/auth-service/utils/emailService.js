const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
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
  await transporter.sendMail(mailOptions);
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
