const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { Name, EmailAddress, Password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { EmailAddress } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ Name, EmailAddress, Password });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.ID });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { EmailAddress, Password } = req.body;
    const user = await User.findOne({ where: { EmailAddress } });

    if (!user || !user.comparePassword(Password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.ID, email: user.EmailAddress, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.ID,
        name: user.Name,
        email: user.EmailAddress,
        role: user.Role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["ID", "Name", "EmailAddress"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { Name, EmailAddress, Password } = req.body;
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new email is already in use by another user
    if (EmailAddress && EmailAddress !== user.EmailAddress) {
      const emailExists = await User.findOne({
        where: {
          EmailAddress,
          ID: { [Op.ne]: user.ID },
        },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.Name = Name || user.Name;
    user.EmailAddress = EmailAddress || user.EmailAddress;
    if (Password) user.Password = Password;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting account", error: error.message });
  }
};
