import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ArrowLeft,
  Save,
  CalendarDays,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../services/api";

function TouristProfile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile from MySQL
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await api.get("/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;

        setProfile(user);

        setFormData({
          full_name: user.full_name || "",
          phone: user.phone || "",
        });
      } catch (err) {
        console.error("Fetch Profile Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update input fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Save profile changes
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        "/profile/me",
        {
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setProfile(updatedUser);

      setFormData({
        full_name: updatedUser.full_name || "",
        phone: updatedUser.phone || "",
      });

      // Update Navbar and dashboard user information
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser,
        })
      );

      // Notify components listening for profile updates
      window.dispatchEvent(new Event("userUpdated"));

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Update Profile Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Back Navigation */}
          <Link
            to="/tourist/dashboard"
            className="inline-flex items-center gap-2 text-green-700 font-medium mb-8"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your personal information and account details.
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500">
              Loading your profile...
            </p>
          ) : !profile ? (
            <p className="text-red-600">
              {error || "Unable to load your profile."}
            </p>
          ) : (
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

              {/* Profile Header */}
              <div className="bg-green-700 px-8 py-10 text-white">
                <div className="flex items-center gap-5">

                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={40} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {profile.full_name}
                    </h2>

                    <p className="text-green-100 mt-1">
                      Tourist Account
                    </p>
                  </div>

                </div>
              </div>

              {/* Profile Form */}
              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-6"
              >

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block font-semibold text-gray-800 mb-2"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      minLength={2}
                      maxLength={100}
                      required
                      className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-semibold text-gray-800 mb-2"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={profile.email || ""}
                      readOnly
                      className="w-full border rounded-xl py-3 pl-12 pr-4 bg-gray-50 text-gray-500"
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Your registered email cannot be changed here.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-semibold text-gray-800 mb-2"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={15}
                      placeholder="Enter your phone number"
                      className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>

                {/* Account Created */}
                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Member Since
                  </p>

                  <div className="flex items-center gap-3 text-gray-500 bg-gray-50 rounded-xl p-4">
                    <CalendarDays size={20} />

                    {profile.created_at
                      ? new Date(
                          profile.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Not available"}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p
                    className="text-red-600 text-sm"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {/* Success */}
                {success && (
                  <p
                    className="text-green-700 text-sm"
                    role="status"
                  >
                    {success}
                  </p>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Save size={19} />

                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </form>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default TouristProfile;