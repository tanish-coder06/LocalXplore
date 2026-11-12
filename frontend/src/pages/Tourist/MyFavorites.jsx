import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, ArrowLeft, Trash2 } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../services/api";

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/favorites/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(response.data.favorites || []);
    } catch (err) {
      console.error("Fetch Favorites Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load your favorites."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (experienceId) => {
    try {
      setRemovingId(experienceId);
      setError("");

      const token = localStorage.getItem("token");

      await api.delete(`/favorites/${experienceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites((previous) =>
        previous.filter((item) => item.id !== experienceId)
      );
    } catch (err) {
      console.error("Remove Favorite Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to remove favorite."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/tourist/dashboard"
            className="inline-flex items-center gap-2 text-green-700 font-medium mb-8"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <Heart className="text-red-500 fill-red-500" size={30} />
            <h1 className="text-3xl font-bold text-gray-900">
              My Favorites
            </h1>
          </div>

          <p className="text-gray-500 mb-10">
            Your saved experiences, all in one place.
          </p>

          {loading ? (
            <p className="text-gray-500">Loading favorites...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border p-12 text-center">
              <Heart
                size={48}
                className="text-gray-300 mx-auto mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">
                No favorites yet
              </h2>

              <p className="text-gray-500 mb-6">
                Explore local experiences and save the ones you love.
              </p>

              <Link
                to="/explore"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                Explore Experiences
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((experience) => (
                <div
                  key={experience.id}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                >
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {experience.title}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <MapPin size={17} />
                      <span>{experience.city || experience.location}</span>
                    </div>

                    <p className="text-2xl font-bold text-green-700 mb-5">
                      ₹{Number(experience.price).toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}/ person
                      </span>
                    </p>

                    <div className="flex gap-3">
                      <Link
                        to={`/experience/${experience.id}`}
                        className="flex-1 text-center bg-green-700 text-white py-3 rounded-xl font-semibold"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeFavorite(experience.id)}
                        disabled={removingId === experience.id}
                        className="border border-red-200 text-red-600 px-4 rounded-xl hover:bg-red-50 disabled:opacity-50"
                        title="Remove from favorites"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MyFavorites;