/* eslint-disable react-hooks/immutability */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/fetcher";
import type { Event } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-toastify";

interface Invitation {
  id: string;
  event: Event;
  sender: { id: string; name: string; avatar?: string };
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

export default function InvitationsPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "DECLINED"
  >("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Invitation[]>(
        `/invitations/my?status=${filter}`,
      );
      setInvitations(response);
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);
  useEffect(() => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInvitations();
  }, [user, filter, fetchInvitations]);

  const handleAccept = async (invitationId: string, event: Event) => {
    try {
      setActionLoading(invitationId);

      // For paid events, redirect to Stripe checkout
      if (event.registrationFee > 0) {
        const response = await api.patch<{ checkoutUrl: string | null }>(
          `/invitations/${invitationId}/respond`,
          { accept: true },
        );

        if (response?.checkoutUrl) {
          window.location.href = response.checkoutUrl;
          return;
        }
      }

      // For free events, accept directly
      await api.patch(`/invitations/${invitationId}/respond`, { accept: true });
      toast.success("Invitation accepted!");
      await fetchInvitations();
    } catch (err) {
      toast.error((err as Error).message || "Failed to accept invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    if (!confirm("Are you sure you want to decline this invitation?")) {
      return;
    }

    try {
      setActionLoading(invitationId);

      await api.patch(`/invitations/${invitationId}/respond`, {
        accept: false,
      });
      toast.success("Invitation declined");
      await fetchInvitations();
    } catch (err) {
      toast.error((err as Error).message || "Failed to decline invitation");
    } finally {
      setActionLoading(null);
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
        <h1 className="text-3xl font-bold text-gray-300">Invitations</h1>
        <p className="text-gray-600 mt-1">Manage your event invitations</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["ALL", "PENDING", "ACCEPTED", "DECLINED"].map((status) => (
          <Button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            variant={filter === status ? "primary" : "outline"}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Invitations List */}
      {invitations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 text-lg">
            {invitations.length === 0
              ? "No invitations yet"
              : "No invitations match the selected filter"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-300 mb-2">
                    {invitation.event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {invitation.event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-600">📅</span>
                      <span>{formatDate(invitation.event.date)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">⏰</span>
                      <span>{invitation.event.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">👤</span>
                      <span>Invited by: {invitation.sender.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">💰</span>
                      <span>
                        {invitation.event.registrationFee > 0
                          ? `৳${invitation.event.registrationFee}`
                          : "Free"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Badge
                      variant={
                        invitation.status === "ACCEPTED"
                          ? "success"
                          : invitation.status === "DECLINED"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {invitation.status}
                    </Badge>
                  </div>
                </div>

                {invitation.status === "PENDING" && (
                  <div className="flex gap-2 flex-col">
                    <Button
                      onClick={() =>
                        handleAccept(invitation.id, invitation.event)
                      }
                      disabled={actionLoading === invitation.id}
                    >
                      {actionLoading === invitation.id
                        ? "Processing..."
                        : invitation.event.registrationFee > 0
                          ? "Pay & Accept"
                          : "Accept"}
                    </Button>
                    <Button
                      onClick={() => handleDecline(invitation.id)}
                      variant="outline"
                      disabled={actionLoading === invitation.id}
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {invitation.status !== "PENDING" && (
                  <div>
                    <Link href={`/events/${invitation.event.slug}`}>
                      <Button variant="outline">View Event</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
