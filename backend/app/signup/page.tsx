"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create account");
        return;
      }

      router.push("/login");
    } catch {
      setError("Unable to connect to ASCEND");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-[#f5f1e8]">
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
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rotate-45 border border-[#d9a441]" />
            <div className="absolute inset-[8px] rotate-45 border border-[#d9a441]/30" />

            <span className="relative text-xl font-black text-[#e4ad4d]">
              A
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-[0.18em]">
            ASCEND
          </h1>

          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/35">
            Begin your evolution
          </p>
        </div>

        <div className="border border-white/[0.08] bg-[#090c11]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-7">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d9a441]">
              Initiate profile
            </p>

            <h2 className="text-2xl font-bold">
              Create your character
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Your real-world progress starts here.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose your callsign"
                className="w-full border border-white/[0.1] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#d9a441]/60"
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
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
              className="w-full bg-[#d9a441] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#e5b554] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating character..." : "Begin ASCENSION"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              Already registered?
            </span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full border border-white/[0.1] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:border-[#d9a441]/40 hover:text-white"
          >
            Return to login
          </button>
        </div>

        <p className="mt-5 text-center text-[9px] uppercase tracking-[0.2em] text-white/20">
          Secure progression • Persistent character data
        </p>
      </section>
    </main>
  );
}