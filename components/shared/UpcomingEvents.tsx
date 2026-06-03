"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { eventsApi } from "@/lib/events";
import { EventCard } from "@/components/event/EventCard";
import type { Event } from "@/types";
import { useEffect, useState } from "react";

function EventCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-5 space-y-4 animate-pulse">
      {/* Image placeholder */}
      <div className="h-40 w-full rounded-lg bg-white/10" />
      {/* Badge + title */}
      <div className="space-y-2">
        <div className="h-4 w-20 rounded-full bg-violet-500/20" />
        <div className="h-5 w-3/4 rounded-md bg-white/10" />
        <div className="h-5 w-1/2 rounded-md bg-white/10" />
      </div>
      {/* Description */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full rounded-md bg-white/10" />
        <div className="h-3.5 w-5/6 rounded-md bg-white/10" />
      </div>
      {/* Meta: date & venue */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-violet-500/20" />
          <div className="h-3.5 w-36 rounded-md bg-white/10" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-violet-500/20" />
          <div className="h-3.5 w-28 rounded-md bg-white/10" />
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1e1e2e]">
        <div className="h-4 w-16 rounded-md bg-white/10" />
        <div className="h-8 w-24 rounded-lg bg-violet-500/20" />
      </div>
    </div>
  );
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await eventsApi.getUpcoming();
        setEvents(data);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-violet-400 mb-1">
              Don&apos;t miss out
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] py-16 text-center">
            <p className="text-slate-400">
              No upcoming events yet. Be the first to create one!
            </p>
            <Link
              href="/auth/register"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-white transition-colors"
            >
              Create Event <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            View all events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
