const API_URL = "http://localhost:5500/api";

let currentDate = "";
let students = [];

//Utilities 

function showMessage(text, type) {
  const msgDiv = document.getElementById("message");
  msgDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
  setTimeout(() => (msgDiv.innerHTML = ""), 3000);
}

function hideAllViews() {
  document.getElementById("attendanceForm").classList.add("hidden");
  document.getElementById("summary").classList.add("hidden");
  document.getElementById("report").classList.add("hidden");
}

// Attendance

async function searchAttendance() {
  const date = document.getElementById("dateInput").value;
  if (!date) {
    showMessage("Please select a date", "error");
    return;
  }

  currentDate = date;

  try {
    const res = await fetch(`${API_URL}/attendance/${date}`);
    students = await res.json();

    const hasAttendance = students.some((s) => s.status !== null);
    hideAllViews();

    hasAttendance ? showSummary() : showAttendanceForm();
  } catch {
    showMessage("Error fetching attendance", "error");
  }
}

function showAttendanceForm() {
  const listDiv = document.getElementById("studentList");

  listDiv.innerHTML = students
    .map(
      (student) => `
    <div class="student-row">
      <div>${student.name}</div>
      <div class="radio-group">
        <label>
          <input type="radio" name="status-${student.id}" value="present"
            ${student.status === "present" ? "checked" : ""}
            onchange="updateStatus(${student.id}, 'present')">
          Present
        </label>
        <label>
          <input type="radio" name="status-${student.id}" value="absent"
            ${student.status === "absent" ? "checked" : ""}
            onchange="updateStatus(${student.id}, 'absent')">
          Absent
        </label>
      </div>
    </div>
  `
    )
    .join("");

  document.getElementById("attendanceForm").classList.remove("hidden");
}

function updateStatus(id, status) {
  students = students.map((s) =>
    s.id === id ? { ...s, status } : s
  );
}

async function submitAttendance() {
  try {
    await Promise.all(
      students.map((student) =>
        fetch(`${API_URL}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student.id,
            date: currentDate,
            status: student.status || "present",
          }),
        })
      )
    );

    showMessage("Attendance marked successfully!", "success");
    setTimeout(searchAttendance, 1000);
  } catch {
    showMessage("Error marking attendance", "error");
  }
}

// Summary & Report 

function showSummary() {
  const summaryDiv = document.getElementById("summary");

  summaryDiv.innerHTML = `
    <div class="summary-section">
      <h2>Attendance Summary for ${currentDate}</h2>
      ${students
        .map(
          (student) => `
        <div class="summary-item">
          <div>${student.name}</div>
          <div>${student.status === "present" ? "Present" : "Absent"}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  summaryDiv.classList.remove("hidden");
}

async function fetchReport() {
  try {
    const res = await fetch(`${API_URL}/attendance/report`);
    const data = await res.json();

    hideAllViews();
    const reportDiv = document.getElementById("report");

    reportDiv.innerHTML = `
      <div class="report-section">
        <h2>Overall Attendance Report</h2>
        ${data
          .map(
            (item) => `
          <div class="report-item">
            <div>${item.name}</div>
            <div>${item.present}/${item.total} (${item.percentage}%)</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    reportDiv.classList.remove("hidden");
  } catch {
    showMessage("Error fetching report", "error");
  }
}
