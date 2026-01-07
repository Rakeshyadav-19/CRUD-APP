import express from "express";
const router = express.Router();

import nodemailer from "nodemailer";

import { sendMail } from "../controllers/mail.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send", sendMail);

export default router;
