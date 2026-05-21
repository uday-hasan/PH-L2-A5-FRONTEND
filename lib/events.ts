import { api } from "./fetcher";
import type { Event } from "@/types";

export const eventsApi = {
  getUpcoming: () => api.get<Event[]>("/events/upcoming"),
  getFeatured: () => api.get<Event | null>("/events/featured"),
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return api.get<{ events: Event[]; total: number; totalPages: number }>(
      `/events${qs}`,
    );
  },
  getBySlug: (slug: string) => api.get<Event>(`/events/${slug}`),
  create: (data: any) => api.post<Event>("/events", data),
  update: (id: string, data: any) => api.patch<Event>(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get<Event[]>("/events/my"),
  search: (query: string) =>
    api.get<Event[]>(`/events?search=${encodeURIComponent(query)}`),
};
