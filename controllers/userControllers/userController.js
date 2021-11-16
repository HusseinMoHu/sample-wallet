const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const otp = require("../../utils/generateOTP");
const User = require("../../models/userModel");

// 1) Import email sending service
const {
  sendVerifyEmail,
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../../emails/account");

// @desc    Register a new user
// @route   POST /user
// @access  Public
exports.createUser = asyncHandler(async (req, res) => {
  const { name, mobile, email, password } = req.body;

  // 1) Check if user already exists
  const userExists = await User.findOne({ mobile });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 2) Check password length
  if (password.length < 8) {
    res.status(400);
    next(new Error("Password must be 8 characters at least"));
  }

  // 3) Create user and OTP
  const newOTP = otp.generateOTP();
  const user = await User.create({
    name,
    mobile,
    email,
    password,
    verified: false,
    otp: newOTP,
  });

  // 5) User created successfully
  if (user) {
    // 4) Send verification email
    sendVerifyEmail({
      email: user.email,
      otp: newOTP,
      message: "Use this code to verify your Email",
      subject: "Email verification code",
    });

    // 5) Send response with 201 status
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user & get token
// @route   POST /user/login
// @access  Public
exports.authUser = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;

  // 1) find user in dbs
  const user = await User.findOne({ mobile });

  // 2) Check if user exists and password is correct (hashed password)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid mobile or password");
  }
});

// @desc    Verify user email
// @route   POST /user/verify
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { mobile, otp } = req.body;
  if (otp !== "0" && otp !== null && mobile) {
    const user = await User.findOne({ mobile, otp });

    if (user) {
      // 1) Verify user and clear OTP
      user.verified = true;
      user.otp = "0";

      // 2) Add a greeting balance of 1000 EGP
      user.balance = 1000;
      const verifiedUser = await user.save();

      // 2) Send welcome email with a greeting balance of 1000 EGP
      sendWelcomeEmail({ email: verifiedUser.email, name: verifiedUser.name });

      res.json({
        _id: verifiedUser._id,
        name: verifiedUser.name,
        mobile: verifiedUser.mobile,
        email: verifiedUser.email,
        verified: verifiedUser.verified,
        isAdmin: verifiedUser.isAdmin,
        token: generateToken(verifiedUser._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid Data");
    }
  } else {
    res.status(400);
    throw new Error("Please enter the correct OTP");
  }
});

// @desc    Resend OTP
// @route   GET /user/otp/resend
// @access  Public
exports.resendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    const newOTP = otp.generateOTP();
    user.otp = newOTP;
    const saved = await user.save();
    sendVerifyEmail({
      email: user.email,
      otp: newOTP,
      message: "Use this code to reset your Password",
      subject: "Password reset code",
      text: "Forgot Password",
    });
    res.status(200).send({ message: "code sent successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get email with OTP to reset password
// @route   POST /user/forgot/password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    const newOTP = otp.generateOTP();
    user.otp = newOTP;
    const saved = await user.save();
    sendVerifyEmail({
      email: user.email,
      otp: newOTP,
      message: "Use this code to reset your Password",
      subject: "Password reset code",
      text: "Forgot Password",
    });
    res.status(200).send({ message: "password reset code sent" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Rest password
// @route   POST /user/reset/password
// @access  authenticated
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  if (newPassword.length < 8) {
    res.status(400);
    throw new Error("Password must be 8 characters at least");
  }

  const user = await User.findById(req.user._id);
  if (user) {
    user.password = newPassword;
    const saved = await user.save();
    if (saved) {
      res.send({ message: "password change successfully" });
    } else {
      res.status(500);
      throw new Error("something went wrong");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Change password
// @route   POST /user/change/password
// @access  authenticated
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    if (await user.matchPassword(password)) {
      user.password = newPassword;
      const saved = await user.save();
      if (saved) {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(500);
        throw new Error("something went wrong");
      }
    } else {
      res.status(401);
      throw new Error("Invalid password");
    }
  } else {
    res.status(404);
    throw new Error("Invalid email");
  }
});
