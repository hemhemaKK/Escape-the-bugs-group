import User from "../models/User.js";
import Contact from "../models/Contact.js";

const ADMIN_EMAIL = "mcaprojecttestemail@gmail.com";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.email !== ADMIN_EMAIL)
      return res.status(403).json({ message: "Access denied: not admin" });

    const users = await User.find().select("-password -otp");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    if (req.user.email !== ADMIN_EMAIL)
      return res.status(403).json({ message: "Access denied: not admin" });

    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
