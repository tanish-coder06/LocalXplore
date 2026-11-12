import { useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ExperienceCard from "../components/ExperienceCard";
import api from "../services/api";

// ========================================
// MOVE MAP TO USER LOCATION
// ========================================

function ChangeMapView({ center }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);

    return null;
}

// ========================================
// MOVE MAP TO SELECTED ATTRACTION
// ========================================

function FlyToPlace({ selectedPlace }) {
    const map = useMap();

    useEffect(() => {
        if (selectedPlace) {
            map.flyTo(
                [selectedPlace.latitude, selectedPlace.longitude],
                16,
                { duration: 1.5 }
            );
        }
    }, [selectedPlace, map]);

    return null;
}

// ========================================
// EXPLORE NEAR ME PAGE
// ========================================

function ExploreNearMe() {
    // Default map location: New Delhi
    const defaultLocation = [28.6139, 77.209];

    // User location
    const [userLocation, setUserLocation] = useState(null);

    // Location detection states
    const [locationError, setLocationError] = useState("");
    const [detecting, setDetecting] = useState(false);

    // Nearby attractions
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    const [placesError, setPlacesError] = useState("");

    // Selected attraction
    const [selectedPlace, setSelectedPlace] = useState(null);
    // Message when no experiences match the detected city
    const [nearbyExperienceMessage, setNearbyExperienceMessage] = useState("");

    // ========================================
    // LOCALXPLORE EXPERIENCES STATE
    // ========================================

    const [localExperiences, setLocalExperiences] = useState([]);
    const [loadingExperiences, setLoadingExperiences] = useState(true);
    const [experiencesError, setExperiencesError] = useState("");

    // NEW: Selected city
    const [selectedCity, setSelectedCity] = useState("All");

    // ========================================
    // FETCH ACTIVE LOCALXPLORE EXPERIENCES
    // ========================================

    useEffect(() => {
        let cancelled = false;

        const fetchLocalExperiences = async () => {
            try {
                setLoadingExperiences(true);
                setExperiencesError("");

                const response = await api.get("/experiences/active");

                if (!cancelled) {
                    setLocalExperiences(response.data.experiences || []);
                }
            } catch (error) {
                console.error("Local Experiences Error:", error);

                if (!cancelled) {
                    setExperiencesError(
                        "Unable to load LocalXplore experiences."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingExperiences(false);
                }
            }
        };

        fetchLocalExperiences();

        return () => {
            cancelled = true;
        };
    }, []);
    // ========================================
    // DETECT CITY FROM COORDINATES
    // ========================================

    const detectCityFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );

            if (!response.ok) {
                throw new Error("Unable to detect city");
            }

            const data = await response.json();

            const address = data.address || {};

            const detectedCity =
                address.city ||
                address.town ||
                address.municipality ||
                address.village ||
                address.county;

            if (!detectedCity) {
                return;
            }

            // Match detected city against available experience cities
            const matchingCity = availableCities.find(
                (city) =>
                    city.toLowerCase() === detectedCity.toLowerCase()
            );

            if (matchingCity) {
                setSelectedCity(matchingCity);
                setNearbyExperienceMessage("");
            } else {
                setSelectedCity("All");

                setNearbyExperienceMessage(
                    `We couldn't find LocalXplore experiences in ${detectedCity} yet. Showing experiences from all available cities instead.`
                );
            }
        } catch (error) {
            console.error("City Detection Error:", error);
        }
    };

    // ========================================
    // DETECT USER LOCATION
    // ========================================

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError(
                "Your browser does not support location detection."
            );
            return;
        }

        setDetecting(true);
        setLocationError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Store user coordinates
                setUserLocation([latitude, longitude]);

                // Clear previously selected attraction
                setSelectedPlace(null);

                setDetecting(false);

                // Fetch nearby attractions
                fetchNearbyPlaces(latitude, longitude);
                // Automatically detect and select the tourist's city
                detectCityFromCoordinates(latitude, longitude);
            },

            (error) => {
                setDetecting(false);

                if (error.code === 1) {
                    setLocationError(
                        "Location permission was denied."
                    );
                } else {
                    setLocationError(
                        "Unable to detect your location. Please try again."
                    );
                }
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    // ========================================
    // FETCH NEARBY ATTRACTIONS
    // ========================================

    const fetchNearbyPlaces = async (latitude, longitude) => {
        setLoadingPlaces(true);
        setPlacesError("");
        setNearbyPlaces([]);

        try {
            // Search attractions within 5 km
            const query = `
        [out:json][timeout:25];
        (
          nwr["tourism"="attraction"](around:5000,${latitude},${longitude});
          nwr["tourism"="museum"](around:5000,${latitude},${longitude});
          nwr["historic"="monument"](around:5000,${latitude},${longitude});
        );
        out center;
      `;

            const response = await fetch(
                "https://overpass-api.de/api/interpreter",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },

                    body: new URLSearchParams({
                        data: query,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch nearby attractions.");
            }

            const data = await response.json();

            // Convert OpenStreetMap results
            const places = (data.elements || [])
                .filter((place) => place.tags?.name)
                .map((place) => ({
                    id: `${place.type}-${place.id}`,

                    name: place.tags.name,

                    type:
                        place.tags.tourism ||
                        place.tags.historic ||
                        "Attraction",

                    latitude: place.lat ?? place.center?.lat,

                    longitude: place.lon ?? place.center?.lon,
                }))
                .filter(
                    (place) =>
                        Number.isFinite(place.latitude) &&
                        Number.isFinite(place.longitude)
                );

            setNearbyPlaces(places);
        } catch (error) {
            console.error("Nearby Places Error:", error);

            setPlacesError(
                "Unable to load nearby attractions. Please try again."
            );
        } finally {
            setLoadingPlaces(false);
        }
    };

    // ========================================
    // HANDLE VIEW ON MAP
    // ========================================

    const handleViewOnMap = (place) => {
        // Save selected attraction
        setSelectedPlace({ ...place });

        // Scroll to the map
        document
            .getElementById("nearby-map")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
    };

    // ========================================
    // NEW: GET AVAILABLE CITIES
    // ========================================

    // Extract unique cities from active experiences
    const availableCities = [
        ...new Set(
            localExperiences
                .map((experience) => experience.city?.trim())
                .filter(Boolean)
        ),
    ].sort((a, b) => a.localeCompare(b));

    // ========================================
    // NEW: FILTER EXPERIENCES BY CITY
    // ========================================

    const filteredExperiences =
        selectedCity === "All"
            ? localExperiences
            : localExperiences.filter(
                (experience) =>
                    experience.city?.trim().toLowerCase() ===
                    selectedCity.toLowerCase()
            );

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
                        Explore Near Me
                    </h1>

                    <p className="text-gray-600 mt-4 max-w-2xl">
                        Discover interesting places, hidden gems, and local
                        experiences around you.
                    </p>
                </div>
            </section>

            {/* ========================================
          MAP SECTION
      ======================================== */}

            <section className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        {/* ========================================
                SECTION HEADING
            ======================================== */}

                        <div className="flex items-center gap-2 mb-5">
                            <MapPin className="text-green-700" />

                            <h2 className="text-2xl font-bold text-gray-900">
                                Discover Nearby Places
                            </h2>
                        </div>

                        <p className="text-gray-500 mb-6">
                            Explore the map to discover places around your destination.
                        </p>

                        {/* ========================================
                USE MY LOCATION BUTTON
            ======================================== */}

                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={detectLocation}
                                disabled={detecting}
                                className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-60 transition"
                            >
                                {detecting
                                    ? "Detecting Location..."
                                    : "📍 Use My Location"}
                            </button>

                            <p className="text-gray-500 text-xs mt-3">
                                Location sharing is optional. If you use this
                                feature, your coordinates are sent to the public
                                OpenStreetMap Overpass service to search for nearby
                                attractions.
                            </p>

                            {locationError && (
                                <p className="text-red-600 text-sm mt-3">
                                    {locationError}
                                </p>
                            )}
                        </div>

                        {/* ========================================
                ATTRACTION STATUS MESSAGES
            ======================================== */}

                        {loadingPlaces && (
                            <div className="bg-green-50 text-green-700 rounded-xl p-4 mb-6">
                                🔍 Searching for nearby attractions...
                            </div>
                        )}

                        {placesError && (
                            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6">
                                {placesError}
                            </div>
                        )}

                        {!loadingPlaces &&
                            !placesError &&
                            userLocation &&
                            nearbyPlaces.length > 0 && (
                                <div className="bg-green-50 text-green-700 rounded-xl p-4 mb-6 font-medium">
                                    ✅ Found {nearbyPlaces.length} nearby attractions!
                                </div>
                            )}

                        {!loadingPlaces &&
                            !placesError &&
                            userLocation &&
                            nearbyPlaces.length === 0 && (
                                <div className="bg-gray-50 text-gray-500 rounded-xl p-4 mb-6">
                                    No nearby attractions found within 5 km.
                                </div>
                            )}

                        {/* ========================================
                INTERACTIVE MAP
            ======================================== */}

                        <div
                            id="nearby-map"
                            className="h-[500px] w-full rounded-xl overflow-hidden scroll-mt-24"
                        >
                            <MapContainer
                                center={defaultLocation}
                                zoom={12}
                                scrollWheelZoom={true}
                                className="h-full w-full"
                            >
                                {/* OpenStreetMap Tiles */}
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Move Map to User Location */}
                                {userLocation && (
                                    <ChangeMapView center={userLocation} />
                                )}

                                {/* Move Map to Selected Attraction */}
                                <FlyToPlace selectedPlace={selectedPlace} />

                                {/* User Location Marker */}
                                {userLocation && (
                                    <Marker position={userLocation}>
                                        <Popup>
                                            <strong>Your Approximate Location</strong>
                                        </Popup>
                                    </Marker>
                                )}

                                {/* Default New Delhi Marker */}
                                <Marker position={defaultLocation}>
                                    <Popup>
                                        <strong>New Delhi</strong>
                                        <br />
                                        Explore local experiences here!
                                    </Popup>
                                </Marker>

                                {/* ========================================
                    NEARBY ATTRACTION MARKERS
                ======================================== */}

                                {nearbyPlaces.map((place) => (
                                    <Marker
                                        key={place.id}
                                        position={[
                                            place.latitude,
                                            place.longitude,
                                        ]}
                                    >
                                        <Popup>
                                            <div>
                                                <h3 className="font-bold text-base">
                                                    {place.name}
                                                </h3>

                                                <p className="text-gray-600 mt-1 capitalize">
                                                    Type: {place.type}
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* ========================================
                NEARBY ATTRACTIONS LIST
            ======================================== */}

                        {!loadingPlaces && nearbyPlaces.length > 0 && (
                            <div className="mt-10">
                                {/* List Heading */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Nearby Attractions
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        Discover interesting places within 5 km
                                        of your location.
                                    </p>
                                </div>

                                {/* Attraction Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {nearbyPlaces.map((place) => (
                                        <div
                                            key={place.id}
                                            className={`bg-white border rounded-xl p-5 transition hover:shadow-md ${selectedPlace?.id === place.id
                                                    ? "border-green-600 shadow-md"
                                                    : "border-gray-200"
                                                }`}
                                        >
                                            {/* Attraction Details */}
                                            <div className="flex items-start gap-3">
                                                {/* Location Icon */}
                                                <div className="bg-green-100 p-3 rounded-lg shrink-0">
                                                    <MapPin
                                                        size={22}
                                                        className="text-green-700"
                                                    />
                                                </div>

                                                {/* Name and Type */}
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        {place.name}
                                                    </h3>

                                                    <p className="text-gray-500 text-sm mt-1 capitalize">
                                                        {place.type}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* View on Map Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleViewOnMap(place)}
                                                className="mt-5 w-full bg-green-700 text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition"
                                            >
                                                View on Map
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ========================================
                LOCALXPLORE EXPERIENCES
            ======================================== */}

                        <div className="mt-12 border-t border-gray-200 pt-10">

                            {/* Section Heading */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Discover LocalXplore Experiences
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Explore guided tours and activities created
                                    by local guides.
                                </p>
                            </div>

                            {/* Nearby Experience Information */}
                            {nearbyExperienceMessage && (
                                <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4">
                                    <p className="text-sm">
                                        📍 {nearbyExperienceMessage}
                                    </p>
                                </div>
                            )}
                            {/* ========================================
                  NEW: CITY FILTER
              ======================================== */}

                            <div className="mb-6">
                                <label
                                    htmlFor="experience-city"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Filter Experiences by City
                                </label>

                                <select
                                    id="experience-city"
                                    value={selectedCity}
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                        setNearbyExperienceMessage("");
                                    }}
                                    className="w-full sm:w-72 border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="All">All Cities</option>

                                    {availableCities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ========================================
                  EXPERIENCE RESULTS
              ======================================== */}

                            {loadingExperiences ? (
                                <div className="bg-gray-50 rounded-xl p-10 text-center">
                                    <p className="text-gray-500">
                                        Loading LocalXplore experiences...
                                    </p>
                                </div>
                            ) : experiencesError ? (
                                <div className="bg-red-50 text-red-600 rounded-xl p-6 text-center">
                                    {experiencesError}
                                </div>
                            ) : filteredExperiences.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredExperiences.map((experience) => (
                                        <ExperienceCard
                                            key={experience.id}
                                            experience={experience}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-10 text-center">
                                    <p className="text-gray-500">
                                        {selectedCity === "All"
                                            ? "No LocalXplore experiences are available yet."
                                            : `No experiences found in ${selectedCity}.`}
                                    </p>
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

export default ExploreNearMe;