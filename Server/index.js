import dotenv from "dotenv";
dotenv.config();
import client from "./config/db.js";
import express from "express";

client();
const app = express();
app.use(express.json());

// Routes
import teamRoutes from "./routes/team.js";
import dashboardRoutes from "./routes/dashboard.js";
import mailRoutes from "./routes/mail.js";

app.use("/api/team", teamRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mail", mailRoutes);

// Error handler for file filter rejections
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
