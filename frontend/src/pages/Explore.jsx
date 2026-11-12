import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  Clock,
  X,
  RotateCcw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ExperienceCard from "../components/ExperienceCard";

// Images for popular destinations
const destinationImages = {
  Delhi:
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  Jaipur:
    "https://images.unsplash.com/photo-1599661046827-dacff0c0f35a?w=800",
  Mumbai:
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
  Agra:
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
};

const fallbackDestinationImage =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

const categories = [
  "Food & Culinary",
  "History & Heritage",
  "Photography",
  "Art & Culture",
  "Adventure",
  "Workshops",
  "Nature",
  "Shopping",
];

function Explore() {
  // ========================================
  // STATE
  // ========================================

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [duration, setDuration] = useState("All");
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("recommended");

  // ========================================
  // FETCH ACTIVE EXPERIENCES FROM MYSQL
  // ========================================

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/experiences/active");

        setExperiences(response.data.experiences || []);
      } catch (err) {
        console.error("Fetch Experiences Error:", err);

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

  // ========================================
  // GET UNIQUE DESTINATIONS
  // ========================================

  const destinations = [
    ...new Set(
      experiences
        .map((experience) => experience.city?.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  // ========================================
  // FILTER EXPERIENCES
  // ========================================

  const filteredExperiences = experiences
    .filter((experience) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        (experience.title || "")
          .toLowerCase()
          .includes(query) ||
        (experience.location || "")
          .toLowerCase()
          .includes(query) ||
        (experience.category || "")
          .toLowerCase()
          .includes(query);

      const matchesLocation =
        location === "All" ||
        experience.city?.trim() === location;

      const matchesCategory =
        category === "All" ||
        experience.category === category;

      const matchesPrice =
        Number(experience.price) <= maxPrice;

      const hours = Number(experience.durationHours);

      const matchesDuration =
        duration === "All" ||
        (duration === "Short" && hours <= 2) ||
        (duration === "Medium" &&
          hours > 2 &&
          hours <= 3) ||
        (duration === "Long" && hours > 3);

      const matchesRating =
        Number(experience.rating || 0) >= rating;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesPrice &&
        matchesDuration &&
        matchesRating
      );
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "rating") {
        return Number(b.rating) - Number(a.rating);
      }

      return 0;
    });

  // ========================================
  // RESET FILTERS
  // ========================================

  const resetFilters = () => {
    setSearch("");
    setLocation("All");
    setCategory("All");
    setMaxPrice(2000);
    setDuration("All");
    setRating(0);
    setSort("recommended");
  };

  // ========================================
  // HANDLE DESTINATION CLICK
  // ========================================

  const handleDestinationClick = (city) => {
    // Clear other filters so the selected city
    // shows all its available experiences.
    resetFilters();

    setLocation(city);

    // Scroll to experience results.
    setTimeout(() => {
      document
        .getElementById("experience-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // ========================================
  // JSX
  // ========================================

  return (
    <>
      <Navbar />

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <section className="bg-green-50 py-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <p className="text-green-700 font-semibold uppercase tracking-widest text-sm">
            Explore LocalXplore
          </p>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">
            Discover Amazing Local Experiences
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl">
            Find unique experiences, explore hidden places and
            connect with passionate local guides.
          </p>

          {/* Search Bar */}
          <div className="mt-8 bg-white rounded-xl shadow-sm flex items-center gap-3 p-3 max-w-2xl">
            <Search className="text-green-700" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiences, locations..."
              className="flex-1 min-w-0 outline-none text-gray-800 py-2"
            />
          </div>
        </div>
      </section>

      {/* ========================================
          EXPLORE BY DESTINATION
      ======================================== */}

      <section className="bg-white py-12">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Section Heading */}
          <div className="mb-8">
            <p className="text-green-700 font-semibold uppercase tracking-widest text-sm">
              Popular Destinations
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Explore by Destination
            </h2>

            <p className="text-gray-500 mt-2">
              Discover unique local experiences in your favorite cities.
            </p>
          </div>

          {/* Destination Loading State */}
          {loading ? (
            <div className="bg-gray-50 rounded-2xl p-10 text-center">
              <p className="text-gray-500">
                Loading destinations...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center">
              {error}
            </div>
          ) : destinations.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-10 text-center">
              <MapPin
                size={40}
                className="mx-auto text-gray-300 mb-3"
              />

              <p className="text-gray-500">
                No destinations available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((city) => {
                // Count experiences for each city.
                const experienceCount = experiences.filter(
                  (experience) =>
                    experience.city?.trim() === city
                ).length;

                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() =>
                      handleDestinationClick(city)
                    }
                    className={`relative h-56 rounded-2xl overflow-hidden shadow-sm group text-left transition-all duration-300 hover:shadow-xl ${
                      location === city
                        ? "ring-4 ring-green-600"
                        : ""
                    }`}
                  >
                    {/* Destination Image */}
                    <img
                      src={
                        destinationImages[city] ||
                        fallbackDestinationImage
                      }
                      alt={`Explore ${city}`}
                      onError={(event) => {
                        if (
                          event.currentTarget.src !==
                          fallbackDestinationImage
                        ) {
                          event.currentTarget.src =
                            fallbackDestinationImage;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Dark Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Destination Details */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={17} />

                        <span className="text-sm font-medium">
                          India
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold">
                        {city}
                      </h3>

                      <p className="text-sm text-gray-200 mt-1">
                        {experienceCount}{" "}
                        {experienceCount === 1
                          ? "Experience"
                          : "Experiences"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          MAIN EXPLORE SECTION
      ======================================== */}

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ========================================
                FILTERS SIDEBAR
            ======================================== */}

            <aside className="bg-white rounded-2xl p-6 shadow-sm h-fit">

              {/* Filters Heading */}
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <SlidersHorizontal size={20} />
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-green-700 text-sm font-semibold flex items-center gap-1"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>

              {/* ========================================
                  LOCATION FILTER
              ======================================== */}

              <div className="mb-7">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin
                    size={17}
                    className="text-green-700"
                  />
                  Location
                </h3>

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none"
                >
                  <option value="All">
                    All Locations
                  </option>

                  {destinations.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* ========================================
                  CATEGORY FILTER
              ======================================== */}

              <div className="mb-7">
                <h3 className="font-semibold mb-3">
                  Category
                </h3>

                <div className="space-y-3">
                  {categories.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={category === item}
                        onChange={() =>
                          setCategory(item)
                        }
                        className="accent-green-700"
                      />

                      {item}
                    </label>
                  ))}

                  <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "All"}
                      onChange={() =>
                        setCategory("All")
                      }
                      className="accent-green-700"
                    />

                    All Categories
                  </label>
                </div>
              </div>

              {/* ========================================
                  PRICE FILTER
              ======================================== */}

              <div className="mb-7">
                <h3 className="font-semibold mb-3">
                  Maximum Price
                </h3>

                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Number(e.target.value))
                  }
                  className="w-full accent-green-700"
                />

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>₹0</span>

                  <span className="font-bold text-green-700">
                    ₹{maxPrice}
                  </span>
                </div>
              </div>

              {/* ========================================
                  DURATION FILTER
              ======================================== */}

              <div className="mb-7">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock
                    size={17}
                    className="text-green-700"
                  />
                  Duration
                </h3>

                <select
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none"
                >
                  <option value="All">
                    Any Duration
                  </option>

                  <option value="Short">
                    Up to 2 Hours
                  </option>

                  <option value="Medium">
                    2–3 Hours
                  </option>

                  <option value="Long">
                    More than 3 Hours
                  </option>
                </select>
              </div>

              {/* ========================================
                  RATING FILTER
              ======================================== */}

              <div>
                <h3 className="font-semibold mb-3">
                  Minimum Rating
                </h3>

                {[0, 3, 4, 4.5].map((value) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 mb-3 text-sm text-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={rating === value}
                      onChange={() =>
                        setRating(value)
                      }
                      className="accent-green-700"
                    />

                    {value === 0 ? (
                      "Any Rating"
                    ) : (
                      <span className="flex items-center gap-1">
                        {value}+

                        <Star
                          size={14}
                          className="fill-orange-400 text-orange-400"
                        />
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </aside>

            {/* ========================================
                EXPERIENCE RESULTS
            ======================================== */}

            <div
              id="experience-results"
              className="lg:col-span-3 scroll-mt-6"
            >

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {location === "All"
                      ? "Explore Experiences"
                      : `Experiences in ${location}`}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Showing {filteredExperiences.length}{" "}
                    {filteredExperiences.length === 1
                      ? "experience"
                      : "experiences"}
                  </p>
                </div>

                {/* Sorting */}
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="border border-gray-200 bg-white rounded-lg p-3 outline-none"
                >
                  <option value="recommended">
                    Recommended
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>
                </select>
              </div>

              {/* ========================================
                  ACTIVE FILTERS
              ======================================== */}

              {(search ||
                location !== "All" ||
                category !== "All" ||
                maxPrice !== 2000 ||
                duration !== "All" ||
                rating !== 0) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-gray-500">
                    Active filters:
                  </span>

                  {location !== "All" && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <MapPin size={14} />

                      {location}

                      <button
                        type="button"
                        onClick={() =>
                          setLocation("All")
                        }
                        aria-label="Remove location filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm text-green-700 font-semibold flex items-center gap-1"
                  >
                    Clear all

                    <X size={14} />
                  </button>
                </div>
              )}

              {/* ========================================
                  EXPERIENCE CARDS
              ======================================== */}

              {loading ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <p className="text-gray-600">
                    Loading experiences...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 rounded-2xl p-8 text-center">
                  {error}
                </div>
              ) : filteredExperiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredExperiences.map(
                    (experience) => (
                      <ExperienceCard
                        key={experience.id}
                        experience={experience}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <Search
                    size={45}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="text-xl font-bold mt-5">
                    No Experiences Found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Try changing your filters to discover more experiences.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 bg-green-700 text-white px-6 py-3 rounded-xl"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Explore;