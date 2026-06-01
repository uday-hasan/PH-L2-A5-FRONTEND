/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/fetcher";
import type { User, Event } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { toast } from "react-toastify";

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  pendingParticipations: number;
}

interface PaginatedResponse<T> {
  events?: T[];
  users?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "events" | "users">(
    "stats",
  );

  const fetchStats = async () => {
    try {
      const statsResponse = await api.get<AdminStats>("/admin/stats");
      setStats(statsResponse);
    } catch (err: any) {
      console.error("Failed to fetch stats:", err);
      toast.error(err.message || "Failed to fetch stats");
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsResponse = await api.get<PaginatedResponse<Event>>(
        "/admin/events?limit=100",
      );
      setEvents(eventsResponse?.events || []);
    } catch (err: any) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
      toast.error(err.message || "Failed to fetch events");
    }
  };

  const fetchUsers = async () => {
    try {
      const usersResponse = await api.get<PaginatedResponse<User>>(
        "/admin/users?limit=100",
      );
      setUsers(usersResponse?.users || []);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      toast.error(err.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    setLoading(true);

    if (activeTab === "stats") {
      fetchStats().then(() => setLoading(false));
    } else if (activeTab === "events") {
      fetchEvents().then(() => setLoading(false));
    } else if (activeTab === "users") {
      fetchUsers().then(() => setLoading(false));
    }
  }, [activeTab]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully");
      await fetchEvents();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event");
    }
  };

  const handleFeatureEvent = async (eventSlug: string, isFeatured: boolean) => {
    try {
      await api.patch(`/events/${eventSlug}/feature`);
      toast.success(
        isFeatured
          ? "Event removed from featured"
          : "Event featured successfully",
      );
      await fetchEvents();
    } catch (err: any) {
      toast.error(err.message || "Failed to update feature status");
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-300">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage platform data and moderation
        </p>
      </div>

      {/* Messages */}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {["stats", "events", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.totalUsers}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Events</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.totalEvents}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-purple-600">
              ৳{stats.totalRevenue.toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Approvals</p>
            <p className="text-4xl font-bold text-orange-600">
              {stats.pendingParticipations}
            </p>
          </Card>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Fee
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Participants
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Featured
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events && events.length > 0 ? (
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{event.title}</td>
                    <td className="px-6 py-4 text-white">
                      {event.organizer?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          event.visibility === "PUBLIC" ? "default" : "warning"
                        }
                      >
                        {event.visibility}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {event.registrationFee > 0
                        ? `৳${event.registrationFee}`
                        : "Free"}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {event._count?.participations || 0}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={event.isFeatured ? "default" : "purple"}>
                        {event.isFeatured ? "Featured" : "Not Featured"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleFeatureEvent(event.slug, event.isFeatured)
                          }
                          className={`text-sm ${
                            event.isFeatured
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {event.isFeatured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-600 hover:bg-red-700 text-sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No events found</p>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Joined
                </th>
                <th className="px-6 py-3 text-left font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{user.name}</td>
                    <td className="px-6 py-4 text-white">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "purple"}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== "ADMIN" && (
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-sm"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
