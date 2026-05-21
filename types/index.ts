export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  notifyEmail: boolean;
  createdAt: string;
}

export type EventVisibility = "PUBLIC" | "PRIVATE";
export type ParticipationStatus = "PENDING" | "APPROVED" | "REJECTED" | "BANNED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export interface EventOrganizer {
  id: string;
  name: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  venue?: string;
  eventLink?: string;
  date: string;
  time: string;
  visibility: EventVisibility;
  registrationFee: number;
  isFeatured: boolean;
  createdAt: string;
  organizer: EventOrganizer;
  _count: { participations: number; reviews: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
