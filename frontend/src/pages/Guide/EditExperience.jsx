import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function EditExperience() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Store experience details
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    city: "",
    duration: "",
    duration_hours: "",
    price: "",
    description: "",
    image: "",
  });

  // Track loading, saving, and messages
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const categories = [
    "Heritage",
    "Food",
    "Adventure",
    "Culture",
    "Shopping",
    "Nature",
    "Other",
  ];

  // Load the selected experience when the page opens
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/experiences/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Find the selected experience
        const selectedExperience = response.data.experiences.find(
          (experience) => String(experience.id) === String(id)
        );

        if (!selectedExperience) {
          setError("Experience not found or access denied.");
          return;
        }

        // Fill the form with existing information
        setFormData({
          title: selectedExperience.title || "",
          category: selectedExperience.category || "",
          location: selectedExperience.location || "",
          city: selectedExperience.city || "",
          duration: selectedExperience.duration || "",
          duration_hours: selectedExperience.duration_hours ?? "",
          price: selectedExperience.price ?? "",
          description: selectedExperience.description || "",
          image: selectedExperience.image || "",
        });
      } catch (err) {
        console.error("Load Experience Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load experience details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Submit updated experience
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/experiences/${id}`,
        {
          ...formData,
          price: Number(formData.price),
          duration_hours:
            formData.duration_hours === ""
              ? null
              : Number(formData.duration_hours),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error("Update Experience Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update experience."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/guide/my-experiences")}
            className="text-green-700 font-medium mb-6 hover:underline"
          >
            ← Back to My Experiences
          </button>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-green-800 mb-3">
            Edit Experience
          </h1>

          <p className="text-gray-600 mb-8">
            Update your experience details and submit them for admin approval.
          </p>

          {/* Loading */}
          {loading && (
            <p className="text-gray-600">
              Loading experience details...
            </p>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div
              role="status"
              className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6"
            >
              {message}
            </div>
          )}

          {/* Edit Form */}
          {!loading && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6"
            >

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Experience Title *
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Select Category</option>

                  {formData.category &&
                    !categories.includes(formData.category) && (
                      <option value={formData.category}>
                        {formData.category}
                      </option>
                    )}

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Location *
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block font-medium text-gray-700 mb-2"
                >
                  City *
                </label>

                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="duration"
                    className="block font-medium text-gray-700 mb-2"
                  >
                    Duration
                  </label>

                  <input
                    id="duration"
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="e.g. 3 hours"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration_hours"
                    className="block font-medium text-gray-700 mb-2"
                  >
                    Duration (Hours)
                  </label>

                  <input
                    id="duration_hours"
                    type="number"
                    name="duration_hours"
                    value={formData.duration_hours}
                    onChange={handleChange}
                    min="0"
                    max="99.99"
                    step="0.25"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Price (₹) *
                </label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  max="99999999.99"
                  step="0.01"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="image"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Experience Image URL
                </label>

                <input
                  id="image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || Boolean(error && !message)}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </form>
          )}

        </div>
      </div>
    </>
  );
}

export default EditExperience;