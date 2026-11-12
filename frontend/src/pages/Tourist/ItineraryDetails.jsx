import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const ItineraryDetails = () => {
  // Get itinerary ID from URL
  const { id } = useParams();

  // ==========================================
  // STATE VARIABLES
  // ==========================================

  const [itinerary, setItinerary] = useState(null);
  const [items, setItems] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add experience form
  const [selectedExperience, setSelectedExperience] = useState("");
  const [dayNumber, setDayNumber] = useState(1);
  const [notes, setNotes] = useState("");
  const [addingExperience, setAddingExperience] = useState(false);

  // Feedback message
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Change experience day
  const [editingDays, setEditingDays] = useState({});
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Edit itinerary
  const [showEditForm, setShowEditForm] = useState(false);
  const [savingItinerary, setSavingItinerary] = useState(false);

  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  // ==========================================
  // FETCH ITINERARY DETAILS
  // ==========================================

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/itineraries/${id}`);

        setItinerary(response.data.itinerary);
        setItems(response.data.items || []);
      } catch (err) {
        console.error("Error fetching itinerary:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load itinerary details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryDetails();
  }, [id]);

  // ==========================================
  // FETCH AVAILABLE EXPERIENCES
  // ==========================================

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get("/experiences/active");

        const data = response.data;

        // Support either an array or an object containing experiences
        if (Array.isArray(data)) {
          setExperiences(data);
        } else {
          setExperiences(data.experiences || []);
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
      }
    };

    fetchExperiences();
  }, []);

  // ==========================================
  // DATE FORMATTING
  // ==========================================

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Not selected";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Format date for HTML date input
  const formatDateForInput = (date) => {
    if (!date) return "";

    if (typeof date === "string") {
      return date.slice(0, 10);
    }

    return new Date(date).toISOString().slice(0, 10);
  };

  // ==========================================
  // SHOW FEEDBACK MESSAGE
  // ==========================================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // ==========================================
  // EDIT ITINERARY
  // ==========================================

  // Open edit form with existing data
  const handleOpenEditForm = () => {
    if (!itinerary) return;

    setEditFormData({
      title: itinerary.title || "",
      description: itinerary.description || "",
      start_date: formatDateForInput(itinerary.start_date),
      end_date: formatDateForInput(itinerary.end_date),
    });

    setShowEditForm(true);
  };

  // Update form inputs
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save updated itinerary
  const handleUpdateItinerary = async (e) => {
    e.preventDefault();

    if (!editFormData.title.trim()) {
      alert("Please enter a trip title.");
      return;
    }

    if (
      editFormData.start_date &&
      editFormData.end_date &&
      editFormData.end_date < editFormData.start_date
    ) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    try {
      setSavingItinerary(true);

      await api.put(`/itineraries/${id}`, {
        title: editFormData.title.trim(),
        description: editFormData.description,
        start_date: editFormData.start_date || null,
        end_date: editFormData.end_date || null,
      });

      // Reload updated details
      const response = await api.get(`/itineraries/${id}`);

      setItinerary(response.data.itinerary);
      setItems(response.data.items || []);

      setShowEditForm(false);

      showMessage("Itinerary updated successfully!");
    } catch (err) {
      console.error("Error updating itinerary:", err);

      showMessage(
        err.response?.data?.message ||
          "Unable to update itinerary.",
        "error"
      );
    } finally {
      setSavingItinerary(false);
    }
  };

  // ==========================================
  // ADD EXPERIENCE
  // ==========================================

  const handleAddExperience = async (e) => {
    e.preventDefault();

    if (!selectedExperience) {
      showMessage("Please select an experience.", "error");
      return;
    }

    const selectedDay = Number(dayNumber);

    if (!Number.isInteger(selectedDay) || selectedDay < 1) {
      showMessage("Please enter a valid day number.", "error");
      return;
    }

    try {
      setAddingExperience(true);
      setMessage("");

      await api.post(`/itineraries/${id}/items`, {
        experience_id: Number(selectedExperience),
        day_number: selectedDay,
        notes: notes.trim(),
      });

      // Fetch updated itinerary
      const response = await api.get(`/itineraries/${id}`);

      setItinerary(response.data.itinerary);
      setItems(response.data.items || []);

      // Reset form
      setSelectedExperience("");
      setDayNumber(1);
      setNotes("");

      showMessage("Experience added successfully!");
    } catch (err) {
      console.error("Error adding experience:", err);

      showMessage(
        err.response?.data?.message ||
          "Unable to add experience.",
        "error"
      );
    } finally {
      setAddingExperience(false);
    }
  };

  // ==========================================
  // REMOVE EXPERIENCE
  // ==========================================

  const handleRemoveExperience = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this experience?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/itineraries/${id}/items/${itemId}`);

      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== itemId)
      );

      showMessage("Experience removed successfully!");
    } catch (err) {
      console.error("Error removing experience:", err);

      showMessage(
        err.response?.data?.message ||
          "Unable to remove experience.",
        "error"
      );
    }
  };

  // ==========================================
  // CHANGE EXPERIENCE DAY
  // ==========================================

  const handleChangeDay = async (item) => {
    const newDay = Number(
      editingDays[item.id] ?? item.day_number
    );

    if (!Number.isInteger(newDay) || newDay < 1) {
      showMessage("Please enter a valid day number.", "error");
      return;
    }

    if (newDay === Number(item.day_number)) {
      showMessage(
        "This experience is already assigned to that day.",
        "error"
      );
      return;
    }

    try {
      setUpdatingItemId(item.id);
      setMessage("");

      await api.patch(
        `/itineraries/${id}/items/${item.id}`,
        {
          day_number: newDay,
        }
      );

      // Update item locally and sort by day
      setItems((previousItems) =>
        previousItems
          .map((existingItem) =>
            existingItem.id === item.id
              ? { ...existingItem, day_number: newDay }
              : existingItem
          )
          .sort(
            (a, b) =>
              Number(a.day_number) - Number(b.day_number) ||
              Number(a.id) - Number(b.id)
          )
      );

      // Clear the edited value so the input follows saved data
      setEditingDays((previous) => {
        const updated = { ...previous };
        delete updated[item.id];
        return updated;
      });

      showMessage(
        `Experience successfully moved to Day ${newDay}!`
      );
    } catch (err) {
      console.error("Error changing experience day:", err);

      showMessage(
        err.response?.data?.message ||
          "Unable to change experience day.",
        "error"
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <p className="text-gray-600">
          Loading itinerary...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <p className="text-red-600">
          {error || "Itinerary not found."}
        </p>

        <Link
          to="/tourist/itineraries"
          className="inline-block mt-4 text-green-700 font-semibold"
        >
          ← Back to My Itineraries
        </Link>
      </div>
    );
  }

  // ========================================
// DELETE ITINERARY
// ========================================



  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Back Navigation */}
        <Link
          to="/tourist/itineraries"
          className="text-green-700 font-semibold hover:underline"
        >
          ← Back to My Itineraries
        </Link>

        {/* =====================================
            ITINERARY DETAILS CARD
        ===================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <h1 className="text-3xl font-bold text-gray-900">
              {itinerary.title}
            </h1>

            <button
              type="button"
              onClick={handleOpenEditForm}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold transition"
            >
              Edit Itinerary
            </button>

          </div>

          <p className="text-gray-600 mt-3">
            {itinerary.description || "No description provided."}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 text-gray-700">

            <p>
              <span className="font-semibold">
                Start Date:
              </span>{" "}
              {formatDate(itinerary.start_date)}
            </p>

            <p>
              <span className="font-semibold">
                End Date:
              </span>{" "}
              {formatDate(itinerary.end_date)}
            </p>

          </div>
        </div>

        {/* =====================================
            EDIT ITINERARY FORM
        ===================================== */}

        {showEditForm && (
          <form
            onSubmit={handleUpdateItinerary}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-6"
          >

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Itinerary Details
            </h2>

            {/* Trip Title */}
            <div className="mb-5">
              <label
                htmlFor="edit-title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Trip Title *
              </label>

              <input
                id="edit-title"
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditInputChange}
                maxLength={150}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label
                htmlFor="edit-description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>

              <textarea
                id="edit-description"
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                rows={3}
                placeholder="Describe your travel plans..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

              <div>
                <label
                  htmlFor="edit-start-date"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Start Date
                </label>

                <input
                  id="edit-start-date"
                  type="date"
                  name="start_date"
                  value={editFormData.start_date}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-end-date"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  End Date
                </label>

                <input
                  id="edit-end-date"
                  type="date"
                  name="end_date"
                  value={editFormData.end_date}
                  onChange={handleEditInputChange}
                  min={editFormData.start_date || undefined}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={savingItinerary}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {savingItinerary
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                disabled={savingItinerary}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

            </div>
          </form>
        )}

        {/* =====================================
            ADD EXPERIENCE FORM
        ===================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Add Experience to Itinerary
          </h2>

          <p className="text-gray-600 mb-6">
            Choose an experience and decide which day of your trip to enjoy it.
          </p>

          <form
            onSubmit={handleAddExperience}
            className="space-y-5"
          >

            {/* Select Experience */}
            <div>
              <label
                htmlFor="experience-select"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select Experience
              </label>

              <select
                id="experience-select"
                value={selectedExperience}
                onChange={(e) =>
                  setSelectedExperience(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">
                  Choose an experience
                </option>

                {experiences.map((experience) => (
                  <option
                    key={experience.id}
                    value={experience.id}
                  >
                    {experience.title} — {experience.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Number */}
            <div>
              <label
                htmlFor="day-number"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Day Number
              </label>

              <input
                id="day-number"
                type="number"
                min="1"
                step="1"
                value={dayNumber}
                onChange={(e) =>
                  setDayNumber(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="experience-notes"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Notes (Optional)
              </label>

              <textarea
                id="experience-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: Visit in the morning"
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={addingExperience}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {addingExperience
                ? "Adding..."
                : "+ Add Experience"}
            </button>

          </form>
        </div>

        {/* =====================================
            FEEDBACK MESSAGE
        ===================================== */}

        {message && (
          <div
            role="status"
            className={`mt-6 rounded-xl p-4 font-medium ${
              messageType === "error"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* =====================================
            PLANNED EXPERIENCES
        ===================================== */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Planned Experiences ({items.length})
          </h2>

          {items.length === 0 ? (

            // Empty itinerary
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">

              <h3 className="text-xl font-semibold text-gray-800">
                No experiences added yet
              </h3>

              <p className="text-gray-500 mt-2">
                Start exploring LocalXplore experiences to plan your trip.
              </p>

              <Link
                to="/explore"
                className="inline-block mt-5 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Explore Experiences
              </Link>

            </div>

          ) : (

            <div className="space-y-4">

              {items.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >

                  {/* Day Number */}
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    Day {item.day_number}
                  </p>

                  {/* Change Day */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">

                    <label
                      htmlFor={`day-${item.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Move to Day:
                    </label>

                    <input
                      id={`day-${item.id}`}
                      type="number"
                      min="1"
                      step="1"
                      value={
                        editingDays[item.id] ??
                        item.day_number
                      }
                      onChange={(e) =>
                        setEditingDays((previous) => ({
                          ...previous,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="w-20 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    <button
                      type="button"
                      onClick={() => handleChangeDay(item)}
                      disabled={updatingItemId === item.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      {updatingItemId === item.id
                        ? "Saving..."
                        : "Save Day"}
                    </button>

                  </div>

                  {/* Experience Title */}
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  {/* Location */}
                  <p className="text-gray-600 mt-2">
                    {item.city ||
                      item.location ||
                      "Location unavailable"}
                  </p>

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-gray-500 mt-3">
                      Notes: {item.notes}
                    </p>
                  )}

                  {/* Experience Actions */}
                  <div className="flex flex-wrap items-center gap-4 mt-5">

                    <Link
                      to={`/experiences/${item.experience_id}`}
                      className="text-green-700 font-semibold hover:underline"
                    >
                      View Experience →
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExperience(item.id)
                      }
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold transition"
                    >
                      Remove Experience
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default ItineraryDetails;