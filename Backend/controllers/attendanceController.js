const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Get attendance by date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const students = await Student.findAll({
      include: [{
        model: Attendance,
        where: { date },
        required: false
      }],
      order: [['id', 'ASC']]
    });

    const result = students.map(student => ({
      id: student.id,
      name: student.name,
      status: student.Attendances.length > 0
        ? student.Attendances[0].status
        : null
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const [attendance] = await Attendance.upsert({
      studentId,
      date,
      status
    });

    res.json({ success: true, attendance });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Attendance Report 
exports.getAttendanceReport = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{
        model: Attendance,
        attributes: ['status']
      }]
    });

    const report = students.map(student => {
      const total = student.Attendances.length;
      const present = student.Attendances.filter(a => a.status === 'present').length;

      return {
        name: student.name,
        present,
        total,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      };
    });

    res.json(report);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
