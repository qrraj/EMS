import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
export const createLeave = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not Found" });
    }
    if (employee.isDeleted) {
      return res.return(404).json({ error: "Your a/c has been deleted" });
    }
    const { type, startDate, endDate, reason } = req.body();
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      new Date(startDate) <= today ||
      new Date(endDate) <= today ||
      new Date(endDate) < new Date(startDate)
    ) {
      return res
        .status(400)
        .json({ error: "Leave date must be in the Future" });
    }
    const leave = await LeaveApplication.create({
      employeeId: employee._id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: pending,
    });
    return res.json({ success: true, data: leave });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
};

export const getLeave = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";
    if (isAdmin) {
      const status = req.query.status;
      const where = status ? { status } : {};
      const leaves = await LeaveApplication.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 });
      const data = leaves.map((l) => {
        const obj = l.toObject();
        const { _id, employeeId, ...rst } = obj;
        if (!employeeId) {
          return {
            ...rst,
            id: _id.toString(),
            employeeId: null,
            employee: null,
          };
        }
        const { _id: empId, ...employee } = employeeId;
        return {
          ...rst,
          id: _id.toString(),
          employee,
          employeeId: empId.toString(),
        };
      });
      return res.json({ data });
    } else {
      const employee = await Employee.findOne({
        userId: session.userId,
      }).lean();
      if (!employee) {
        return res.status(404).json({ error: "Employee not Found" });
      }
      const leaves = await LeaveApplication.find({
        employeeId: employee._id,
      }).sort({ createdAt: -1 });
      return res.json({
        data: leaves,
        employee: { ...employee, id: employee._id.toString() },
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body();
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({ error: "Invalid Status" });
    }
    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      { returnDocument: "after" },
    );
    return res.json({ success: true, data: leave });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
};
