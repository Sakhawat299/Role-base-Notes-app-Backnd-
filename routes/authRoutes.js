const express = require("express"); 
const { validateRegister, register, login, getAllUsers, deleteUser, updateUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);





router.get("/users", getAllUsers); // Get all users
router.delete("/users/:id", deleteUser); // Delete user
router.put("/users/:id", updateUser); // Update user


module.exports = router; 
