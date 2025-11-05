import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Requests() {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [loadingIds, setLoadingIds] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/swaps/requests");
            setIncoming(res.data.incoming);
            setOutgoing(res.data.outgoing);
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const respond = async (id, accept) => {
        try {
            setLoadingIds((prev) => [...prev, id]);
            const res = await api.post(`/swaps/swap-response/${id}`, { accept });

            // Update local state
            setIncoming((prev) =>
                prev.map((req) =>
                    req._id === id ? { ...req, status: res.data.swap.status } : req
                )
            );
            setOutgoing((prev) =>
                prev.map((req) =>
                    req._id === id ? { ...req, status: res.data.swap.status } : req
                )
            );
        } catch (err) {
            console.error("Error responding to request:", err);
        } finally {
            setLoadingIds((prev) => prev.filter((lid) => lid !== id));
        }
    };

    const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-400",
        ACCEPTED: "bg-green-100 text-green-800 border-green-400",
        REJECTED: "bg-red-100 text-red-800 border-red-400",
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md rounded-b-xl sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-blue-600">Swap Requests</h1>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 transition font-medium">
                    ← Back
                </Link>
            </header>

            <main className="max-w-6xl mx-auto p-6 space-y-10">
                {/* Incoming Requests */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Incoming Requests</h2>
                    {incoming.length === 0 ? (
                        <p className="text-gray-500">No incoming requests.</p>
                    ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {incoming.map((req) => (
                                <div
                                    key={req._id}
                                    className={`border-l-4 rounded-lg shadow-md p-5 flex flex-col justify-between transition hover:shadow-lg ${statusStyles[req.status]}`}
                                >
                                    <div>
                                        <p className="font-medium mb-2">{req.requester.name} wants to swap with your slot:</p>
                                        <p className="text-gray-700 font-semibold">{req.theirSlot.title}</p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {new Date(req.theirSlot.startTime).toLocaleString()} - {new Date(req.theirSlot.endTime).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        {req.status === "PENDING" ? (
                                            <>
                                                <button
                                                    onClick={() => respond(req._id, true)}
                                                    disabled={loadingIds.includes(req._id)}
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => respond(req._id, false)}
                                                    disabled={loadingIds.includes(req._id)}
                                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className="font-semibold text-center w-full">
                                                {req.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Outgoing Requests */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Outgoing Requests</h2>
                    {outgoing.length === 0 ? (
                        <p className="text-gray-500">No outgoing requests.</p>
                    ) : (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {outgoing.map((req) => (
                                <div
                                    key={req._id}
                                    className={`border-l-4 rounded-lg shadow-md p-5 flex flex-col justify-between transition hover:shadow-lg ${statusStyles[req.status]}`}
                                >
                                    <div>
                                        <p className="font-medium mb-2">
                                            You requested to swap your <span className="font-semibold">{req.mySlot.title}</span> with <span className="font-semibold">{req.theirSlot.title}</span>
                                        </p>
                                    </div>
                                    <span className="font-semibold mt-4 text-center">{req.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
