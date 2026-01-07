export const sendMail = (req, res) => {
  //   Sned mail
  const { to, subject, text } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error sending email", message: error.message });
    } else {
      return res.status(200).json({ message: "Email sent successfully", info });
    }
  });
};

export default { sendMail };
