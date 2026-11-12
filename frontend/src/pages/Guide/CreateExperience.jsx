import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, PlusCircle } from "lucide-react";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

function CreateExperience() {
  const navigate = useNavigate();

  // Store experience form information
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

  // Store submission messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Available experience categories
  const categories = [
    "Heritage",
    "Food",
    "Adventure",
    "Culture",
    "Shopping",
    "Nature",
    "Other",
  ];

  // Update form values when the guide types
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Submit experience to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Retrieve JWT token saved during login
      const token = localStorage.getItem("token");

      // Send experience information to Express backend
      const response = await api.post(
        "/experiences",
        {
          ...formData,

          // Convert numeric fields before submission
          price: Number(formData.price),

          duration_hours: formData.duration_hours
            ? Number(formData.duration_hours)
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Display success message
      setMessage(response.data.message);

      // Clear the form after successful submission
      setFormData({
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

    } catch (err) {
      // Display backend error message
      setError(
        err.response?.data?.message ||
          "Failed to create experience. Please try again."
      );

    } finally {
      // Stop loading after request finishes
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Back to Guide Dashboard */}
          <button
            type="button"
            onClick={() => navigate("/guide/dashboard")}
            className="flex items-center gap-2 text-green-700 font-medium mb-6 hover:text-green-800"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 flex items-center gap-3">
              <PlusCircle size={32} />
              Create Experience
            </h1>

            <p className="text-gray-600 mt-3">
              Share a unique local experience with travelers.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Experience Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
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
                  placeholder="e.g. Chandni Chowk Heritage Walk"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select a category</option>

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
                  className="block text-gray-700 font-medium mb-2"
                >
                  Location *
                </label>

                <div className="relative">
                  <MapPin
                    size={20}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="e.g. Chandni Chowk"
                    className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-gray-700 font-medium mb-2"
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
                  placeholder="e.g. Delhi"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-gray-700 font-medium mb-2"
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
                    placeholder="e.g. 2 hours"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration_hours"
                    className="block text-gray-700 font-medium mb-2"
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
                    placeholder="e.g. 2"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
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
                  step="0.01"
                  placeholder="e.g. 799"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe what travelers will experience..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-medium mb-2"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

                <p className="text-sm text-gray-500 mt-2">
                  Image upload functionality will be added later.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Submitting Experience..."
                  : "Submit Experience for Approval"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default CreateExperience;