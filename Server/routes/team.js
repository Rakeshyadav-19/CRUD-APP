import express from "express";
const router = express.Router();

import multer from "multer";

import {
  getAllTeams,
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/Users.js";

const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  // Accept only images
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },
});

// Example route for team
router.get("/", (req, res) => {
  res.send("Team route is working!");
});

// Get all teams
router.get("/all", getAllTeams);

// Add team member
router.post("/add", upload.single("uploadedFile"), createUser);

// Get all members
router.get("/:teamId/members", getAllUsers);

// Get member by ID
router.get("/:teamId/member/:id", getUserById);

// Update member
router.put("/update/:id", upload.single("uploadedFile"), updateUser);

// Delete member
router.delete("/delete/:id", deleteUser);

export default router;
