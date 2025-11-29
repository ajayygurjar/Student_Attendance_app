const express = require("express");
const {
  getAttendanceByDate,
  markAttendance,
  getAttendanceReport,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/report", getAttendanceReport);
router.get("/:date", getAttendanceByDate);
router.post("/", markAttendance);

module.exports = router;
