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
    </div>
  );
}