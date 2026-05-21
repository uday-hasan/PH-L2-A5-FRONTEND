import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Event } from "@/types";

const mockEvents: Event[] = [
  {
    id: "evt_001",
    title: "Next.js Developer Conference 2026",
    slug: "nextjs-developer-conference-2026",
    description:
      "Join frontend developers from around the world to explore the latest features in Next.js, React, and modern web technologies.",
    venue: "International Convention City Bashundhara",
    eventLink: "https://example.com/events/nextjs-conf",
    date: "2026-06-15",
    time: "10:00 AM",
    visibility: "PUBLIC",
    registrationFee: 1500,
    isFeatured: true,
    createdAt: "2026-05-01T08:30:00.000Z",
    organizer: {
      id: "org_001",
      name: "Tech Community BD",
      email: "contact@techcommunitybd.com",
      image: "https://i.pravatar.cc/150?img=12",
    },
    _count: {
      participations: 320,
      reviews: 87,
    },
  },
  {
    id: "evt_002",
    title: "AI & Machine Learning Bootcamp",
    slug: "ai-machine-learning-bootcamp",
    description:
      "A hands-on bootcamp covering machine learning fundamentals, AI tools, and practical implementation with Python.",
    venue: "BRAC University Auditorium",
    eventLink: "https://example.com/events/ai-bootcamp",
    date: "2026-07-08",
    time: "09:30 AM",
    visibility: "PRIVATE",
    registrationFee: 2500,
    isFeatured: false,
    createdAt: "2026-05-05T11:15:00.000Z",
    organizer: {
      id: "org_002",
      name: "AI Research Lab",
      email: "hello@airesearchlab.io",
      image: "https://i.pravatar.cc/150?img=22",
    },
    _count: {
      participations: 180,
      reviews: 41,
    },
  },
  {
    id: "evt_003",
    title: "Startup Networking Night",
    slug: "startup-networking-night",
    description:
      "Meet startup founders, investors, and developers for an evening of networking, collaboration, and idea sharing.",
    venue: "Gulshan Club",
    eventLink: "https://example.com/events/startup-night",
    date: "2026-08-12",
    time: "06:00 PM",
    visibility: "PUBLIC",
    registrationFee: 500,
    isFeatured: true,
    createdAt: "2026-05-10T14:00:00.000Z",
    organizer: {
      id: "org_003",
      name: "Startup Bangladesh",
      email: "events@startupbd.org",
      image: "https://i.pravatar.cc/150?img=35",
    },
    _count: {
      participations: 540,
      reviews: 129,
    },
  },
];

export async function UpcomingEvents() {
  const events: Event[] = mockEvents;

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

        {events.length > 0 ? (
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
