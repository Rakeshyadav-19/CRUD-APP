import express from "express";
const router = express.Router();

import { getAllUsers } from "../controllers/dashboard.js";

router.get("/all", getAllUsers);

export default router;
