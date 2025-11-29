const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ order: [['id', 'ASC']] });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
