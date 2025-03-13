const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  cnic: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Manager", "Employee"],
    default: "Employee", 
  },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
