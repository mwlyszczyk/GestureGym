export default function Home({ onStart }) {
  return (
    <div>
      <h1 style={{ color: "white" }}>GestureGym</h1>
      <p style={{ color: "white" }}>
        A gesture-based fitness game using your camera.
      </p>

      <button onClick={onStart}>Start</button>
    </div>
  );
}