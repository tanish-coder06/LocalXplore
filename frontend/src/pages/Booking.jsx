import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

import {
  MapPin,
  CalendarDays,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Store experience details fetched from MySQL
  const [experience, setExperience] = useState(null);

  // Track experience loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking form state
  const [bookingDate, setBookingDate] = useState("");
  const [participants, setParticipants] = useState(1);

  // Booking submission state
  const [confirmed, setConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch active experience details from backend
  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      setError("");
      setExperience(null);

      try {
        const response = await api.get(
          `/experiences/active/${id}`
        );

        setExperience(response.data.experience);
      } catch (err) {
        console.error("Fetch Booking Experience Error:", err);

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

  // Display loading screen
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <p className="text-gray-600 text-lg">
            Loading booking details...
          </p>
        </div>

        <Footer />
      </>
    );
  }

  // Display error if experience is unavailable
  if (!experience) {
    return (
      <>
        <Navbar />

        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Experience Not Found
          </h2>

          <p className="text-gray-500 mt-3 text-center">
            {error || "Sorry, this experience is unavailable."}
          </p>

          <Link
            to="/explore"
            className="mt-6 bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Explore Experiences
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  // Calculate total booking price
  const totalPrice = Number(experience.price) * participants;

  // Format prices in Indian Rupees
  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  // Get today's date in India
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  // Submit booking to backend
  const handleBooking = async (event) => {
    event.preventDefault();

    if (submitting) return;

    // Validate booking date
    if (!bookingDate) {
      setError("Please select your preferred booking date.");
      return;
    }

    if (bookingDate < today) {
      setError("Booking date cannot be in the past.");
      return;
    }

    // Check authentication
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in as a tourist to book an experience.");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Create booking in MySQL
      const response = await api.post(
        "/bookings",
        {
          experience_id: Number(id),
          booking_date: bookingDate,
          participants: Number(participants),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store booking response
      setBookingResult(response.data.booking);

      // Show successful booking screen
      setConfirmed(true);
    } catch (err) {
      console.error("Create Booking Error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to submit booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Booking success screen
  if (confirmed && bookingResult) {
    return (
      <>
        <Navbar />

        <div className="min-h-[75vh] flex items-center justify-center px-6 py-12 bg-gray-50">
          <div className="bg-white max-w-lg w-full p-8 md:p-10 rounded-3xl shadow-lg text-center">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle
                size={45}
                className="text-green-700"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mt-6">
              Booking Request Submitted!
            </h1>

            <p className="text-gray-500 mt-3">
              Your booking request has been saved successfully
              and is awaiting confirmation.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 mt-7 text-left space-y-3">

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Booking ID
                </span>

                <span className="font-semibold">
                  #{bookingResult.id}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Experience
                </span>

                <span className="font-semibold text-right">
                  {experience.title}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Date
                </span>

                <span className="font-semibold">
                  {bookingResult.booking_date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Participants
                </span>

                <span className="font-semibold">
                  {bookingResult.participants}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Status
                </span>

                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {bookingResult.status}
                </span>
              </div>

              <hr />

              <div className="flex justify-between">
                <span className="font-semibold">
                  Total Amount
                </span>

                <span className="font-bold text-green-700 text-xl">
                  ₹{formatPrice(bookingResult.total_price)}
                </span>
              </div>

            </div>

            <p className="text-xs text-gray-400 mt-5">
              Your booking is pending confirmation.
              No payment has been processed.
            </p>

            <Link
              to="/explore"
              className="block w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold mt-7 transition"
            >
              Explore More Experiences
            </Link>

          </div>
        </div>

        <Footer />
      </>
    );
  }

  // Main booking page
  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">

        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Back Navigation */}
          <Link
            to={`/experience/${experience.id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 mb-8"
          >
            <ArrowLeft size={18} />
            Back to Experience
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Complete Your Booking
          </h1>

          <p className="text-gray-500 mt-3">
            Choose your date and participants to reserve your experience.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

            {/* Booking Form */}
            <div className="lg:col-span-2">

              <form
                onSubmit={handleBooking}
                className="bg-white rounded-3xl shadow-sm border p-6 md:p-8"
              >

                <h2 className="text-xl font-bold text-gray-900 mb-7">
                  Booking Information
                </h2>

                {/* Date Selection */}
                <div className="mb-7">

                  <label
                    htmlFor="bookingDate"
                    className="flex items-center gap-2 font-semibold text-gray-800 mb-3"
                  >
                    <CalendarDays
                      className="text-green-700"
                      size={20}
                    />
                    Select Booking Date
                  </label>

                  <input
                    id="bookingDate"
                    type="date"
                    required
                    min={today}
                    value={bookingDate}
                    onChange={(event) =>
                      setBookingDate(event.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-green-600"
                  />

                </div>

                {/* Participants */}
                <div className="mb-7">

                  <label
                    htmlFor="participants"
                    className="flex items-center gap-2 font-semibold text-gray-800 mb-3"
                  >
                    <Users
                      className="text-green-700"
                      size={20}
                    />
                    Number of Participants
                  </label>

                  <select
                    id="participants"
                    value={participants}
                    onChange={(event) =>
                      setParticipants(Number(event.target.value))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-green-600"
                  >
                    {Array.from(
                      { length: 10 },
                      (_, index) => index + 1
                    ).map((number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Price Information */}
                <div className="bg-green-50 rounded-2xl p-5">

                  <h3 className="font-semibold text-gray-900 mb-4">
                    Price Breakdown
                  </h3>

                  <div className="flex justify-between text-gray-600 mb-3">
                    <span>
                      ₹{formatPrice(experience.price)} × {participants}{" "}
                      {participants === 1 ? "participant" : "participants"}
                    </span>

                    <span>
                      ₹{formatPrice(totalPrice)}
                    </span>
                  </div>

                  <hr className="border-green-200" />

                  <div className="flex justify-between mt-4">
                    <span className="font-bold text-gray-900">
                      Total Amount
                    </span>

                    <span className="text-2xl font-bold text-green-800">
                      ₹{formatPrice(totalPrice)}
                    </span>
                  </div>

                </div>

                {/* Submission Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-6">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <CheckCircle size={20} />

                  {submitting
                    ? "Submitting Booking..."
                    : "Confirm Booking"}
                </button>

              </form>
            </div>

            {/* Booking Summary */}
            <div>

              <div className="bg-white rounded-3xl shadow-sm border overflow-hidden sticky top-28">

                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-6">

                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {experience.category}
                  </span>

                  <h2 className="text-xl font-bold text-gray-900 mt-4">
                    {experience.title}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-500 mt-4">
                    <MapPin
                      size={18}
                      className="text-green-700"
                    />
                    <span>{experience.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mt-3">
                    <Clock
                      size={18}
                      className="text-green-700"
                    />
                    <span>{experience.duration}</span>
                  </div>

                  <hr className="my-5" />

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Price per person
                    </span>

                    <span className="font-semibold">
                      ₹{formatPrice(experience.price)}
                    </span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <span className="text-gray-500">
                      Participants
                    </span>

                    <span className="font-semibold">
                      {participants}
                    </span>
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-xl font-bold text-green-700">
                      ₹{formatPrice(totalPrice)}
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Booking;