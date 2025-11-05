import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login", form);
            login(res.data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans">
            <div className="bg-gray-950/90 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">
                <h1 className="text-4xl font-extrabold text-center text-white mb-4 tracking-tight">
                    SlotSwapper
                </h1>
                <p className="text-center text-gray-300 mb-8 text-sm">
                    Log in to manage your slots and swaps
                </p>

                {error && (
                    <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 font-medium mb-1 text-sm">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            value={form.email}
                            className="w-full px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition text-white text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 font-medium mb-1 text-sm">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            value={form.password}
                            className="w-full px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition text-white text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl text-white font-semibold transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-400 hover:text-blue-500 font-medium hover:underline transition-colors cursor-pointer"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
