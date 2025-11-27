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
app.use("/api/report", attendanceRoutes);

const PORT = 5500;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
