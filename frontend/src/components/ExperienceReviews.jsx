import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import api from "../services/api";

function ExperienceReviews({ experienceId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isTourist = Boolean(token && user?.role === "tourist");

  // Fetch all reviews for this experience
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/reviews/experience/${experienceId}`
      );

      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Fetch Reviews Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [experienceId]);

  // Submit a review
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    if (comment.trim().length < 5) {
      setError("Please write at least 5 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        "/reviews",
        {
          experience_id: Number(experienceId),
          rating,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Your review was submitted successfully!");
      setRating(0);
      setComment("");

      await fetchReviews();
    } catch (err) {
      console.error("Submit Review Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 bg-white border rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-green-700" size={28} />

        <h2 className="text-2xl font-bold text-gray-900">
          Reviews & Ratings
        </h2>
      </div>

      {/* Review List */}
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.tourist_name}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(review.created_at).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      {isTourist && (
        <div className="mt-10 border-t pt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Write a Review
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Reviews are available after your confirmed booking date.
            You can review each experience once.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Star Selection */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} stars`}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={30}
                    className={
                      star <= (hoverRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Share your experience..."
              className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-600 resize-none"
              required
            />

            {error && (
              <p className="text-red-600 text-sm mt-3">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-700 text-sm mt-3">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 bg-green-700 hover:bg-green-800 text-white px-7 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {!isTourist && (
        <p className="text-sm text-gray-500 mt-8 border-t pt-6">
          Log in as a tourist to submit a review.
        </p>
      )}
    </section>
  );
}

export default ExperienceReviews;