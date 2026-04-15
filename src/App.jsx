import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import ExerciseSelect from "./pages/ExerciseSelect.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import ScoreTest from "./pages/ScoreTest.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Pushup from "./exercises/Pushup.jsx";
import Yoga from "./exercises/Yoga.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ExerciseSelect" element={<ExerciseSelect />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/Pushup" element={<Pushup />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ScoreTest" element={<ScoreTest />} />
        <Route path="/Yoga" element={<Yoga />} />
      </Routes>
    </Router>
  );
}

export default App;