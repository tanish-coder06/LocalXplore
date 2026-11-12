import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../services/api";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/reviews/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReviews(response.data.reviews || []);
      } catch (err) {
        console.error("My Reviews Error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load your reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/tourist/dashboard"
            className="inline-flex items-center gap-2 text-green-700 font-medium mb-8"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <MessageSquare size={30} className="text-green-700" />

            <h1 className="text-3xl font-bold text-gray-900">
              My Reviews
            </h1>
          </div>

          <p className="text-gray-500 mb-10">
            All the reviews you've shared about your experiences.
          </p>

          {loading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : reviews.length === 0 ? (
            <div className="bg-white border rounded-2xl p-12 text-center">
              <MessageSquare
                size={48}
                className="mx-auto text-gray-300 mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">
                No reviews yet
              </h2>

              <p className="text-gray-500 mb-6">
                Reviews you submit will appear here.
              </p>

              <Link
                to="/explore"
                className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                Explore Experiences
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img
                      src={review.image}
                      alt={review.experience_title}
                      className="w-full sm:w-40 h-32 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">
                        {review.experience_title}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {review.city}
                      </p>

                      <div className="flex items-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <p className="text-gray-600 mt-4">
                        {review.comment}
                      </p>

                      <p className="text-sm text-gray-400 mt-3">
                        Reviewed on{" "}
                        {new Date(
                          review.created_at
                        ).toLocaleDateString("en-IN")}
                      </p>

                      <Link
                        to={`/experience/${review.experience_id}`}
                        className="inline-block text-green-700 font-semibold mt-4 hover:underline"
                      >
                        View Experience →
                      </Link>
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

export default MyReviews;