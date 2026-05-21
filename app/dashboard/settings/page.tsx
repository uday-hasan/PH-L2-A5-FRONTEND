"use client";
import { useState, type FormEvent } from "react";
import { Save, User, Bell } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/lib/user";
import { FetchError } from "@/lib/fetcher";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    notifyEmail: user?.notifyEmail ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (form.avatar && !/^https?:\/\/.+/.test(form.avatar))
      e.avatar = "Must be a valid URL";
    if (form.bio && form.bio.length > 300)
      e.bio = "Bio must be under 300 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const updated = await userApi.updateProfile({
        name: form.name.trim(),
        bio: form.bio.trim() || undefined,
        avatar: form.avatar.trim() || undefined,
        notifyEmail: form.notifyEmail,
      });
      setUser(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      if (err instanceof FetchError) {
        if (err.errors?.length) {
          const fe: Record<string, string> = {};
          err.errors.forEach((e) => {
            fe[e.field] = e.message;
          });
          setErrors(fe);
        } else toast.error(err.message);
      } else toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile card */}
        <div className="rounded-xl border border-[#1e1e2e] bg-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
            <User className="h-4 w-4 text-violet-400" /> Profile Information
          </h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar
                name={form.name || user.name}
                src={form.avatar || user.avatar}
                size="lg"
              />
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
                <p className="text-xs text-violet-400 mt-0.5 capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>

            <Input
              id="name"
              label="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="Your full name"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-sm font-medium text-white">
                Bio
              </label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell others a bit about yourself..."
                rows={3}
                maxLength={300}
                className="w-full rounded-lg border border-[#1e1e2e] bg-input px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
              />
              <div className="flex justify-between">
                {errors.bio ? (
                  <p className="text-xs text-red-400">{errors.bio}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-slate-500">{form.bio.length}/300</p>
              </div>
            </div>

            <Input
              id="avatar"
              label="Avatar URL"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              error={errors.avatar}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        {/* Notifications card */}
        <div className="rounded-xl border border-[#1e1e2e] bg-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
            <Bell className="h-4 w-4 text-violet-400" /> Notifications
          </h3>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setForm({ ...form, notifyEmail: !form.notifyEmail })}
          >
            <div>
              <p className="text-sm font-medium text-white">
                Email Notifications
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Receive updates about your events and invitations
              </p>
            </div>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.notifyEmail ? "bg-violet-600" : "bg-muted"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.notifyEmail ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
          </div>
        </div>

        {/* Account info card */}
        <div className="rounded-xl border border-[#1e1e2e] bg-card p-6">
          <h3 className="text-lg font-semibold text-white mb-5">
            Account Information
          </h3>
          <div className="space-y-3">
            {[
              { label: "Email", value: user.email },
              {
                label: "Role",
                value: user.role.charAt(0) + user.role.slice(1).toLowerCase(),
              },
              {
                label: "Member since",
                value: new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-400">{row.label}</span>
                <span className="text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" loading={loading} size="lg">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </form>
    </div>
  );
}
