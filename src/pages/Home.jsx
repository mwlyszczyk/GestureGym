import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

export default function Home() {
  return (
    <div className="page-shell">
      <Navbar />

      <div className="page-container">
        <div className="text-center pt-8 pb-8 max-w-[620px] mx-auto">
          <h1 className="text-[40px] md:text-[54px] font-bold tracking-tight">
            GestureGym
          </h1>
          <p className="text-yellow-400 text-[16px] md:text-[18px] mt-2">
            Gesture based fitness at home
          </p>
          <p className="text-gray-300 text-[15px] mt-4 leading-7">
            Train with motion-powered workouts, daily challenges, and interactive
            exercise experiences right from your browser.
          </p>
        </div>

        <div className="max-w-[1100px] mx-auto">
                  {/*<div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-semibold">Featured Workouts</h2>
            <Link
              to="/ExerciseSelect"
              className="text-yellow-400 font-medium hover:text-yellow-300"
            >
              See all
            </Link>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/Pushup" className="group">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1764426445448-95103b0024a6?q=80&w=1467&auto=format&fit=crop"
                  alt="pushups"
                  className="w-full h-[360px] object-cover group-hover:scale-[1.03] transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                  Daily Challenge
                </div>
                <div className="absolute bottom-5 left-5">
                  <h3 className="text-2xl font-bold">Daily Push-ups</h3>
                  <p className="text-sm text-gray-200 mt-1">
                    Test your reps and compete on the leaderboard
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/Yoga" className="group">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1552196563-55cd4e45efb3"
                  alt="yoga"
                  className="w-full h-[360px] object-cover group-hover:scale-[1.03] transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-white text-black text-sm font-bold px-3 py-1 rounded-full">
                  Guided Session
                </div>
                <div className="absolute bottom-5 left-5">
                  <h3 className="text-2xl font-bold">Guided Yoga</h3>
                  <p className="text-sm text-gray-200 mt-1">
                    Follow a calmer movement-based routine from home
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}