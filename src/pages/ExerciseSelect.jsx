const EXERCISES = ["Push-ups", "Squats", "Jumping Jacks"];

export default function ExerciseSelect({ onPickExercise, onBack }) {
  return (
    <div>
      <h2 style={{ color: "white" }}>Choose an Exercise</h2>

      <div style={{ display: "grid", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
        {EXERCISES.map((ex) => (
          <button key={ex} onClick={() => onPickExercise(ex)}>
            {ex}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}