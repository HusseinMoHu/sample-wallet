const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// 1) Create user schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "is required"],
      trim: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: [true, "is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: [true, "is required"],
      minLength: 8,
      // select: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: "0",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    tokens: [
      // Just for testCases purpose
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 2) Check if password is correct - hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 3) Hash password before saving in case it's changed
userSchema.pre("save", async function (next) {
  // Check if password is not modified
  if (!this.isModified("password")) {
    next();
  }

  // in case password is modified, hash it
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 4) Create user model
const User = mongoose.model("User", userSchema);

module.exports = User;
