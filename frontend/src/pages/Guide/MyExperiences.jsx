import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function MyExperiences() {
    const navigate = useNavigate();

    // Store experiences received from the backend
    const [experiences, setExperiences] = useState([]);

    // Track loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch experiences when the page opens
    useEffect(() => {
        const fetchMyExperiences = async () => {
            try {
                const token = localStorage.getItem("token");

                // Request experiences belonging to the logged-in guide
                const response = await api.get("/experiences/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Save the experiences in React state
                setExperiences(response.data.experiences || []);
            } catch (err) {
                console.error("Fetch My Experiences Error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load your experiences."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyExperiences();
    }, []);


    // Deactivate an experience created by the logged-in guide
    const handleDeactivate = async (experienceId) => {
        // Ask for confirmation before deactivating
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this experience?"
        );

        if (!confirmed) {
            return;
        }

        try {
            // Retrieve JWT token
            const token = localStorage.getItem("token");

            // Call the existing backend API
            await api.patch(
                `/experiences/${experienceId}/deactivate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update the experience status on the page
            setExperiences((previousExperiences) =>
                previousExperiences.map((experience) =>
                    experience.id === experienceId
                        ? { ...experience, status: "inactive" }
                        : experience
                )
            );

            // Clear any previous error
            setError("");

            alert("Experience deactivated successfully!");
        } catch (err) {
            console.error("Deactivate Experience Error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to deactivate experience."
            );
        }
    };
    // Return a different badge style for each approval status
    const getStatusStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";

            case "active":
                return "bg-green-100 text-green-800";

            case "inactive":
                return "bg-gray-100 text-gray-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Page heading */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-green-800">
                                My Experiences
                            </h1>

                            <p className="text-gray-600 mt-2">
                                View and manage the experiences you have submitted.
                            </p>
                        </div>

                        {/* Create Experience button */}
                        <button
                            onClick={() => navigate("/guide/create-experience")}
                            className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800 transition"
                        >
                            + Create Experience
                        </button>
                    </div>

                    {/* Back to Dashboard */}
                    <button
                        onClick={() => navigate("/guide/dashboard")}
                        className="text-green-700 font-medium mb-8 hover:underline"
                    >
                        ← Back to Dashboard
                    </button>

                    {/* Loading */}
                    {loading && (
                        <p className="text-gray-600">
                            Loading your experiences...
                        </p>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* No experiences */}
                    {!loading && !error && experiences.length === 0 && (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800">
                                No Experiences Yet
                            </h2>

                            <p className="text-gray-600 mt-3">
                                You haven't submitted any experiences yet.
                            </p>

                            <button
                                onClick={() => navigate("/guide/create-experience")}
                                className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
                            >
                                Create Your First Experience
                            </button>
                        </div>
                    )}

                    {/* Experiences Grid */}
                    {!loading && !error && experiences.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {experiences.map((experience) => (
                                <div
                                    key={experience.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                                >

                                    {/* Experience Image */}
                                    {experience.image ? (
                                        <img
                                            src={experience.image}
                                            alt={experience.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-green-50 flex items-center justify-center">
                                            <span className="text-green-700 font-medium">
                                                LocalXplore Experience
                                            </span>
                                        </div>
                                    )}

                                    {/* Experience Information */}
                                    <div className="p-5">

                                        <div className="flex justify-between items-start gap-3 mb-3">
                                            <span className="text-sm text-gray-500">
                                                {experience.category}
                                            </span>

                                            {/* Approval Status */}
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                                                    experience.status
                                                )}`}
                                            >
                                                {experience.status}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                            {experience.title}
                                        </h2>

                                        <p className="text-gray-600 mb-2">
                                            📍 {experience.location}, {experience.city}
                                        </p>

                                        {experience.duration && (
                                            <p className="text-gray-600 mb-2">
                                                ⏱ {experience.duration}
                                            </p>
                                        )}

                                        <p className="text-green-700 font-bold text-lg mt-4">
                                            ₹{Number(experience.price).toLocaleString("en-IN")}
                                        </p>
                                        {/* Edit Experience Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/guide/edit-experience/${experience.id}`)
                                            }
                                            className="mt-4 w-full bg-green-700 text-white py-2.5 rounded-lg font-medium hover:bg-green-800 transition"
                                        >
                                            Edit Experience
                                        </button>
                                        {/* Deactivate Experience Button */}
                                        {["pending", "active"].includes(experience.status) && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeactivate(experience.id)}
                                                className="mt-3 w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
                                            >
                                                Deactivate Experience
                                            </button>
                                        )}

                                        {/* Approval information */}
                                        {experience.status === "pending" && (
                                            <p className="text-sm text-yellow-700 mt-3">
                                                Awaiting admin approval.
                                            </p>
                                        )}

                                        {experience.status === "rejected" && (
                                            <p className="text-sm text-red-700 mt-3">
                                                This experience was not approved.
                                            </p>
                                        )}

                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default MyExperiences;