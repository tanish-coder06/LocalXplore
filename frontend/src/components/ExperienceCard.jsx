import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  MapPin,
  Star,
  Clock,
  Heart,
  ArrowUpRight,
} from "lucide-react";

function ExperienceCard({ experience }) {
  const navigate = useNavigate();

  // Favorite states
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  // Check whether this experience is already in favorites
  useEffect(() => {
    let cancelled = false;

    const checkFavorite = async () => {
      const token = localStorage.getItem("token");

      let user = null;

      try {
        user = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        user = null;
      }

      // Favorites are only available to logged-in tourists
      if (!token || user?.role !== "tourist") {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await api.get("/favorites/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cancelled) return;

        const savedFavorites = response.data.favorites || [];

        const alreadySaved = savedFavorites.some(
          (item) => String(item.id) === String(experience.id)
        );

        setIsFavorite(alreadySaved);
        setFavoriteError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Check Favorite Error:", error);

        setFavoriteError(
          error.response?.data?.message ||
            "Unable to load favorite status."
        );
      }
    };

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [experience.id]);

  // Add or remove an experience from favorites
  const handleFavorite = async () => {
    if (favoriteLoading) return;

    const token = localStorage.getItem("token");

    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    // Redirect guests to login
    if (!token) {
      alert("Please log in as a tourist to save experiences.");
      navigate("/login");
      return;
    }

    // Prevent guides and admins from saving favorites
    if (user?.role !== "tourist") {
      setFavoriteError("Only tourists can save favorite experiences.");
      return;
    }

    setFavoriteLoading(true);
    setFavoriteError("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (isFavorite) {
        // Remove from MySQL favorites table
        await api.delete(
          `/favorites/${experience.id}`,
          config
        );

        setIsFavorite(false);
      } else {
        // Save to MySQL favorites table
        await api.post(
          `/favorites/${experience.id}`,
          {},
          config
        );

        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Favorite Action Error:", error);

      setFavoriteError(
        error.response?.data?.message ||
          "Failed to update favorites. Please try again."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">

      {/* Experience Image */}
      <div className="relative overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-xs font-semibold shadow-sm">
          {experience.category}
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={isFavorite}
          title={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          className="absolute top-4 right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            size={20}
            className={
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-700"
            }
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">

        {/* Favorite Error Message */}
        {favoriteError && (
          <p
            className="text-xs text-red-600 mb-3"
            role="alert"
          >
            {favoriteError}
          </p>
        )}

        {/* Location and Rating */}
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
            <MapPin
              size={16}
              className="text-green-700 shrink-0"
            />

            <span className="truncate">
              {experience.location}
            </span>
          </span>

          <span className="flex items-center gap-1 text-sm font-semibold text-gray-800 shrink-0">
            <Star
              size={16}
              className="text-orange-400 fill-orange-400"
            />

            {Number(experience.rating || 0).toFixed(1)}

            <span className="text-gray-400 font-normal">
              ({experience.reviews ?? 0})
            </span>
          </span>
        </div>

        {/* Experience Title */}
        <h3 className="text-xl font-bold text-gray-900 mt-4 group-hover:text-green-700 transition-colors">
          {experience.title}
        </h3>

        {/* Duration */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
          <Clock
            size={16}
            className="text-green-700"
          />

          <span>{experience.duration}</span>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-5 pt-5 flex items-center justify-between gap-3">

          {/* Price */}
          <div>
            <p className="text-xs text-gray-400">
              Starting from
            </p>

            <p className="text-2xl font-bold text-green-700 mt-1">
              ₹{Number(experience.price || 0).toLocaleString("en-IN")}

              <span className="text-xs text-gray-500 font-normal">
                {" "}/ person
              </span>
            </p>
          </div>

          {/* Explore Button */}
          <Link
            to={`/experience/${experience.id}`}
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
          >
            Explore
            <ArrowUpRight size={17} />
          </Link>

        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;