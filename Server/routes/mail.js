import express from "express";
const router = express.Router();

import { sendMail } from "../controllers/mail.js";

router.post("/send", sendMail);

export default router;
