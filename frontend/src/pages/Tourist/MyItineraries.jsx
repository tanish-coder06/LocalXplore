import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom"

const MyItineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // Controls whether the create itinerary form is visible
    const [showForm, setShowForm] = useState(false);

    // Stores the information entered by the tourist
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    // Tracks whether an itinerary is being saved
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchItineraries();
    }, []);

    // Fetch all itineraries belonging to the logged-in tourist
    const fetchItineraries = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/itineraries/my");

            setItineraries(response.data.itineraries || []);
        } catch (error) {
            console.error("Error fetching itineraries:", error);
            setError("Unable to load your itineraries.");
        } finally {
            setLoading(false);
        }
    };
    // Update form values when the tourist types
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Create a new itinerary using the backend API
    const handleCreateItinerary = async (e) => {
        e.preventDefault();

        // Make sure the title is not empty
        if (!formData.title.trim()) {
            alert("Please enter an itinerary title.");
            return;
        }

        // Check that the end date is not before the start date
        if (
            formData.start_date &&
            formData.end_date &&
            formData.end_date < formData.start_date
        ) {
            alert("End date cannot be earlier than start date.");
            return;
        }

        try {
            setSaving(true);

            // Send itinerary details to the backend
            await api.post("/itineraries", formData);

            // Reset the form
            setFormData({
                title: "",
                description: "",
                start_date: "",
                end_date: "",
            });

            // Hide the form
            setShowForm(false);

            // Reload itineraries to display the newly created trip
            await fetchItineraries();

            alert("Itinerary created successfully!");
        } catch (error) {
            console.error("Error creating itinerary:", error);

            alert(
                error.response?.data?.message ||
                "Unable to create itinerary. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };
    const handleDeleteItinerary = async (itineraryId) => {
        // Ask for confirmation before deleting
        const confirmed = window.confirm(
            "Are you sure you want to delete this itinerary? All experiences added to it will also be removed."
        );

        // Stop if the tourist clicks Cancel
        if (!confirmed) return;

        try {
            // Send DELETE request to the backend
            await api.delete(`/itineraries/${itineraryId}`);

            // Remove the deleted itinerary from React state
            setItineraries((previousItineraries) =>
                previousItineraries.filter(
                    (itinerary) => itinerary.id !== itineraryId
                )
            );

            // Show success message
            alert("Itinerary deleted successfully!");
        } catch (error) {
            console.error("Error deleting itinerary:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete itinerary. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Page heading */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Itineraries
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Plan and organize your travel experiences in one place.
                        </p>
                    </div>

                    {/* Create itinerary button */}
                    <button
                        type="button"
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        {showForm ? "Cancel" : "+ Create Itinerary"}
                    </button>
                </div>
                {/* Create Itinerary Form */}
                {showForm && (
                    <form
                        onSubmit={handleCreateItinerary}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-5">
                            Create New Itinerary
                        </h2>

                        {/* Trip Title */}
                        <div className="mb-4">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Trip Title *
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. My Jaipur Weekend Trip"
                                maxLength={150}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your travel plans..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        {/* Trip Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label
                                    htmlFor="start_date"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Start Date
                                </label>

                                <input
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="end_date"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    End Date
                                </label>

                                <input
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    min={formData.start_date || undefined}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
                            >
                                {saving ? "Creating..." : "Create Itinerary"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Loading state */}
                {loading && (
                    <p className="text-gray-600">
                        Loading your itineraries...
                    </p>
                )}

                {/* Error state */}
                {error && (
                    <p className="text-red-600">{error}</p>
                )}

                {/* Empty state */}
                {!loading && !error && itineraries.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            No itineraries yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create your first itinerary to start planning your trip.
                        </p>
                    </div>
                )}

                {/* Itinerary cards */}
                {!loading && !error && itineraries.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itineraries.map((itinerary) => (
                            <div
                                key={itinerary.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900">
                                    {itinerary.title}
                                </h2>

                                <p className="text-gray-600 mt-2">
                                    {itinerary.description || "No description provided."}
                                </p>

                                <div className="mt-5 text-sm text-gray-500">
                                    <p>
                                        Experiences: {itinerary.total_experiences || 0}
                                    </p>
                                </div>
                                {/* Itinerary Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 mt-5">

                                    {/* View Itinerary Details */}
                                    <Link
                                        to={`/tourist/itineraries/${itinerary.id}`}
                                        className="inline-block bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                                    >
                                        View Details →
                                    </Link>

                                    {/* Delete Itinerary */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItinerary(itinerary.id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-xl font-semibold transition"
                                    >
                                        Delete Itinerary
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyItineraries;