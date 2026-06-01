"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/fetcher";
import type { Event } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-toastify";

export default function MyEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    eventLink: "",
    registrationFee: "",
    visibility: "PUBLIC",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get<Event[]>("/events/dashboard/my-events");
      setEvents(response);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyEvents();
  }, [user]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const eventData = {
        ...formData,
        registrationFee: parseFloat(formData.registrationFee) || 0,
        date: new Date(formData.date).toISOString(),
      };

      if (editingEvent) {
        await api.patch(`/events/${editingEvent.slug}`, eventData);
        toast.success("Event updated successfully!");
      } else {
        await api.post("/events", eventData);
        toast.success("Event created successfully!");
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        eventLink: "",
        registrationFee: "",
        visibility: "PUBLIC",
      });
      setEditingEvent(null);
      setShowCreateForm(false);

      // Refresh events
      await fetchMyEvents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (slug: string) => {
    try {
      await api.delete(`/events/${slug}`);
      toast.success("Event deleted successfully!");
      await fetchMyEvents();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event",
      );
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      time: event.time,
      venue: event.venue || "",
      eventLink: event.eventLink || "",
      registrationFee: event.registrationFee.toString(),
      visibility: event.visibility,
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      eventLink: "",
      registrationFee: "",
      visibility: "PUBLIC",
    });
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
          <h1 className="text-3xl font-bold text-gray-300">My Events</h1>
          <p className="text-gray-600 mt-1">Manage your created events</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            + Create Event
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                placeholder="Enter event description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <Input
                type="text"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                placeholder="Physical venue or location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Link (Online)
              </label>
              <Input
                type="url"
                value={formData.eventLink}
                onChange={(e) =>
                  setFormData({ ...formData, eventLink: e.target.value })
                }
                placeholder="https://meet.example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Fee (৳)
                </label>
                <Input
                  type="number"
                  value={formData.registrationFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationFee: e.target.value,
                    })
                  }
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) =>
                    setFormData({ ...formData, visibility: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingEvent
                    ? "Update Event"
                    : "Create Event"}
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

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">No events created yet</p>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Your First Event
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-4 hover:shadow-lg transition-shadow"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-300 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-600">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">👥</span>
                  <span>{event._count?.participations || 0} participants</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">💰</span>
                  <span>
                    {event.registrationFee > 0
                      ? `৳${event.registrationFee}`
                      : "Free"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <Badge
                  variant={
                    event.visibility === "PUBLIC" ? "default" : "warning"
                  }
                >
                  {event.visibility}
                </Badge>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link href={`/events/${event.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full text-sm">
                    View
                  </Button>
                </Link>
                <Button
                  onClick={() => handleEditEvent(event)}
                  variant="outline"
                  className="text-sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteEvent(event.slug)}
                  className="bg-red-600 hover:bg-red-700 text-sm"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
