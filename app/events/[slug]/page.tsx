"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/fetcher";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { EventDetail, Participant } from "@/types";
import Image from "next/image";
import { toast } from "react-toastify";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userParticipation, setUserParticipation] =
    useState<Participant | null>(null);
  const [isOrganizerView, setIsOrganizerView] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        toast.error(null);

        // Fetch event detail (includes reviews from backend)
        const eventResponse = await api.get<EventDetail>(`/events/${slug}`);
        setEvent(eventResponse);

        // Check if current user is organizer
        if (user && eventResponse.organizerId === user.id) {
          setIsOrganizerView(true);
        }

        // Fetch participants if user is organizer
        if (user && eventResponse.organizerId === user.id) {
          try {
            const participantsResponse = await api.get<Participant[]>(
              `/participations/${eventResponse.id}/participants`,
            );
            setParticipants(participantsResponse);
          } catch {
            console.log("Could not fetch participants");
          }
        }

        // Check user's participation status
        if (user) {
          try {
            const userParticipations =
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await api.get<any[]>(`/participations/my`);
            const participation = userParticipations.find(
              (p) => p.eventId === eventResponse.id,
            );
            if (participation) {
              setUserParticipation(participation);
            }
          } catch {
            console.log("Could not fetch user participation");
          }
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load event",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEventDetail();
    }
  }, [slug, user]);

  const handleParticipationStatus = async (
    participationId: string,
    status: "APPROVED" | "REJECTED" | "BANNED",
  ) => {
    try {
      setActionLoading(participationId);

      await api.patch(`/participations/${participationId}/status`, { status });

      toast.success(`Participation ${status.toLowerCase()}!`);

      // Refresh participants
      if (event && isOrganizerView) {
        try {
          const participantsResponse = await api.get<Participant[]>(
            `/participations/${event.id}/participants`,
          );
          setParticipants(participantsResponse);
        } catch {
          console.log("Could not refresh participants");
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update participation",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleJoinEvent = async () => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const response = await api.post<{ checkoutUrl: string | null }>(
        `/participations/${event?.id}/join`,
        {},
      );

      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        // Refresh participation status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userParticipations = await api.get<any[]>(`/participations/my`);
        const participation = userParticipations.find(
          (p) => p.eventId === event?.id,
        );
        setUserParticipation(participation);
        toast.success("Successfully joined the event!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to join event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${event?.slug}`);
      window.location.href = "/dashboard/my-events";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event",
      );
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setInviting(true);
      toast.error(null);

      await api.post(`/invitations/${event?.id}/invite`, {
        receiverEmail: inviteEmail,
      });

      toast.success(`Invitation sent to ${inviteEmail}!`);
      setInviteEmail("");
      setShowInviteForm(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send invitation",
      );
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-[#1e1e2e] rounded-lg mb-6"></div>
            <div className="h-8 bg-[#1e1e2e] rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-[#1e1e2e] rounded w-full mb-2"></div>
            <div className="h-4 bg-[#1e1e2e] rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Event Not Found
            </h1>
            <p className="text-red-300 mb-4">{"This event does not exist"}</p>
            <Button onClick={() => (window.location.href = "/events")}>
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const reviews = event.reviews || [];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex gap-2">
                <Badge variant="default">{event.visibility}</Badge>
                {event.registrationFee > 0 && (
                  <Badge variant="warning">
                    Paid - ৳{event.registrationFee}
                  </Badge>
                )}
                {event.registrationFee === 0 && (
                  <Badge variant="success">Free</Badge>
                )}
              </div>
            </div>
            {isOrganizerView && (
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    (window.location.href = `/dashboard/my-events?edit=${event.id}`)
                  }
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteEvent}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details Card */}
            <Card className="p-6 mb-6 bg-card border-[#1e1e2e]">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Event Details
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-400 w-24">
                    Date:
                  </span>
                  <span className="text-lg text-white">
                    {formatDate(event.date)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-400 w-24">
                    Time:
                  </span>
                  <span className="text-lg text-white">{event.time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-400 w-24">
                    Venue:
                  </span>
                  <span className="text-lg text-white">
                    {event.venue || event.eventLink || "Online"}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#1e1e2e] pt-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </Card>

            {/* Organizer Info */}
            <Card className="p-6 mb-6 bg-card border-[#1e1e2e]">
              <h3 className="text-xl font-bold mb-4 text-white">Organizer</h3>
              <div className="flex items-center gap-4">
                {event.organizer.avatar && (
                  <Image
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-12 h-12 rounded-full"
                    width={80}
                    height={80}
                  />
                )}
                <div>
                  <p className="font-semibold text-white">
                    {event.organizer.name}
                  </p>
                  <p className="text-sm text-slate-400">Event Organizer</p>
                </div>
              </div>
            </Card>

            {/* Organizer Participants Management */}
            {isOrganizerView && participants.length > 0 && (
              <Card className="p-6 mb-6 bg-card border-[#1e1e2e]">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Manage Participants ({participants.length})
                </h3>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between bg-background p-4 rounded-lg border border-[#1e1e2e]"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {participant.user.avatar && (
                          <Image
                            src={participant.user.avatar}
                            alt={participant.user.name}
                            className="w-8 h-8 rounded-full"
                            width={40}
                            height={40}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {participant.user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Joined: {formatDate(participant.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          participant.status === "APPROVED"
                            ? "success"
                            : participant.status === "BANNED"
                              ? "destructive"
                              : "warning"
                        }
                        className="ml-2"
                      >
                        {participant.status}
                      </Badge>
                      <div className="flex gap-2 ml-3">
                        {participant.status === "PENDING" && (
                          <>
                            <Button
                              onClick={() =>
                                handleParticipationStatus(
                                  participant.id,
                                  "APPROVED",
                                )
                              }
                              disabled={actionLoading === participant.id}
                              className="bg-green-600 hover:bg-green-700 text-xs py-1 px-2 h-auto"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                handleParticipationStatus(
                                  participant.id,
                                  "REJECTED",
                                )
                              }
                              disabled={actionLoading === participant.id}
                              className="bg-red-600 hover:bg-red-700 text-xs py-1 px-2 h-auto"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {(participant.status === "APPROVED" ||
                          participant.status === "REJECTED") && (
                          <Button
                            onClick={() =>
                              handleParticipationStatus(
                                participant.id,
                                "BANNED",
                              )
                            }
                            disabled={actionLoading === participant.id}
                            className="bg-orange-600 hover:bg-orange-700 text-xs py-1 px-2 h-auto"
                          >
                            Ban
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Invite Users Section */}
            {isOrganizerView && (
              <Card className="p-6 mb-6 bg-card border-[#1e1e2e]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Invite Users</h3>
                  {!showInviteForm && (
                    <Button
                      onClick={() => setShowInviteForm(true)}
                      className="bg-violet-600 hover:bg-violet-700 text-sm"
                    >
                      + Send Invitation
                    </Button>
                  )}
                </div>

                {showInviteForm && (
                  <form onSubmit={handleSendInvitation} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        User Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full px-4 py-2 bg-background border border-[#1e1e2e] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={inviting}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        {inviting ? "Sending..." : "Send Invitation"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowInviteForm(false);
                          setInviteEmail("");
                        }}
                        variant="outline"
                        disabled={inviting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {!showInviteForm && (
                  <p className="text-sm text-slate-400">
                    Send invitations to users by entering their email address.
                    They will receive an invitation to join this event.
                  </p>
                )}
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="p-6 bg-card border-[#1e1e2e]">
              <h3 className="text-xl font-bold mb-4 text-white">
                Reviews ({reviews.length})
              </h3>

              {reviews.length === 0 ? (
                <p className="text-slate-400">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-[#1e1e2e] pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {review.user.avatar && (
                            <Image
                              src={review.user.avatar}
                              alt={review.user.name}
                              className="w-8 h-8 rounded-full"
                              width={40}
                              height={40}
                            />
                          )}
                          <span className="font-semibold text-white">
                            {review.user.name}
                          </span>
                        </div>
                        <span className="text-yellow-400 text-lg">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-slate-300">{review.comment}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Join/Status Card */}
            {!isOrganizerView && (
              <Card className="p-6 mb-6 sticky top-4 bg-card border-[#1e1e2e]">
                <h3 className="text-lg font-bold mb-4 text-white">
                  Participation
                </h3>

                {userParticipation ? (
                  <div>
                    <Badge
                      variant={
                        userParticipation.status === "APPROVED"
                          ? "success"
                          : "warning"
                      }
                      className="mb-3"
                    >
                      {userParticipation.status}
                    </Badge>
                    <p className="text-sm text-slate-400 mt-3">
                      {userParticipation.status === "APPROVED"
                        ? "✓ You have joined this event!"
                        : userParticipation.status === "PENDING"
                          ? "⏳ Your request is pending organizer approval"
                          : "✗ You have not joined this event"}
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleJoinEvent} className="w-full">
                    {event.registrationFee > 0 ? "Pay & Join" : "Join Event"}
                  </Button>
                )}
              </Card>
            )}

            {/* Participants Card */}
            {isOrganizerView && (
              <Card className="p-6 mb-6 bg-card border-[#1e1e2e]">
                <h3 className="text-lg font-bold mb-4 text-white">
                  Participants ({event._count?.participations || 0})
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Manage participant approvals and statuses above
                </p>
                <Link href={`/dashboard/my-events?participants=${event.id}`}>
                  <Button variant="outline" className="w-full">
                    View All
                  </Button>
                </Link>
              </Card>
            )}

            {/* Event Stats */}
            <Card className="p-6 bg-card border-[#1e1e2e]">
              <h3 className="text-lg font-bold mb-4 text-white">Event Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Participants:</span>
                  <span className="font-semibold text-white">
                    {event._count?.participations || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reviews:</span>
                  <span className="font-semibold text-white">
                    {reviews.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Rating:</span>
                  <span className="font-semibold text-white">
                    {reviews.length > 0
                      ? (
                          reviews.reduce((acc, r) => acc + r.rating, 0) /
                          reviews.length
                        ).toFixed(1)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
