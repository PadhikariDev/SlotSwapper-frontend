import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import api from "../api";
import { HiMenu, HiX } from "react-icons/hi";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false); // for mobile hamburger

    const fetchEvents = async () => {
        try {
            const res = await api.get("/events/me");
            setEvents(res.data);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to load events");
        }
    };

    const createEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/events", { title, startTime, endTime });
            setTitle("");
            setStartTime("");
            setEndTime("");
            await fetchEvents();
        } catch (err) {
            console.error("Event creation failed:", err);
            setError("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    const toggleSwappable = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
            await api.put(`/events/${id}`, { status: newStatus });
            await fetchEvents();
        } catch (err) {
            console.error("Toggle failed:", err);
            setError("Failed to update event status");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* NAVBAR */}
            <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white shadow-md rounded-b-xl sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-blue-600">SlotSwapper</div>
                    <span className="hidden md:inline text-gray-500 text-sm">Hello, {user?.name}!</span>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
                    <Link to="/marketplace" className="hover:text-blue-500 transition-colors">Marketplace</Link>
                    <Link to="/requests" className="hover:text-blue-500 transition-colors">Requests</Link>
                    <button
                        onClick={logout}
                        className="text-red-500 hover:text-red-600 transition-colors font-semibold cursor-pointer"
                    >
                        Logout
                    </button>
                </nav>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-blue-500 text-2xl">
                        {menuOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-md rounded-b-xl p-4 space-y-2 text-gray-700 font-medium">
                    <Link to="/marketplace" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500 transition">Marketplace</Link>
                    <Link to="/requests" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500 transition">Requests</Link>
                    <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="block w-full text-left text-red-500 hover:text-red-600 transition font-semibold"
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* MAIN CONTENT */}
            <main className="max-w-6xl mx-auto p-6 space-y-10">
                {/* Add Event Form */}
                <form onSubmit={createEvent} className="bg-white shadow-lg rounded-xl p-6 space-y-5">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Event</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event Title"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                            required
                        />
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                            required
                        />
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition shadow-md cursor-pointer"
                    >
                        {loading ? "Adding..." : "Add Event"}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>

                {/* My Events */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Events</h2>
                    {events.length === 0 ? (
                        <p className="text-gray-500">No events yet. Add one above!</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((ev) => (
                                <div key={ev._id} className="bg-white shadow-md rounded-xl p-5 transition hover:shadow-xl">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{ev.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {new Date(ev.startTime).toLocaleString()} - {new Date(ev.endTime).toLocaleString()}
                                    </p>
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${ev.status === "SWAPPABLE"
                                            ? "bg-green-100 text-green-800"
                                            : ev.status === "SWAP_PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {ev.status || "BUSY"}
                                    </span>
                                    <button
                                        onClick={() => toggleSwappable(ev._id, ev.status)}
                                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition cursor-pointer"
                                    >
                                        {ev.status === "SWAPPABLE" ? "Mark as Busy" : "Mark as Swappable"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
