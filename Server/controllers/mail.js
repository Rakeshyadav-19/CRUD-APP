import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    return res.status(500).json({
      error: "Email not configured",
      message: "EMAIL_USER and EMAIL_PASS must be set in .env file",
    });
  }

  //   Send mail
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({
      error: "Missing fields",
      message: "to, subject, and message are required",
    });
  }

  // Create transporter inside the function to ensure fresh env variables
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({
      error: "Error sending email",
      message: error.message,
    });
  }
};

export default { sendMail };
