import User from "../models/userModel.js";
import Team from "../models/teamModel.js";

// Get all teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({}, { teamName: 1, _id: 1 });
    res.status(200).json(teams);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching teams", message: err.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, gender, team_Id } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      gender,
      team_Id,
      profile_pic: req.file ? req.file.buffer : undefined,
      contentType: req.file ? req.file.mimetype : undefined,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating user", message: err.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      User.find({ team_Id: teamId }).skip(skip).limit(limit),
      User.countDocuments({ team_Id: teamId }),
    ]);

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching users", message: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user", message: err.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const getUser = await User.findById(id);
    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting user", message: err.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, team_Id } = req.body;
    const getUser = await User.findById(id);
    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        gender,
        team_Id,
        profile_pic: req.file ? req.file.buffer : undefined,
        contentType: req.file ? req.file.mimetype : undefined,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating user", message: err.message });
  }
};

export default { getAllTeams, createUser, getAllUsers, deleteUser, updateUser };
