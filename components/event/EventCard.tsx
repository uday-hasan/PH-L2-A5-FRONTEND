import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import type { Event } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function EventCard({ event }: { event: Event }) {
  const isPaid = event.registrationFee > 0;
  const isPrivate = event.visibility === "PRIVATE";

  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-[#1e1e2e] bg-[#111118] p-5 hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/10">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isPrivate ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-violet-500/10 text-violet-400 border border-violet-500/20"}`}>
            {isPrivate ? "Private" : "Public"}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isPaid ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
            {isPaid ? `৳${event.registrationFee}` : "Free"}
          </span>
        </div>
        {event.isFeatured && (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">⭐ Featured</span>
        )}
      </div>
      <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
        {event.title}
      </h3>
      <div className="space-y-1.5 text-sm text-slate-400">
        <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 shrink-0" /><span>{formatDate(event.date)} · {event.time}</span></div>
        {event.venue && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{event.venue}</span></div>}
        <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 shrink-0" /><span>{event._count.participations} participants</span></div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {event.organizer.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-slate-400 truncate max-w-[100px]">{event.organizer.name}</span>
        </div>
        <Link href={`/events/${event.slug}`} className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-white transition-colors">
          View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
