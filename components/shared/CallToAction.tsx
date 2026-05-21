import Link from "next/link";
import { ArrowRight, PlusCircle, Ticket } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-violet-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-[#0a0a0f] to-purple-900/20" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 text-center">
            <p className="text-sm font-medium text-violet-400 mb-3">Get started today</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Ready to Host or Join an Event?
            </h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
              Join thousands of event creators and attendees. Create your free account and start today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-8 py-3.5 text-sm font-semibold text-white transition-all shadow-lg shadow-violet-900/40 hover:-translate-y-0.5">
                <PlusCircle className="h-4 w-4" /> Create an Event
              </Link>
              <Link href="/events" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1e1e2e] hover:border-violet-500/40 bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5">
                <Ticket className="h-4 w-4" /> Browse Events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              {["Free to join", "Secure payments", "Public & private events", "Easy management"].map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
