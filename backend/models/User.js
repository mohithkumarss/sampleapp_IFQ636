const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Switched to bcryptjs to match your controller

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Keep your existing university and address fields
    university: {
      type: String,
    },
    address: {
      type: String,
    },
    // THE CRITICAL ADDITION: Role-based access control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  },
);

// The Bouncer: Hash password before saving to DB
userSchema.pre("save", async function (next) {
  // Only hash if the password was actually changed (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Helper method to compare passwords (optional but clean)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
