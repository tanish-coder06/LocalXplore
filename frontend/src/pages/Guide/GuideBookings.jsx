import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  TicketCheck,
  Mail,
} from "lucide-react";

import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function GuideBookings() {
  // State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  // Get authentication token
  const getToken = () => localStorage.getItem("token");

  // Format price
  const formatPrice = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  // Format booking date
  const formatDate = (date) => {
    if (!date) return "Not available";

    const datePart = String(date).slice(0, 10);

    return new Date(`${datePart}T12:00:00Z`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }
    );
  };

  // Fetch guide bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/guide/bookings", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Fetch Guide Bookings Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Confirm or reject booking
  const handleBookingAction = async (bookingId, action) => {
    const actionText =
      action === "confirm" ? "confirm" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} this booking?`
    );

    if (!confirmed) return;

    setProcessingId(bookingId);
    setError("");
    setSuccess("");

    try {
      await api.patch(
        `/guide/bookings/${bookingId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Update booking status locally
      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status:
                  action === "confirm"
                    ? "confirmed"
                    : "cancelled",
              }
            : booking
        )
      );

      setSuccess(
        action === "confirm"
          ? "Booking confirmed successfully!"
          : "Booking request rejected successfully."
      );
    } catch (err) {
      console.error("Guide Booking Action Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  // Booking statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  // Status badge colors
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">

        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 py-10">

          {/* Back Navigation */}
          <Link
            to="/guide/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          {/* Page Heading */}
          <div className="mt-8 mb-10">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Manage Bookings
            </h1>

            <p className="text-gray-500 mt-3">
              View and manage tourist bookings for your experiences.
            </p>

          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <TicketCheck className="text-green-700" size={25} />
                <p className="text-gray-500">Total Bookings</p>
              </div>

              <h2 className="text-3xl font-bold mt-4">
                {totalBookings}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-600" size={25} />
                <p className="text-gray-500">Pending</p>
              </div>

              <h2 className="text-3xl font-bold mt-4">
                {pendingBookings}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-700" size={25} />
                <p className="text-gray-500">Confirmed</p>
              </div>

              <h2 className="text-3xl font-bold mt-4">
                {confirmedBookings}
              </h2>
            </div>

            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-600" size={25} />
                <p className="text-gray-500">Cancelled</p>
              </div>

              <h2 className="text-3xl font-bold mt-4">
                {cancelledBookings}
              </h2>
            </div>

          </div>

          {/* Filter */}
          <div className="bg-white border rounded-2xl p-5 mb-8">

            <div className="flex flex-wrap items-center gap-3">

              <span className="font-semibold text-gray-700 mr-2">
                Filter Bookings:
              </span>

              {["all", "pending", "confirmed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status)}
                    className={`px-5 py-2 rounded-xl font-medium capitalize transition ${
                      filter === status
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}

            </div>

          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="bg-white border rounded-2xl p-12 text-center">
              <p className="text-gray-500">
                Loading bookings...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white border rounded-3xl p-12 text-center">

              <TicketCheck
                size={48}
                className="text-green-700 mx-auto"
              />

              <h2 className="text-2xl font-bold mt-5">
                No Bookings Found
              </h2>

              <p className="text-gray-500 mt-3">
                {filter === "all"
                  ? "Bookings for your experiences will appear here."
                  : `No ${filter} bookings are available.`}
              </p>

            </div>
          ) : (
            <div className="space-y-6">

              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border rounded-3xl shadow-sm overflow-hidden"
                >

                  <div className="flex flex-col lg:flex-row">

                    {/* Experience Image */}
                    <div className="lg:w-64 shrink-0">

                      {booking.image ? (
                        <img
                          src={booking.image}
                          alt={booking.experience_title}
                          className="w-full h-56 lg:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 lg:h-full min-h-48 bg-green-50 flex items-center justify-center">
                          <TicketCheck
                            size={45}
                            className="text-green-700"
                          />
                        </div>
                      )}

                    </div>

                    {/* Booking Information */}
                    <div className="flex-1 p-6 md:p-8">

                      <div className="flex flex-wrap justify-between gap-4">

                        <div>
                          <p className="text-sm text-gray-500">
                            Booking #{booking.id}
                          </p>

                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                            {booking.experience_title}
                          </h2>
                        </div>

                        <span
                          className={`h-fit px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                            statusStyles[booking.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.status}
                        </span>

                      </div>

                      {/* Tourist Information */}
                      <div className="bg-gray-50 rounded-xl p-4 mt-5">

                        <p className="font-semibold text-gray-800 mb-3">
                          Tourist Details
                        </p>

                        <div className="flex flex-wrap gap-5">

                          <div className="flex items-center gap-2 text-gray-600">
                            <Users size={18} className="text-green-700" />
                            {booking.tourist_name}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={18} className="text-green-700" />
                            {booking.tourist_email}
                          </div>

                        </div>

                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-600">

                        <div className="flex items-center gap-2">
                          <CalendarDays size={19} className="text-green-700" />
                          {formatDate(booking.booking_date)}
                        </div>

                        <div className="flex items-center gap-2">
                          <Users size={19} className="text-green-700" />
                          {booking.participants}{" "}
                          {booking.participants === 1
                            ? "Participant"
                            : "Participants"}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={19} className="text-green-700" />
                          {booking.city || booking.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <IndianRupee size={19} className="text-green-700" />
                          ₹{formatPrice(booking.total_price)}
                        </div>

                      </div>

                      {/* Action Buttons */}
                      <div className="border-t mt-6 pt-5 flex flex-wrap justify-between items-center gap-4">

                        <Link
                          to={`/experience/${booking.experience_id}`}
                          className="px-5 py-3 rounded-xl border border-green-700 text-green-700 font-semibold hover:bg-green-50"
                        >
                          View Experience
                        </Link>

                        {booking.status === "pending" && (
                          <div className="flex flex-wrap gap-3">

                            <button
                              type="button"
                              disabled={processingId !== null}
                              onClick={() =>
                                handleBookingAction(booking.id, "confirm")
                              }
                              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold disabled:opacity-50"
                            >
                              <CheckCircle size={18} />
                              {processingId === booking.id
                                ? "Processing..."
                                : "Confirm"}
                            </button>

                            <button
                              type="button"
                              disabled={processingId !== null}
                              onClick={() =>
                                handleBookingAction(booking.id, "reject")
                              }
                              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold disabled:opacity-50"
                            >
                              <XCircle size={18} />
                              {processingId === booking.id
                                ? "Processing..."
                                : "Reject"}
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default GuideBookings;