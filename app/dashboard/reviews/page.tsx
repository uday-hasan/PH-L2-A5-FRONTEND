/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/fetcher";
import type { Event } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { toast } from "react-toastify";

interface Review {
  id: string;
  event: Event;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    eventId: "",
    rating: 5,
    comment: "",
  });
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    fetchReviews();
    fetchAvailableEvents();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get<Review[]>("/reviews/my");
      setReviews(response);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEvents = async () => {
    try {
      // Get user's approved participations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const participations = await api.get<any[]>("/participations/my");

      // Filter to approved past events
      const now = new Date();
      const pastApprovedEvents = participations
        .filter((p) => p.status === "APPROVED" && new Date(p.event.date) < now)
        .map((p) => p.event)
        .filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id),
        ); // Remove duplicates

      setAvailableEvents(pastApprovedEvents);
    } catch (err) {
      console.error("Failed to fetch available events for review:", err);
      setAvailableEvents([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingReview) {
        await api.patch(`/reviews/${editingReview.id}`, formData);
        toast.success("Review updated successfully!");
      } else {
        await api.post(`/reviews/${formData.eventId}`, formData);
        toast.success("Review created successfully!");
      }

      setFormData({ eventId: "", rating: 5, comment: "" });
      setEditingReview(null);
      setShowCreateForm(false);
      await fetchReviews();
    } catch (err) {
      toast.error((err as Error).message || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      eventId: review.event.id,
      rating: review.rating,
      comment: review.comment,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted successfully!");
      await fetchReviews();
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete review");
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingReview(null);
    setFormData({ eventId: "", rating: 5, comment: "" });
  };

  const canEditReview = (review: Review) => {
    const createdAt = new Date(review.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 48;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-gray-400 mt-1">Manage your event reviews</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            + Write Review
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingReview ? "Edit Review" : "Write New Review"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingReview && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event *
                </label>
                <select
                  value={formData.eventId}
                  onChange={(e) =>
                    setFormData({ ...formData, eventId: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an event...</option>
                  {availableEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({formatDate(event.date)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-3">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-4xl transition-colors ${
                      star <= formData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Your Review (Comment) *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                required
                placeholder="Share your thoughts about this event..."
                rows={5}
                minLength={10}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.comment.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingReview
                    ? "Update Review"
                    : "Post Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">No reviews yet</p>
          <Button onClick={() => setShowCreateForm(true)}>
            Write Your First Review
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold">{review.event.title}</h3>
                  <p className="text-sm text-gray-400">
                    {formatDate(review.createdAt)}
                    {review.createdAt !== review.updatedAt && " (edited)"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-yellow-400 mb-1">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="text-sm text-gray-400">{review.rating} / 5</p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{review.comment}</p>

              <div className="flex gap-2">
                {canEditReview(review) && (
                  <>
                    <Button
                      onClick={() => handleEdit(review)}
                      variant="outline"
                      className="text-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-600 hover:bg-red-700 text-sm"
                    >
                      Delete
                    </Button>
                  </>
                )}
                {!canEditReview(review) && (
                  <p className="text-sm text-gray-400">
                    Edit and delete unavailable (48-hour window passed)
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
