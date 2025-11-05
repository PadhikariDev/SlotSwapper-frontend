import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Marketplace() {
    const [slots, setSlots] = useState([]);
    const [mySlots, setMySlots] = useState([]);
    const [selectedMySlot, setSelectedMySlot] = useState("");

    useEffect(() => {
        api.get("/swaps/swappable-slots").then(res => setSlots(res.data));
        api.get("/events/me").then(res => setMySlots(res.data.filter(s => s.status === "SWAPPABLE")));
    }, []);

    const requestSwap = async theirSlotId => {
        if (!selectedMySlot) return alert("Select one of your SWAPPABLE slots first");
        await api.post("/swaps/swap-request", { mySlotId: selectedMySlot, theirSlotId });
        alert("Swap request sent!");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md rounded-b-xl sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-blue-600">Marketplace</h1>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 transition font-medium">
                    ← Back
                </Link>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Select My Slot */}
                <div className="bg-white shadow-md rounded-xl p-5">
                    <label className="block mb-2 text-gray-700 font-medium">Select your slot to offer:</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                        onChange={e => setSelectedMySlot(e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        {mySlots.map(s => (
                            <option key={s._id} value={s._id}>{s.title}</option>
                        ))}
                    </select>
                </div>

                {/* Available Slots */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Swappable Slots</h2>
                    {slots.length === 0 ? (
                        <p className="text-gray-500">No slots available for swapping at the moment.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {slots.map(slot => (
                                <div
                                    key={slot._id}
                                    className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between transition hover:shadow-lg"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{slot.title}</h3>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-400">By {slot.owner.name}</p>
                                    </div>
                                    <button
                                        onClick={() => requestSwap(slot._id)}
                                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
                                    >
                                        Request Swap
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
