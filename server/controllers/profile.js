import Employee from "../models/Employee.js";

export const getProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.json({
        firstName: "Admin",
        lastName: "",
        email: session.email,
      });
    }
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ error: "Faile to Fetch Profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee Not Found" });
    }
    if (employee.isDeleted) {
      return res.status(404).json({
        error: "Your a/c is already deacitvated.You cannot update your profile",
      });
    }
    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).json({ error: "Failed to Update Profile" });
  }
};
