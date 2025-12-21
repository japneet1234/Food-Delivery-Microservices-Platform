import Link from "next/link";
import {
  FiArrowRight,
  FiClock,
  FiFeather,
  FiMapPin,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="landing-bg relative isolate overflow-hidden bg-gradient-to-b from-amber-50 via-white to-slate-50 text-gray-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute right-0 -top-20 h-80 w-80 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative px-6 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold shadow-lg shadow-orange-100 ring-1 ring-orange-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Freshly curated bites in under 30 minutes
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900">
                Foodie brings the city&apos;s best kitchens to your couch.
              </h1>
              <p className="text-lg sm:text-xl text-slate-700 max-w-2xl">
                Discover chef-led menus, artisan desserts, and midnight comfort bowls. Built for speed, quality, and a little bit of drama on the plate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
              >
                Start with login
                <FiArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/signup"
                className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-base"
              >
                Create account
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <FiStar className="text-amber-500" /> 4.9 average rating
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-orange-500" /> 25 min avg delivery
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-green-600" /> Secure checkout
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass relative overflow-hidden rounded-3xl border border-white/60 shadow-[0_25px_80px_-35px_rgba(255,100,50,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-white/60 to-amber-200/20" />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                    Live orders
                  </div>
                  <div className="text-xs text-slate-600">08:45 PM</div>
                </div>
                <div className="grid gap-3">
                  {["Smoked Bao Box", "Truffle Mac", "Classic Dosa", "Berry Cheesecake"].map((item, idx) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-orange-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100" />
                        <div>
                          <p className="font-semibold text-slate-900">{item}</p>
                          <p className="text-xs text-slate-500">{idx % 2 === 0 ? "On the way" : "Cooking now"}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-orange-600">12-18 mins</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Curated for you</p>
                      <p className="text-lg font-bold text-slate-900">Cloud Bistro</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Signature bowls, slow-fermented pizzas, and desserts that arrive camera-ready.
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-orange-600 font-semibold">
                    <span className="rounded-full bg-orange-50 px-3 py-1">Free delivery</span>
                    <span className="rounded-full bg-orange-50 px-3 py-1">Chef specials</span>
                    <span className="rounded-full bg-orange-50 px-3 py-1">Vegan picks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="relative z-10 border-y border-slate-100 bg-white/70 backdrop-blur py-10">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[{ label: "Partner kitchens", value: "1.2k" }, { label: "Dishes tasted", value: "48k" }, { label: "Cities", value: "36" }, { label: "Avg rating", value: "4.9" }].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white px-4 py-6 shadow-sm">
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm font-semibold text-orange-600">Why Foodie</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Built for cravings, speed, and story-worthy meals.</h2>
            <p className="text-slate-600 text-lg">From chef-curated collections to late-night rescue bowls, Foodie keeps the city&apos;s flavors in one seamless app.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: <FiTrendingUp className="h-6 w-6" />, title: "Curated to perform", copy: "Algorithmically surfaces trending dishes, seasonal drops, and chef specials you actually want." },
              { icon: <FiMapPin className="h-6 w-6" />, title: "Precision delivery", copy: "Live-tracked couriers, optimized routing, and temperature-safe packaging." },
              { icon: <FiUsers className="h-6 w-6" />, title: "For every mood", copy: "Family platters, comfort ramen, gluten-free pizzas, or sugar rush desserts—pick a vibe." },
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl bg-white/80 p-6 shadow-lg shadow-orange-100 ring-1 ring-orange-100 flex flex-col gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 text-orange-700">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="relative px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-3xl bg-slate-900 text-white p-10 sm:p-12 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.5)]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-orange-200">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-black">Three taps to &ldquo;food is here&rdquo;.</h2>
              <p className="text-slate-200 text-lg">Pick your cravings, track in real time, and earn perks on every order.</p>
              <div className="grid gap-4">
                {["Browse curated drops", "Lock your order", "Track till doorstep"].map((step, idx) => (
                  <div key={step} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/90 text-sm font-bold">{idx + 1}</span>
                    <div>
                      <p className="font-semibold text-white">{step}</p>
                      <p className="text-sm text-slate-200/80">{idx === 0 ? "Swipe through chef picks, lifestyle menus, and new-in-town kitchens." : idx === 1 ? "Secure checkout with instant offers and scheduled deliveries." : "Minute-by-minute courier tracking with proactive status updates."}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-slate-900 font-semibold shadow-lg">
                  Login to continue
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-orange-500/90 px-5 py-3 text-white font-semibold shadow-lg shadow-orange-500/40">
                  Get started free
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-orange-400/30 blur-3xl" />
              <div className="glass relative rounded-3xl border border-white/20 bg-white/5 p-6 shadow-2xl">
                <div className="flex items-center justify-between text-slate-200 text-sm">
                  <span>Order timeline</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs">Live</span>
                </div>
                <div className="mt-4 space-y-3">
                  {["Chef accepted", "Packed with care", "Courier en route", "Arriving"].map((item, idx) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/90 text-sm font-bold text-slate-900">{idx + 1}</span>
                      <div>
                        <p className="font-semibold text-white">{item}</p>
                        <p className="text-xs text-slate-200/80">{idx === 0 ? "Chef Aria is prepping your Smoked Bao Box." : idx === 1 ? "Sustainable, heat-lock packaging sealed." : idx === 2 ? "Rohan (2 min away) just picked it up." : "Gate 4 drop-off in 3 mins."}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white shadow-[0_25px_80px_-40px_rgba(220,38,38,0.6)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-center px-8 py-12">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-orange-100">Ready when you are</p>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight">Skip the wait. Foodie keeps your cravings one tap away.</h3>
              <p className="text-orange-50/90 text-lg">Sign in to pick up where you left off, or create a fresh account to start earning perks.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-slate-900 font-semibold shadow-lg">
                  Login
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-white font-semibold">
                  Sign up
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Chef&apos;s drop</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs">New</span>
              </div>
              <div className="mt-4 grid gap-4">
                {["Wood-fired Burrata Pizza", "Molten Chocolate Jar", "Miso Butter Ramen"].map((dish) => (
                  <div key={dish} className="rounded-xl bg-white/10 px-4 py-3 border border-white/15">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{dish}</span>
                      <span className="text-orange-100">Chef curated</span>
                    </div>
                    <p className="text-xs text-orange-50/80 mt-1">Delivering tonight with lightning slots.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
