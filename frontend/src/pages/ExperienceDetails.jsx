import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    MapPin,
    Clock,
    Star,
    Users,
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    CreditCard,
    Heart,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ExperienceReviews from "../components/ExperienceReviews";

function ExperienceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [favoriteError, setFavoriteError] = useState("");

    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExperience = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(`/experiences/active/${id}`);
                setExperience(response.data.experience);
            } catch (err) {
                console.error("Experience Details Error:", err);
                setExperience(null);
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
    useEffect(() => {
        const checkFavorite = async () => {
            const token = localStorage.getItem("token");

            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );

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

                const saved = response.data.favorites.some(
                    (item) => String(item.id) === String(id)
                );

                setIsFavorite(saved);
            } catch (error) {
                console.error("Check Favorite Error:", error);
                setFavoriteError("Unable to check favorites.");
            }
        };

        checkFavorite();
    }, [id]);
    const handleFavorite = async () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!token) {
            alert("Please log in as a tourist to save experiences.");
            navigate("/login");
            return;
        }

        if (user?.role !== "tourist") {
            setFavoriteError("Only tourists can save favorites.");
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
                await api.delete(`/favorites/${id}`, config);
                setIsFavorite(false);
            } else {
                await api.post(`/favorites/${id}`, {}, config);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Favorite Error:", error);

            setFavoriteError(
                error.response?.data?.message ||
                "Failed to update favorites."
            );
        } finally {
            setFavoriteLoading(false);
        }
    };
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-[60vh] flex items-center justify-center">
                    <p className="text-gray-600 text-lg">
                        Loading experience details...
                    </p>
                </div>
                <Footer />
            </>
        );
    }

    if (!experience) {
        return (
            <>
                <Navbar />
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Experience Not Found
                    </h2>

                    <p className="text-gray-500 mt-3">
                        {error || "Sorry, this experience does not exist."}
                    </p>

                    <Link
                        to="/explore"
                        className="mt-6 bg-green-700 text-white px-6 py-3 rounded-full"
                    >
                        Back to Explore
                    </Link>
                </div>
                <Footer />
            </>
        );
    }
    return (
        <>
            <Navbar />

            <div className="bg-gray-50 min-h-screen">

                {/* Back Navigation */}
                <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-8">
                    <Link
                        to="/explore"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Explore
                    </Link>
                </div>

                {/* Main Content */}
                <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-8">

                    {/* Experience Image */}
                    <div className="h-[300px] md:h-[480px] rounded-3xl overflow-hidden">
                        <img
                            src={experience.image}
                            alt={experience.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">

                        {/* Left Section */}
                        <div className="lg:col-span-2">

                            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                                {experience.category}
                            </span>

                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-5">
                                {experience.title}
                            </h1>

                            {/* Location and Rating */}
                            <div className="flex flex-wrap gap-5 mt-5 text-gray-600">

                                <div className="flex items-center gap-2">
                                    <MapPin size={19} className="text-green-700" />
                                    {experience.location}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Star
                                        size={19}
                                        className="text-yellow-500 fill-yellow-500"
                                    />
                                    <span className="font-semibold text-gray-800">
                                        {Number(experience.rating || 0).toFixed(1)}
                                    </span>
                                </div>

                            </div>

                            {/* Description */}
                            <div className="mt-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    About This Experience
                                </h2>

                                <p className="text-gray-600 leading-8 mt-4">
                                    {experience.description ||
                                        `Discover ${experience.title} and explore the local culture, hidden places and unique experiences with a local host. Enjoy an engaging experience and discover something new.`}
                                </p>
                            </div>

                            {/* Experience Information */}
                            <div className="mt-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Experience Highlights
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">

                                    <div className="bg-white p-5 rounded-2xl border flex items-center gap-4">
                                        <Clock className="text-green-700" size={27} />
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-semibold text-gray-800">
                                                {experience.duration}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border flex items-center gap-4">
                                        <MapPin className="text-green-700" size={27} />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-semibold text-gray-800">
                                                {experience.city || experience.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border flex items-center gap-4">
                                        <Users className="text-green-700" size={27} />
                                        <div>
                                            <p className="text-sm text-gray-500">Experience Type</p>
                                            <p className="font-semibold text-gray-800">
                                                Local Guided Experience
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border flex items-center gap-4">
                                        <CheckCircle className="text-green-700" size={27} />
                                        <div>
                                            <p className="text-sm text-gray-500">Booking</p>
                                            <p className="font-semibold text-gray-800">
                                                Easy Booking
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* Right Booking Card */}
                        <div>
                            <div className="bg-white rounded-3xl shadow-lg border p-7 sticky top-28">

                                <p className="text-gray-500">
                                    Starting from
                                </p>

                                <h2 className="text-4xl font-bold text-green-800 mt-2">
                                    ₹{Number(experience.price).toLocaleString("en-IN")}
                                    <span className="text-base text-gray-500 font-normal">
                                        {" "} / person
                                    </span>
                                </h2>

                                <hr className="my-6" />

                                <div className="space-y-5">

                                    <div className="flex items-center gap-3 text-gray-600">
                                        <CalendarDays className="text-green-700" />
                                        <span>Choose your preferred date</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="text-green-700" />
                                        <span>{experience.duration}</span>
                                    </div>

                                </div>
                                <button
                                    type="button"
                                    onClick={handleFavorite}
                                    disabled={favoriteLoading}
                                    className={`w-full mt-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition disabled:opacity-50 ${isFavorite
                                        ? "border-red-500 bg-red-50 text-red-600"
                                        : "border-green-700 text-green-700 hover:bg-green-50"
                                        }`}
                                >
                                    <Heart
                                        size={20}
                                        className={isFavorite ? "fill-red-500" : ""}
                                    />

                                    {favoriteLoading
                                        ? "Updating..."
                                        : isFavorite
                                            ? "Remove from Favorites"
                                            : "Add to Favorites"}
                                </button>

                                {favoriteError && (
                                    <p className="text-red-600 text-sm mt-3 text-center">
                                        {favoriteError}
                                    </p>
                                )}

                                <Link
                                    to={`/booking/${experience.id}`}
                                    className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                                >
                                    <CreditCard size={20} />
                                    Book This Experience
                                </Link>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Select your preferred date and participants on the next page.
                                </p>

                            </div>
                        </div>

                    </div>
                    {/* Reviews & Ratings */}
                    <ExperienceReviews experienceId={experience.id} />
                </div>
            </div>

            <Footer />
        </>
    );
}

export default ExperienceDetails;