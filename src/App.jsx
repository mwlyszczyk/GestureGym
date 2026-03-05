import "./App.css";
import { useState } from "react";
import PoseHandsCamera from "./PoseHandsCamera.jsx";

// Pages we will create
import Home from "./pages/Home.jsx";
import ExerciseSelect from "./pages/ExerciseSelect.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

function App() {

  const [page, setPage] = useState("home");
  const [exercise, setExercise] = useState(null);

  if (page === "home") {
    return (
      <div>
        <Home onStart={() => setPage("select")} />

        <button
          style={{ marginTop: "10px" }}
          onClick={() => setPage("leaderboard")}
        >
          View Leaderboard
        </button>
      </div>
    );
  }

  if (page === "select") {
    return (
      <ExerciseSelect
        onBack={() => setPage("home")}
        onPickExercise={(ex) => {
          setExercise(ex);
          setPage("workout");
        }}
      />
    );
  }

  if (page === "workout") {
    return (
      <div>
        <h2 style={{ color: "white" }}>{exercise}</h2>

        <PoseHandsCamera />

        <div style={{ marginTop: "15px" }}>
          <button onClick={() => setPage("select")}>
            Change Exercise
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setPage("leaderboard")}
          >
            Finish Workout
          </button>
        </div>
      </div>
    );
  }

  return <Leaderboard onBackHome={() => setPage("home")} />;
}

export default App;