import { Link } from "react-router-dom";
import ExerciseSelect from "./ExerciseSelect.jsx";
import "./Home.css";

export default function Home({ onStart }) {
  return (
    <div>
      <h1 style={{ color: "white" }}>GestureGym</h1>
      <p style={{ color: "white" }}>
        A gesture-based fitness game using your camera.
      </p>

          <Link to="/ExerciseSelect" className="link">
            <button>
              Select
            </button>
          </Link>
        <p></p>
          <Link to="/Register" className="link">
              <button>
                Register
              </button>
          </Link>
          <p></p>
          <Link to="/Login" className="link">
              <button>
                Login
              </button>
          </Link>
          <p></p>
          <Link to="/ScoreTest" className="link">
              <button>
              upload scores
              </button>
          </Link>
          <p></p>
          <Link to="/Leaderboard" className="link">
              <button>
                leaderboard
              </button>
          </Link>
    </div>
  );
}