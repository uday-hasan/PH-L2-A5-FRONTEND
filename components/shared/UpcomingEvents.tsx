import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { eventsApi } from "@/lib/events";
import { EventCard } from "@/components/event/EventCard";
import type { Event } from "@/types";

export async function UpcomingEvents() {
  let events: Event[] = [];
  try { events = await eventsApi.getUpcoming(); } catch {}

  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-violet-400 mb-1">Don&apos;t miss out</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Upcoming Events</h2>
          </div>
          <Link href="/events" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] py-16 text-center">
            <p className="text-slate-400">No upcoming events yet. Be the first to create one!</p>
            <Link href="/auth/register" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-white transition-colors">
              Create Event <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            View all events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
