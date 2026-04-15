import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setUser(null);
                    return;
                }

                const res = await axios.get("https://backend10232002.ngrok.app/api/user/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(res.data);
            } catch (err) {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur border-b border-white/10">
      <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-2xl font-bold tracking-tight">GG</div>
          <div className="hidden sm:block">
            <p className="font-semibold leading-none">GestureGym</p>
            <p className="text-xs text-gray-400 mt-1">Motion powered fitness</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
                  {/*        <Link
            to="/ExerciseSelect"
            className={`hidden md:inline-block px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive("/ExerciseSelect")
                ? "bg-white text-black"
                : "text-white border border-white/15 hover:border-yellow-400 hover:text-yellow-400"
            }`}
          >
            Workouts
          </Link> */}

          <Link
            to="/Leaderboard"
            className={`hidden md:inline-block px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive("/Leaderboard")
                ? "bg-white text-black"
                : "text-white border border-white/15 hover:border-yellow-400 hover:text-yellow-400"
                }`}
                  >
                  Leaderboard
                  </Link>
                      {user ? (
                          <>
                              <span className="text-sm text-gray-300">
                                  {user.username}
                              </span>

                              <button
                                  onClick={handleLogout}
                                  className="px-3 py-1.5 border border-gray-500 rounded text-xs md:text-sm hover:border-white"
                              >
                                  Logout
                              </button>
                          </>
                      ) : (
                          <>
          <Link
            to="/Login"
            className="px-4 py-2 rounded-xl border border-white/20 text-white font-semibold hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Sign In
          </Link>

          <Link
            to="/Register"
            className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
          >
            Register
          </Link>
                          </>
                      )}
        </nav>
      </div>
    </header>
  );
}