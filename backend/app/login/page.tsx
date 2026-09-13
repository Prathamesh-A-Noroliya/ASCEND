"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Unable to connect to ASCEND");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-[#f5f1e8]">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#d9a441]/[0.07] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <section className="relative z-10 w-full max-w-[460px]">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rotate-45 border border-[#d9a441]" />
            <div className="absolute inset-[9px] rotate-45 border border-[#d9a441]/30" />

            <span className="relative text-2xl font-black text-[#e4ad4d]">
              A
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-[0.18em]">
            ASCEND
          </h1>

          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">
            Your life. Your quest. Your evolution.
          </p>
        </div>

        {/* Login panel */}
        <div className="border border-white/[0.08] bg-[#090c11]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d9a441]">
              Access terminal
            </p>

            <h2 className="text-2xl font-bold">
              Continue your ascent
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Enter your credentials to resume your progression.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full border border-white/[0.1] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#d9a441]/60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full border border-white/[0.1] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#d9a441]/60"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden bg-[#d9a441] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#e5b554] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Authenticating..." : "Enter ASCEND"}
              </span>
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              New operative?
            </span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full border border-white/[0.1] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:border-[#d9a441]/40 hover:text-white"
          >
            Create account
          </button>
        </div>

        <p className="mt-6 text-center text-[9px] uppercase tracking-[0.2em] text-white/20">
          Progress is stored securely in your ASCEND account
        </p>
      </section>
    </main>
  );
}