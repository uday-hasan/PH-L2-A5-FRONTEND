/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/event/EventCard";
import { Button } from "@/components/ui/Button";
import { eventsApi } from "@/lib/events";
import type { Event } from "@/types";

const FILTERS = [
  { label: "All", visibility: "", paid: "" },
  { label: "Public Free", visibility: "PUBLIC", paid: "false" },
  { label: "Public Paid", visibility: "PUBLIC", paid: "true" },
  { label: "Private Free", visibility: "PRIVATE", paid: "false" },
  { label: "Private Paid", visibility: "PRIVATE", paid: "true" },
];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);

  const activeVisibility = searchParams.get("visibility") || "";
  const activePaid = searchParams.get("paid") || "";

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "9" };
      if (search) params.search = search;
      if (activeVisibility) params.visibility = activeVisibility;
      if (activePaid) params.paid = activePaid;
      const res = await eventsApi.getAll(params);
      setEvents(res.events);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeVisibility, activePaid, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const setFilter = (visibility: string, paid: string) => {
    const p = new URLSearchParams();
    if (visibility) p.set("visibility", visibility);
    if (paid) p.set("paid", paid);
    if (search) p.set("search", search);
    router.push(`/events?${p.toString()}`);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (activeVisibility) p.set("visibility", activeVisibility);
    if (activePaid) p.set("paid", activePaid);
    router.push(`/events?${p.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f]">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <div className="bg-[#111118] border-b border-[#1e1e2e]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-white mb-1">
              Browse Events
            </h1>
            <p className="text-slate-400 text-sm">
              {total} event{total !== 1 ? "s" : ""} found
            </p>

            <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by title or organizer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-[#1e1e2e] bg-[#16162a] pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter(activeVisibility, activePaid);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Button type="submit" size="md">
                <Search className="h-4 w-4" /> Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              {FILTERS.map((f) => {
                const isActive =
                  f.visibility === activeVisibility && f.paid === activePaid;
                return (
                  <button
                    key={f.label}
                    onClick={() => setFilter(f.visibility, f.paid)}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all border ${
                      isActive
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "border-[#1e1e2e] text-slate-400 hover:border-violet-500/40 hover:text-white bg-[#1a1a2e]/30"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#1e1e2e] bg-[#111118] h-56 animate-pulse"
                />
              ))}
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-400 px-3">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] py-20 text-center">
              <Search className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-medium">No events found</p>
              <p className="text-sm text-slate-400 mt-1">
                Try adjusting your search or filters
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setFilter("", "");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
