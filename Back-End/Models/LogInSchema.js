const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserLoginSchema = new mongoose.Schema({
  avatar: {
    url: String,
    public_id: String,
  },
  first_name: { type: String },
  last_name: { type: String },
  middle_name: { type: String },
  suffix: { type: String },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "student", "member", "adviser", "panelist", "instructor"],
    required: true,
    lowercase: true,
  },
  statusAccount: {
    type: String,
    enum: ["approved", "pending", "block", "unblock"],
    default: "pending"
  },
  studentlead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  isVerified: { type: Boolean, default: false },

  linkedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "role",
  },
  AdvicerCoadvicer: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },

      role: {
        type: String,
        enum: ["Adviser", "Co-Adviser"],
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  confirmPassword: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return (val = this.password);
      },
      message: "Password & confirm Pasword does not match",
    },
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

UserLoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

UserLoginSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd, pswdDB);
};

UserLoginSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < pswdChangedTimestamp;
  }
  return false;
};

UserLoginSchema.pre("save", function (next) {
  if (this.role === "Guest") {
    this.password = undefined;
  }
  next();
});

UserLoginSchema.methods.createResetTokenPassword = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("UserLoginSchema", UserLoginSchema);