const days = [
  { day: "Monday", focus: "Chest + Triceps + Shoulder", 
    workouts: ["Bench Press – 4x6-8", "Incline Dumbbell Press – 3x8-10", "Overhead Press – 3x6-8", "Lateral Raises – 3x12-15", "Triceps Dips or Close-Grip Bench – 3x8-10","Overhead Triceps Extension – 3x12-15"],
    alternate: ["Chest Press Machine – 4×10", "Incline Chest Press Machine – 3×10", "Pec Deck (Chest Fly Machine) – 3×12", "Shoulder Press Machine – 3×10", "Lateral Raise Machine – 3×15", "Triceps Pushdown (Cable) – 3×12", "Overhead Triceps Machine – 3×12"]
  },
  { day: "Tuesday", focus: "Back + Biceps", workouts: ["Deadlifts – 4x5", "Pull-Ups or Lat Pulldown – 3x8-10", "Barbell Rows – 3x6-8", "Face Pulls – 3x12-15","Barbell Curls – 3x10","Hammer Curls – 3x12"],
    alternate:["Lat Pulldown – 4×10", "Seated Cable Row – 3×10", "Machine Pullovers or Reverse Pec Deck – 3×12","Preacher Curl Machine – 3×12", "Cable Rope Hammer Curls – 3×12"]
   },
  { day: "Wednesday", focus: "Quads + Hamstrings + Calves", workouts: ["Back Squats – 4x6-8", "Romanian Deadlifts – 3x8-10", "Leg Press – 3x10", "Walking Lunges – 2x20 steps","Seated Leg Curl – 3x12","Standing Calf Raises – 3x15"],
    alternate:["Leg Press Machine – 4×12", "Leg Extension Machine – 3×15", "Lying or Seated Leg Curl Machine – 3×15", "Smith Machine Squats or Hack Squat – 4×10", "Standing Calf Raise Machine – 4×20", "Seated Calf Raise Machine – 3×15"]
   },
  { day: "Thursday", focus: "Biceps + Triceps + Forearms", workouts: ["Barbell Curls – 4x10", "Skull Crushers – 4x10", "Preacher Curls – 3x12", "Rope Triceps Pushdown – 3x12","Incline Dumbbell Curls – 3x10","Wrist Curls + Reverse Wrist Curls – 3x15"],
    alternate:["Cable Curl (EZ bar) – 4×10","Dumbbell or Machine Preacher Curl – 3×12", "Triceps Dip Machine – 3×10","Rope Pushdowns (Cable) – 3×15","Reverse Cable Curls – 3×12","Wrist Curl Machine – 3×15"]
   },
  { day: "Friday", focus: "Upper Body Power", workouts: ["Bench Press – 5x5", "Overhead Press – 4x6", "Pull-Ups Weighted – 4x6", "Barbell Rows – 4x6 ","Shrugs – 3x10","Dips Weighted – 3x8"],
    alternate:["Machine Chest Press (Heavy) – 5×5","Seated Row (Heavy) – 4×6","Shoulder Press Machine (Heavy) – 4×6","Weighted Pull-Ups (or Lat Pulldown Stack) – 3×6","Triceps Pushdown (Heavy) – 3×8","Cable Shrugs – 3×10"]
   },
  { day: "Saturday", focus: "Lower Body Power ", workouts: ["Front Squats – 4x6", "Romanian Deadlift – 4x8", "Bulgarian Split Squat – 3x8/leg", "Seated Calf Raise – 4x15","Hanging Leg Raises – 3x15"],
    alternate:["Hack Squat Machine (Heavy) – 4×6","Romanian Deadlifts with Barbell or Smith – 3×8","Walking Lunges with Dumbbells – 2×20 steps","Leg Press Machine (Heavy) – 4×8","Weighted Calf Raises – 3×20","Hanging Leg Raises or Cable Crunch – 3×15"]
   }
];
const calendar = document.querySelector(".calendar");
let useAlternate = false; 

function getTodayDate() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function getWeekdayName(dateString = null) {
  const date = dateString ? new Date(dateString) : new Date();
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[date.getDay()];
}

function getWorkoutLog() {
  return JSON.parse(localStorage.getItem("workoutLog") || "[]");
}

function saveWorkoutLog(logs) {
  localStorage.setItem("workoutLog", JSON.stringify(logs));
}

function renderCards() {
  calendar.innerHTML = "";
  days.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${d.day}</h3><p>${d.focus}</p>`;
    card.onclick = () => showWorkout(d.day, d.focus, d.workouts);
    card.onclick = () => showWorkout(d.day, d.focus, d.workouts, d.alternate);
    calendar.appendChild(card);
  });
}

function showWorkout(day, focus, workouts,alternateWorkouts) {
  document.getElementById("day-title").textContent = `${day} - ${focus}`;
  const list = document.getElementById("workout-list");
  list.innerHTML = "";
  const shownWorkouts = useAlternate ? alternateWorkouts : workouts;
  shownWorkouts.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w;
    list.appendChild(li);
  });

  document.getElementById("mark-done").onclick = () => {
    const logs = getWorkoutLog();
    let date = getTodayDate();
    logs.push({
      date: getTodayDate(),
      day: getWeekdayName(date),
      focus: focus,
      workouts: workouts,
      status: 'Completed',
      version: useAlternate ? "Alternate" : "Primary"
    });
    saveWorkoutLog(logs);
    closeModal();
    renderLogTable();
  };

  document.getElementById("mark-Skip").onclick = () => {
    const logs = getWorkoutLog();
    let date = getTodayDate();
    logs.push({
      date: getTodayDate(),
      day: getWeekdayName(date),

      status: 'Skipped'
    });
    saveWorkoutLog(logs);
    closeModal();
    renderLogTable();
   };

  
  document.getElementById("switch-set").onclick = () => {
   useAlternate = !useAlternate;
   showWorkout(day, focus, workouts, alternateWorkouts); // Re-render modal
  };

  document.getElementById("workout-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("workout-modal").style.display = "none";
}

function renderLogTable() {
  const logs = getWorkoutLog();
  const tbody = document.querySelector("#log-table tbody");
  tbody.innerHTML = "";

  logs.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.day}</td>
      <td>${entry.status} ${entry.version ? "(" + entry.version + ")" : ""}</td>
      `;
    //   <td>${entry.focus}</td>
    //   <td>${entry.workouts.join(", ")}</td>
    tbody.appendChild(row);
  });
}

const toggleBtn = document.getElementById("toggle-history-btn");
const logSection = document.getElementById("log-section");

toggleBtn.addEventListener("click", () => {
  logSection.classList.toggle("hidden");
  toggleBtn.textContent = logSection.classList.contains("hidden")
    ? "📋 Show Workout History"
    : "🙈 Hide Workout History";
});

renderCards();
renderLogTable();
