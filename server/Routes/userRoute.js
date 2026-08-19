const express = require("express");
const router = express.Router();

const {
  signupValidation,
  loginValidation,
  updateProfileValidation,
  updateThemeValidation,
} = require("../Middleware/AuthMiddleware");

const {
  signupUser,
  loginUser,
  googleLogin,
  getUsers,
  updateUser,
  updateTheme,
  guestLogin,
} = require("../Controllers/userController");

router.post("/signup", signupValidation, signupUser);

router.post("/login", loginValidation, loginUser);

router.post("/google-login", googleLogin);

router.get("/users", getUsers);

router.put("/edituser/:id", updateProfileValidation, updateUser);

router.put("/edittheme/:id", updateThemeValidation, updateTheme);
router.post("/guest-login", guestLogin);

module.exports = router;
