import "./App.css";
import { useState } from "react";
import Camera from "./camera.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

// Pages we will create
import Home from "./pages/Home.jsx";
import ExerciseSelect from "./pages/ExerciseSelect.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

//excercise pages
import Pushup from "./exercises/Pushup.jsx";

function App() {

  const [page, setPage] = useState("home");
  const [exercise, setExercise] = useState(null);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ExerciseSelect" element={<ExerciseSelect />} />
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/Pushup" element={<Pushup />} />


            </Routes>
        </Router>

 );
}

export default App;