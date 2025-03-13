const { body, validationResult } = require("express-validator");
const User = require("../models/User/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

// ✅ Validation rules for registration
exports.validateRegister = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .custom((value) => {
      const roles = ["Admin", "Manager", "Employee"];
      if (!roles.includes(value)) {
        throw new Error("Invalid role");
      }
      return true;
    }),
];

// ✅ Register user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }

    const { firstName, lastName, dateOfBirth, cnic, email, mobileNumber, password, role } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !cnic || !email || !mobileNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedRoles = ["Admin", "Manager", "employee"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ firstName, lastName, dateOfBirth, cnic, email, mobileNumber, password, role });
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error in Register:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log(" Login request received:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log(" No user found with this email:", email);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    console.log(" User found:", user);

    

    const token = generateToken(user._id, user.role);
    console.log(" Login successful for:", email);

    res.json({ token, user });
  } catch (error) {
    console.error(" Error in Login:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


//  Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from response
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//  Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//  Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
