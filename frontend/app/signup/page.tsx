"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiLock, FiMail, FiUser } from "react-icons/fi";

const AUTH_TOKEN_KEY = "foodie-auth-token";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string) || "Foodie friend";
    const next = searchParams.get("next") || "/app";
    localStorage.setItem(AUTH_TOKEN_KEY, `session-${Date.now()}`);
    setStatus(`${name}, you are signed up. Redirecting...`);
    window.dispatchEvent(new Event("foodie-auth-changed"));
    router.push(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-white to-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-red-300/35 blur-3xl" />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6 flex items-center gap-3 text-sm text-orange-700">
          <FiArrowLeft />
          <Link href="/" className="hover:underline">
            Back to landing
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr,1.05fr] items-center">
          <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-amber-400 p-10 text-white shadow-[0_25px_90px_-35px_rgba(249,115,22,0.6)] ring-1 ring-orange-200/40">
            <p className="inline-flex max-w-max items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-50 ring-1 ring-white/15">
              New to Foodie
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">Create your Foodie passport.</h1>
            <p className="mt-3 text-lg text-orange-50/90 max-w-xl">
              Unlock curated drops, saved carts, live order tracking, and perks tailored to how you like to eat.
            </p>
            <div className="mt-6 space-y-3 text-sm text-orange-50">
              {["Personalized picks", "Secure payments", "Priority support"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <FiCheckCircle className="text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass relative z-10 rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-orange-100 backdrop-blur-lg">
            <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-orange-400/40 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-black text-slate-900">Sign up</h2>
              <p className="mt-2 text-slate-700">Just a few details to start eating better.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-orange-500 focus-within:shadow-orange-100">
                    <FiUser className="text-orange-500" />
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Ariana Chef"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      autoComplete="name"
                    />
                  </div>
                </label>

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
                      minLength={8}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                      autoComplete="new-password"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Use at least 8 characters with a mix of letters and numbers.</p>
                </label>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <input type="checkbox" name="marketing" className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                  <p className="text-sm text-slate-700">Send me curated drops, midnight launches, and limited-time chef specials.</p>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2 px-4 py-3 text-base"
                >
                  Create account
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
                    Encrypted & privacy-first
                  </div>
                  <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                    Already a member? Login
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
