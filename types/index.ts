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
export type ParticipationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "BANNED";
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

export interface EventDetail extends Event {
  organizerId: string;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    user: { id: string; name: string; avatar?: string };
    createdAt: string;
  }>;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { id: string; name: string; avatar?: string };
  createdAt: string;
}

export interface Participant {
  id: string;
  userId: string;
  user: { id: string; name: string; avatar?: string };
  status: ParticipationStatus;
  createdAt: string;
}
