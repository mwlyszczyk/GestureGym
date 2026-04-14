import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
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

                const res = await axios.get("http://localhost:8000/api/user/", {
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
        <div className="flex items-center px-4 pt-3 pb-2">
            <Link to="/" className="text-lg font-semibold">
                GG
            </Link>

            <div className="ml-auto flex items-center gap-3">
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
                        <Link to="/Login">
                            <button className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-500 rounded text-xs md:text-sm hover:border-white">
                                Sign in
                            </button>
                        </Link>

                        <Link to="/Register">
                            <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-black rounded text-xs md:text-sm font-medium">
                                Register
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}