const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserData");
const nodemailer = require("nodemailer");
// Registration controller
const register = async (req, res) => {
  const { username, password, email, fullName, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      role,
    });

    // Save the user to the database
    const account = await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
    req.io.emit("new-user", account);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User registration failed",
      error: error.message,
    });
    console.error(error.message);
  }
};

// Setup Nodemailer transporter (Use your Gmail credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mtrcb32130@gmail.com",
    pass: "cthx ifns yqtb kifg",
  },
});

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Login controller
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP temporarily (You can store it in Redis, DB, or session)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "mtrcb32130@gmail.com",
      to: user.email,
      subject: "Your 2FA Verification Code",
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Login failed", error });
  }
};

// LOGOUT
const logout = (req, res) => {
  const { username } = req.body;
  res.clearCookie("token").send("User logged out");
  console.log(`${username} logged out`);
};

// OTP Verification Function
const verifyOTP = async (req, res) => {
  const { username, otp } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "OTP verification failed", error });
  }
};

module.exports = { register, login, logout, verifyOTP };
