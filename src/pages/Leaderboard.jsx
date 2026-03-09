const MOCK_SCORES = [
  { name: "Ali", exercise: "Push-ups", reps: 24 },
  { name: "Max", exercise: "Squats", reps: 30 },
  { name: "Nhahin", exercise: "Jumping Jacks", reps: 40 },
];

export default function Leaderboard({ onBackHome }) {
  return (
    <div>
      <h2 style={{ color: "white" }}>Leaderboard (Mock Data)</h2>

      <div style={{ maxWidth: "420px", margin: "0 auto", textAlign: "left" }}>
        {MOCK_SCORES.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #444",
              color: "white",
            }}
          >
            <span>{row.name}</span>
            <span>{row.exercise}</span>
            <span>{row.reps} reps</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={onBackHome}>Back to Home</button>
      </div>
    </div>
  );
}