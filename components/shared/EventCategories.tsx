"use client";
import Link from "next/link";
import { ArrowRight, Users, Lock, DollarSign, Gift } from "lucide-react";

const CATEGORIES = [
  { key: "public-free", label: "Public Free", icon: Gift, description: "Open to everyone, no registration fee required.", bg: "bg-green-500/10 border-green-500/20 hover:border-green-500/50", iconBg: "bg-green-500/20 text-green-400", params: "?visibility=PUBLIC&paid=false" },
  { key: "public-paid", label: "Public Paid", icon: DollarSign, description: "Open events with a registration fee to attend.", bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50", iconBg: "bg-blue-500/20 text-blue-400", params: "?visibility=PUBLIC&paid=true" },
  { key: "private-free", label: "Private Free", icon: Lock, description: "Invite-only events with no cost to join.", bg: "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50", iconBg: "bg-yellow-500/20 text-yellow-400", params: "?visibility=PRIVATE&paid=false" },
  { key: "private-paid", label: "Private Paid", icon: Users, description: "Exclusive events requiring invitation and payment.", bg: "bg-violet-500/10 border-violet-500/20 hover:border-violet-500/50", iconBg: "bg-violet-500/20 text-violet-400", params: "?visibility=PRIVATE&paid=true" },
];

export function EventCategories() {
  return (
    <section className="py-20 bg-[#111118] border-y border-[#1e1e2e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-violet-400 mb-1">Find what fits you</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Event Categories</h2>
          <p className="mt-3 text-slate-400 max-w-md mx-auto">Filter events by visibility and pricing to find the perfect fit.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.key} href={`/events${cat.params}`} className={`group relative rounded-xl border ${cat.bg} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}>
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${cat.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">{cat.label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
