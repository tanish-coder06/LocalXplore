import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function ManageExperiences() {
    const navigate = useNavigate();

    const [experiences, setExperiences] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/admin/experiences", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setExperiences(response.data.experiences || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load experiences."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    const handleDeactivate = async (experience) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${experience.title}"?`
        );

        if (!confirmed) return;

        setProcessingId(experience.id);
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            await api.patch(
                `/admin/experiences/${experience.id}/deactivate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setExperiences((previous) =>
                previous.map((item) =>
                    item.id === experience.id
                        ? { ...item, status: "inactive" }
                        : item
                )
            );

            setMessage("Experience deactivated successfully!");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to deactivate experience."
            );
        } finally {
            setProcessingId(null);
        }
    };
    // ========================================
    // ADMIN: ACTIVATE INACTIVE EXPERIENCE
    // ========================================

    const handleActivate = async (experience) => {
        // Ask admin to confirm activation
        const confirmed = window.confirm(
            `Are you sure you want to activate "${experience.title}"?`
        );

        if (!confirmed) return;

        // Disable action buttons while processing
        setProcessingId(experience.id);

        // Clear previous messages
        setError("");
        setMessage("");

        try {
            // Get authentication token
            const token = localStorage.getItem("token");

            // Send activation request to backend
            await api.patch(
                `/admin/experiences/${experience.id}/activate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update experience status in frontend
            setExperiences((previous) =>
                previous.map((item) =>
                    item.id === experience.id
                        ? { ...item, status: "active" }
                        : item
                )
            );

            // Display success message
            setMessage("Experience activated successfully!");

        } catch (err) {
            // Display backend error message
            setError(
                err.response?.data?.message ||
                "Failed to activate experience."
            );

        } finally {
            // Re-enable action buttons
            setProcessingId(null);
        }
    };

    const filteredExperiences = experiences.filter((experience) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch = [
            experience.title,
            experience.location,
            experience.city,
            experience.guide_name,
        ].some((value) =>
            (value || "").toLowerCase().includes(search)
        );

        const matchesStatus =
            statusFilter === "all" ||
            experience.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const countByStatus = (status) =>
        experiences.filter((experience) => experience.status === status).length;

    const statusColors = {
        active: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        inactive: "bg-gray-200 text-gray-700",
        rejected: "bg-red-100 text-red-800",
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-7xl mx-auto">

                    <h1 className="text-3xl font-bold text-green-800">
                        Manage Experiences
                    </h1>

                    <p className="text-gray-600 mt-2 mb-6">
                        View and manage experiences submitted by guides.
                    </p>

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-green-700 font-medium mb-8 hover:underline"
                    >
                        ← Back to Admin Dashboard
                    </button>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <p>Loading experiences...</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                {[
                                    ["Total", experiences.length],
                                    ["Active", countByStatus("active")],
                                    ["Pending", countByStatus("pending")],
                                    ["Inactive", countByStatus("inactive")],
                                    ["Rejected", countByStatus("rejected")],
                                ].map(([label, count]) => (
                                    <div
                                        key={label}
                                        className="bg-white rounded-xl shadow-sm border p-5"
                                    >
                                        <p className="text-gray-600">{label}</p>
                                        <h2 className="text-3xl font-bold text-green-800 mt-2">
                                            {count}
                                        </h2>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search by title, location, city or guide..."
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    className="border rounded-lg px-4 py-3"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                    className="border rounded-lg px-4 py-3 bg-white"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <p className="text-gray-600 mb-4">
                                Showing {filteredExperiences.length} of{" "}
                                {experiences.length} experiences
                            </p>

                            {filteredExperiences.length === 0 ? (
                                <div className="bg-white rounded-xl p-10 text-center">
                                    No experiences found.
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-green-50 text-green-800">
                                            <tr>
                                                <th className="px-5 py-4">Title</th>
                                                <th className="px-5 py-4">Guide</th>
                                                <th className="px-5 py-4">Location</th>
                                                <th className="px-5 py-4">Price</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredExperiences.map((experience) => (
                                                <tr
                                                    key={experience.id}
                                                    className="border-t hover:bg-gray-50"
                                                >
                                                    <td className="px-5 py-4 font-medium">
                                                        {experience.title}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {experience.guide_name || "Unassigned"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {experience.location}, {experience.city}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        ₹{Number(experience.price).toLocaleString("en-IN")}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[experience.status] ||
                                                                "bg-gray-100 text-gray-700"
                                                                }`}
                                                        >
                                                            {experience.status}
                                                        </span>
                                                    </td>

                                                    {/* ========================================
    ADMIN EXPERIENCE ACTION BUTTONS
======================================== */}

                                                    <td className="px-5 py-4">

                                                        {/* Deactivate active experiences */}
                                                        {experience.status === "active" ? (

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeactivate(experience)}
                                                                disabled={processingId !== null}
                                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                                                            >
                                                                {processingId === experience.id
                                                                    ? "Processing..."
                                                                    : "Deactivate"}
                                                            </button>

                                                        ) : experience.status === "inactive" ? (

                                                            /* Activate inactive experiences */
                                                            <button
                                                                type="button"
                                                                onClick={() => handleActivate(experience)}
                                                                disabled={processingId !== null}
                                                                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 transition"
                                                            >
                                                                {processingId === experience.id
                                                                    ? "Processing..."
                                                                    : "Activate"}
                                                            </button>

                                                        ) : (

                                                            /* Pending and rejected experiences */
                                                            <span className="text-gray-400">
                                                                No action
                                                            </span>

                                                        )}

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default ManageExperiences;