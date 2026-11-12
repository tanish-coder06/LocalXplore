import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  TicketCheck,
  XCircle,
} from "lucide-react";

import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "Not available";

    // MySQL dates may arrive as ISO timestamps.
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

  const getToken = () => localStorage.getItem("token");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/bookings/my", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Fetch Bookings Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingId(bookingId);
    setError("");

    try {
      await api.patch(
        `/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
    } catch (err) {
      console.error("Cancel Booking Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10">
          <Link
            to="/tourist/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="mt-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Bookings
            </h1>

            <p className="text-gray-500 mt-3">
              View your reservations and manage upcoming experiences.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border">
              <p className="text-gray-500">
                Loading your bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl border p-12 text-center">
              <TicketCheck
                size={48}
                className="text-green-700 mx-auto"
              />

              <h2 className="text-2xl font-bold mt-5">
                No Bookings Yet
              </h2>

              <p className="text-gray-500 mt-3">
                Your booked experiences will appear here.
              </p>

              <Link
                to="/explore"
                className="inline-block mt-7 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold"
              >
                Explore Experiences
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border rounded-3xl shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 shrink-0">
                      {booking.image ? (
                        <img
                          src={booking.image}
                          alt={booking.experience_title}
                          className="w-full h-56 md:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 md:h-full min-h-48 bg-green-50 flex items-center justify-center">
                          <TicketCheck
                            size={48}
                            className="text-green-700"
                          />
                        </div>
                      )}
                    </div>

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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={19}
                            className="text-green-700"
                          />
                          {formatDate(booking.booking_date)}
                        </div>

                        <div className="flex items-center gap-2">
                          <Users
                            size={19}
                            className="text-green-700"
                          />
                          {booking.participants}{" "}
                          {booking.participants === 1
                            ? "Participant"
                            : "Participants"}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin
                            size={19}
                            className="text-green-700"
                          />
                          {booking.city || booking.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock
                            size={19}
                            className="text-green-700"
                          />
                          {booking.duration || "Duration unavailable"}
                        </div>
                      </div>

                      <div className="border-t mt-6 pt-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Total Amount
                          </p>

                          <p className="text-2xl font-bold text-green-800">
                            ₹{formatPrice(booking.total_price)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={`/experience/${booking.experience_id}`}
                            className="px-5 py-3 rounded-xl border border-green-700 text-green-700 font-semibold hover:bg-green-50"
                          >
                            View Experience
                          </Link>

                          {booking.status === "pending" && (
                            <button
                              type="button"
                              disabled={cancellingId === booking.id}
                              onClick={() => handleCancel(booking.id)}
                              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-50 text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50"
                            >
                              <XCircle size={18} />
                              {cancellingId === booking.id
                                ? "Cancelling..."
                                : "Cancel Booking"}
                            </button>
                          )}
                        </div>
                      </div>
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

export default MyBookings;