"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Calendar, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/auth";
import { FetchError } from "@/lib/fetcher";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    else if (!/[A-Z]/.test(form.password))
      e.password = "Must contain an uppercase letter";
    else if (!/[0-9]/.test(form.password)) e.password = "Must contain a number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await authApi.register(form);
      setUser(user);
      toast.success(`Welcome to Planora, ${user.name}!`);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof FetchError) {
        if (err.errors?.length) {
          const fe: Record<string, string> = {};
          err.errors.forEach((e) => {
            fe[e.field] = e.message;
          });
          setErrors(fe);
        } else toast.error(err.message);
      } else toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const rules = [
    { label: "At least 6 characters", ok: form.password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(form.password) },
    { label: "One number", ok: /[0-9]/.test(form.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0a0a0f]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-xl text-white mb-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Planora
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Start creating and joining events today
          </p>
        </div>

        <div className="rounded-2xl border border-[#1e1e2e] bg-[#111118] p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="name"
              type="text"
              label="Full name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Min 6 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="rounded-lg border border-[#1e1e2e] bg-[#1a1a2e]/40 px-3 py-2 space-y-1">
              <p className="text-xs text-slate-400 font-medium">
                Password must have:
              </p>
              {rules.map((r) => (
                <div key={r.label} className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${r.ok ? "bg-green-400" : "bg-slate-600"}`}
                  />
                  <span
                    className={`text-xs ${r.ok ? "text-green-400" : "text-slate-500"}`}
                  >
                    {r.label}
                  </span>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <UserPlus className="h-4 w-4" /> Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-violet-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
