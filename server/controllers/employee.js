import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
//get
export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const where = {};
    if (department) {
      where.department = department;
    }
    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();
    const result = employees.map((emp) => {
      const { userId, ...empdata } = emp;
      return {
        ...empdata,
        id: emp._id.toString(),
        user: userId ? { email: userId.email, role: userId.role } : null,
      };
    });
    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      error: "Failed to Fetch employees",
    });
  }
};

//post
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
    } = req.body();
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const dep = await User.findOne({ email });
    if (dep) {
      return res.status(400).json({ error: "email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      role: role || "EMPLOYEE",
      password: hashed,
    });
    const employee = await Employee.create({
      userId: user._id,
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      joinDate: newDate(joinDate),
      bio: bio || "",
    });
    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error("create employee error:", err);
    return res.status(500).json({ error: "Failed to create employee" });
  }
};

//put
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      password,
      role,
      bio,
      employmentStatus,
    } = req.body();
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(400).json({ error: "Employee not found" });
    }
    const existingUser = await User.findOne({
      email,
      _id: { $ne: employee.userId },
    });
    if (existingUser) {
      return res.status(200).json({ error: "Email already exists" });
    }
    await Employee.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      employmentStatus: employmentStatus || "ACTIVE",
      bio: bio || "",
    });

    const userUpdate = { email };
    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(employee.userId, userUpdate);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update employee" });
  }
};

//delete
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";
    await employee.save();
  } catch (err) {
    return res.status(500).json({ error: "Failed to Delete Employee" });
  }
};
