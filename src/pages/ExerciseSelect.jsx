import { Link } from "react-router-dom";
import "./ExerciseSelect.css";
const EXERCISES = ["Push-ups", "Squats", "Jumping Jacks"];


export default function ExerciseSelect({ onPickExercise, onBack }) {
  return (
    <div>
      <h2 style={{ color: "white" }}>Choose an Exercise</h2>

      <div style={{ display: "grid", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
              {EXERCISES.map((ex) => (
             <Link to="/Pushup" className="link">
          <button key={ex}>
            {ex}
          </button>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "15px" }}>
              <Link to="/" className="link">
                <button>
                      Select
                </button>
              </Link>
      </div>
    </div>
  );
}