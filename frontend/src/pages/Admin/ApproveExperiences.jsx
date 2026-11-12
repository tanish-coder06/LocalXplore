import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function ApproveExperiences() {
    const navigate = useNavigate();

    // Store pending experiences
    const [experiences, setExperiences] = useState([]);

    // Track loading and errors
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // Track which experience is currently being processed
    const [processingId, setProcessingId] = useState(null);

    // Display success messages after approval or rejection
    const [successMessage, setSuccessMessage] = useState("");
    // Automatically clear success messages after 4 seconds
    useEffect(() => {
        // Do nothing if there is no success message
        if (!successMessage) return;

        // Start a timer to clear the message
        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 4000);

        // Clear the timer if the component updates or unmounts
        return () => clearTimeout(timer);

    }, [successMessage]);

    // Fetch pending experiences when the page loads
    useEffect(() => {
        const fetchPendingExperiences = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/admin/experiences/pending",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setExperiences(response.data.experiences || []);
            } catch (err) {
                console.error("Fetch Pending Experiences Error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load pending experiences."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPendingExperiences();
    }, []);
    // Approve a pending experience
    const handleApprove = async (experienceId) => {
        try {
            // Prevent duplicate requests
            if (processingId !== null) return;

            setProcessingId(experienceId);
            setError("");
            setSuccessMessage("");

            // Retrieve the admin's authentication token
            const token = localStorage.getItem("token");

            // Send approval request to the backend
            await api.patch(
                `/admin/experiences/${experienceId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the approved experience from the pending list
            setExperiences((previousExperiences) =>
                previousExperiences.filter(
                    (experience) => experience.id !== experienceId
                )
            );

            setSuccessMessage("Experience approved successfully!");

        } catch (err) {
            console.error("Approve Experience Error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to approve experience."
            );

        } finally {
            setProcessingId(null);
        }
    };


    // Reject a pending experience
    const handleReject = async (experienceId) => {
        // Ask for confirmation before rejecting
        const confirmed = window.confirm(
            "Are you sure you want to reject this experience?"
        );

        if (!confirmed) return;

        try {
            // Prevent duplicate requests
            if (processingId !== null) return;

            setProcessingId(experienceId);
            setError("");
            setSuccessMessage("");

            // Retrieve the admin's authentication token
            const token = localStorage.getItem("token");

            // Send rejection request to the backend
            await api.patch(
                `/admin/experiences/${experienceId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Remove the rejected experience from the pending list
            setExperiences((previousExperiences) =>
                previousExperiences.filter(
                    (experience) => experience.id !== experienceId
                )
            );

            setSuccessMessage("Experience rejected successfully!");

        } catch (err) {
            console.error("Reject Experience Error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to reject experience."
            );

        } finally {
            setProcessingId(null);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-6xl mx-auto">

                    {/* Page Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-green-800">
                            Approve Experiences
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Review experiences submitted by guides.
                        </p>
                    </div>

                    {/* Back to Admin Dashboard */}
                    <button
                        type="button"
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-green-700 font-medium mb-8 hover:underline"
                    >
                        ← Back to Admin Dashboard
                    </button>
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg mb-6">
                            {successMessage}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <p className="text-gray-600">
                            Loading pending experiences...
                        </p>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && experiences.length === 0 && (
                        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800">
                                No Pending Experiences
                            </h2>

                            <p className="text-gray-600 mt-3">
                                All submitted experiences have been reviewed.
                            </p>
                        </div>
                    )}

                    {/* Pending Experiences Grid */}
                    {!loading && !error && experiences.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {experiences.map((experience) => (
                                <div
                                    key={experience.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
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

                                    {/* Experience Details */}
                                    <div className="p-5">

                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-500">
                                                {experience.category}
                                            </span>

                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                Pending
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

                                        {/* Guide Information */}
                                        <div className="border-t border-gray-100 mt-4 pt-4">
                                            <p className="text-sm text-gray-700">
                                                <strong>Guide:</strong> {experience.guide_name}
                                            </p>

                                            <p className="text-sm text-gray-600 mt-1 break-words">
                                                <strong>Email:</strong> {experience.guide_email}
                                            </p>
                                        </div>

                                        {/* Experience Description */}
                                        {experience.description && (
                                            <p className="text-gray-600 text-sm mt-4">
                                                {experience.description}
                                            </p>
                                        )}
                                        {/* Admin Approval Actions */}
                                        <div className="flex gap-3 mt-6">

                                            {/* Approve Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(experience.id)}
                                                disabled={processingId !== null}
                                                className="flex-1 bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingId === experience.id
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>

                                            {/* Reject Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleReject(experience.id)}
                                                disabled={processingId !== null}
                                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingId === experience.id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>

                                        </div>

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

export default ApproveExperiences;