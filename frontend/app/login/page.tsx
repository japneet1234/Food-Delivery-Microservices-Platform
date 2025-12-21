"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiLock, FiMail } from "react-icons/fi";

const AUTH_TOKEN_KEY = "foodie-auth-token";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const next = searchParams.get("next") || "/app";
    localStorage.setItem(AUTH_TOKEN_KEY, `session-${Date.now()}`);
    setStatus(`Hey ${email || "there"}, you are signed in. Redirecting...`);
    window.dispatchEvent(new Event("foodie-auth-changed"));
    router.push(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute -left-10 top-10 h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-red-500/25 blur-3xl" />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6 flex items-center gap-3 text-sm text-orange-100">
          <FiArrowLeft />
          <Link href="/" className="hover:underline">
            Back to landing
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center">
          <div className="hidden lg:flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-orange-500/20 via-white/5 to-red-500/20 p-10 ring-1 ring-white/10 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.45)]">
            <p className="inline-flex max-w-max items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-100 ring-1 ring-white/10">
              Foodie access
            </p>
            <h1 className="text-4xl font-black leading-tight">Log in to keep your cravings, perks, and past orders synced.</h1>
            <p className="text-slate-200 text-lg">
              Your saved addresses, recent cravings, and live order tracking are a sign-in away. No passwords leaked here—just encrypted, secure, and fast.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-orange-100">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-bold">25m</p>
                <p className="text-orange-50/80">Avg delivery</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-orange-50/80">App store love</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-orange-50/80">Partner kitchens</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-bold">Fresh</p>
                <p className="text-orange-50/80">New drops daily</p>
              </div>
            </div>
          </div>

          <div className="glass relative z-10 rounded-3xl bg-white/10 p-8 text-slate-900 shadow-2xl ring-1 ring-white/30 backdrop-blur-lg">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-orange-400/40 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-black text-slate-900">Welcome back</h2>
              <p className="mt-2 text-slate-700">Log in to track orders, manage your cart, and unlock perks.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-500 focus-within:shadow-orange-100">
                    <FiMail className="text-orange-500" />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@foodie.com"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-500 focus-within:shadow-orange-100">
                    <FiLock className="text-orange-500" />
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="mt-2 text-right text-sm">
                    <Link href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                      Forgot password?
                    </Link>
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2 px-4 py-3 text-base"
                >
                  Login and continue
                  <FiArrowRight className="h-5 w-5" />
                </button>

                {status && (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                    {status}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Secure session enabled
                  </div>
                  <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-700">
                    Need an account? Sign up
                  </Link>
                </div>

                <div className="grid gap-3">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white font-semibold shadow-sm hover:bg-slate-800"
                  >
                    View landing
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
