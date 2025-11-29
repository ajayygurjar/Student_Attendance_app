const sequelize = require("./utils/db-connection");
const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Seed default students
async function seedStudents() {
  const Student = require('./models/Student');
  const count = await Student.count();

  if (count === 0) {
    await Student.bulkCreate([
      { name: 'Ajay' },
      { name: 'Aman' },
      { name: 'Shubh' },
      { name: 'Gian' },
      { name: 'Harshita' },
      { name: 'Ram' },
      { name: 'Kumar' },
      { name: 'Anu' },
      { name: 'jeeva' },
      { name: 'Adi' },
      { name: 'Vishu' }
    ]);

    console.log('✓ Default students added');
  }
}


const PORT = 5500;
sequelize.sync().then(() => {
  console.log("✓ Database Synced");

  seedStudents();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
});
