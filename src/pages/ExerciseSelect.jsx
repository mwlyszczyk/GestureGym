import { Link } from "react-router-dom";
import "./ExerciseSelect.css";
const EXERCISES = ["Push-ups", "Squats", "Jumping Jacks"];


export default function ExerciseSelect() {
  return (
    <div>
      <h2 style={{ color: "white" }}>Choose an Exercise</h2>

      <div style={{ display: "grid", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
              
          <Link to="/Pushup" className="link">
             <button>
              Pushups
            </button>
          </Link>
          <Link to="/Squat">
              <button>
              Squats
              </button>
              </Link>
              <Link to="/JumpingJack">
                  <button>
                  Jumping Jacks
                  </button>
              </Link>

        
      </div>

      <div style={{ marginTop: "15px" }}>
              <Link to="/" className="link">
                <button>
                      Home
                </button>
              </Link>
      </div>
    </div>
  );
}