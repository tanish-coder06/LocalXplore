import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function PlatformOverview() {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/admin/overview", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setData(response.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load platform overview."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    const StatCard = ({ title, value, color = "text-green-800" }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-600 font-medium">{title}</p>
            <h2 className={`text-3xl font-bold mt-3 ${color}`}>
                {value ?? 0}
            </h2>
        </div>
    );

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-7xl mx-auto">

                    <h1 className="text-3xl font-bold text-green-800">
                        Platform Overview
                    </h1>

                    <p className="text-gray-600 mt-2 mb-6">
                        View LocalXplore platform statistics.
                    </p>

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-green-700 font-medium mb-8 hover:underline"
                    >
                        ← Back to Admin Dashboard
                    </button>

                    {loading && <p>Loading platform statistics...</p>}

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            {/* User Statistics */}
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                👥 User Statistics
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                <StatCard title="Total Users" value={data.users.totalUsers} />
                                <StatCard title="Tourists" value={data.users.tourists} />
                                <StatCard title="Guides" value={data.users.guides} />
                                <StatCard title="Administrators" value={data.users.admins} />
                                <StatCard title="Active Users" value={data.users.activeUsers} />
                                <StatCard title="Inactive Users" value={data.users.inactiveUsers} color="text-red-600" />
                            </div>

                            {/* Experience Statistics */}
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                🗺️ Experience Statistics
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                <StatCard title="Total Experiences" value={data.experiences.totalExperiences} />
                                <StatCard title="Active Experiences" value={data.experiences.activeExperiences} />
                                <StatCard title="Pending Experiences" value={data.experiences.pendingExperiences} color="text-yellow-600" />
                                <StatCard title="Inactive Experiences" value={data.experiences.inactiveExperiences} />
                                <StatCard title="Rejected Experiences" value={data.experiences.rejectedExperiences} color="text-red-600" />
                            </div>

                            {/* Booking Statistics */}
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                📅 Booking Statistics
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                <StatCard title="Total Bookings" value={data.bookings.totalBookings} />
                                <StatCard title="Pending Bookings" value={data.bookings.pendingBookings} color="text-yellow-600" />
                                <StatCard title="Confirmed Bookings" value={data.bookings.confirmedBookings} />
                                <StatCard title="Cancelled Bookings" value={data.bookings.cancelledBookings} color="text-red-600" />

                                <div className="bg-green-800 text-white rounded-xl shadow-sm p-6">
                                    <p className="font-medium">
                                        💰 Confirmed Booking Value
                                    </p>
                                    <h2 className="text-3xl font-bold mt-3">
                                        ₹{Number(data.bookings.totalRevenue || 0).toLocaleString("en-IN")}
                                    </h2>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default PlatformOverview;