import Employee from "../models/Employee.js";
import Attendance from "../models/attendance.js";

export const clockInOut = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not Found" });
    }
    if (employee.isDeleted) {
      return res.return(404).json({ error: "Your a/c has been deleted" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });
    const now = new Date();
    if (!existing) {
      const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });
      return res
        .status(200)
        .json({ success: true, type: "CHECK_IN", data: attendance });
    } else if (!existing.checkOut) {
      const checkInTime = new Date(existing.checkIn).getTime();
      const diff = now.getTime() - checkInTime;
      const diffHr = diff / (1000 * 60 * 60);
      existing.checkOut = now;

      const workingHours = parseFloat(diffHr.toFixed(2));
      let dayType = null;
      if (workingHours >= 8) {
        dayType = "Full Day";
      } else if (workingHours >= 6) {
        dayType = "Three Quarter Day";
      } else if (workingHours >= 4) {
        dayType = "Half Day";
      } else {
        dayType = "Short Day";
      }
      existing.workingHours = workingHours;
      existing.dayType = dayType;
      await existing.save();
      return res.json({ success: true, type: CHECK_OUT, data: existing });
    } else {
      return res.json({ success: true, type: CHECK_OUT, data: existing });
    }
  } catch (err) {
    return res.status(500).json({ error: "Operation Failed" });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not Found" });
    }
    const limit = parseInt(req.query.limit || 30);
    const history = await Attendance.find({ employeeId: employee._id })
      .sort({
        date: -1,
      })
      .limit(limit);
    return res.json({
      data: history,
      employee: { isDeleted: employee.isDeleted },
    });
  } catch (err) {
    return res.status(500).json({ error: "Operation Failed" });
  }
};
