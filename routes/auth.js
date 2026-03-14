const express = require("express");
const router = express.Router(); //npm package
const bcrypt = require("bcryptjs");//npm package
const jwt = require("jsonwebtoken");//npm package
const fetchuser = require("../middleware/fetchuser"); //fetching the  user's id through a middleware
const { body, validationResult } = require("express-validator"); //npm package
const User = require("../models/User"); //mongoose model

//Creating a fake secret string to deal between client and server to identify wether the token is already taken or not or wether a user tries to access info of another user
const JWT_SECRET = process.env.JWT_SECRET;
//Route 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
   let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success,"Some Error occured");
    }
  }
);
//Route: Login using correct credentials: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
   let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success, error: "Try logging in with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(404)
          .json({ success, error: "Try logging in with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);
// Route 3: Get user info by login : POST "/api/auth/getuser". Protected Route
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
})

module.exports = router;
