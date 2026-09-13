"use client";

import { useEffect, useState } from "react";

const missions = [
  {
    title: "Forge the Mind",
    description: "45 minutes of uninterrupted deep work.",
    stat: "INTELLIGENCE",
    reward: "+120",
    bonus: "+12 INT",
    duration: "45 MIN",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Break the Limit",
    description: "Complete a 30 minute physical workout.",
    stat: "STRENGTH",
    reward: "+90",
    bonus: "+10 STR",
    duration: "30 MIN",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Quiet the Noise",
    description: "10 minutes of focused meditation.",
    stat: "DISCIPLINE",
    reward: "+70",
    bonus: "+8 DIS",
    duration: "10 MIN",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
  },
];

const abilities = [
  { short: "INT", name: "Intelligence", value: 72 },
  { short: "STR", name: "Strength", value: 58 },
  { short: "DIS", name: "Discipline", value: 81 },
  { short: "CRE", name: "Creativity", value: 46 },
  { short: "CHA", name: "Charisma", value: 39 },
];

const worldStages = [
  { name: "Camp", level: 1, unlocked: true, icon: "⌂" },
  { name: "Workshop", level: 5, unlocked: true, icon: "✦" },
  { name: "Library", level: 10, unlocked: true, icon: "▥" },
  { name: "Training", level: 15, unlocked: false, icon: "◇" },
  { name: "Sanctuary", level: 20, unlocked: false, icon: "✧" },
  { name: "Summit", level: 30, unlocked: false, icon: "△" },
];

function Icon({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [startedMission, setStartedMission] = useState<string | null>(null);
  const [quests, setQuests] = useState<any[]>([]);
  const [loadingQuests, setLoadingQuests] = useState(true);
  const [completingQuest, setCompletingQuest] = useState<string | null>(null);
  const [rewardPopup, setRewardPopup] = useState<{ xp: number; gold: number } | null>(null);

  useEffect(() => {
    async function loadQuests() {
      try {
        const response = await fetch("/api/quests");
        if (!response.ok) return;
        const data = await response.json();
        setQuests(data.quests || []);
      } catch (error) {
        console.error("Failed to load quests:", error);
      } finally {
        setLoadingQuests(false);
      }
    }

    loadQuests();
  }, []);

  async function completeQuest(questId: string) {
    try {
      setCompletingQuest(questId);

      const response = await fetch(`/api/quests/${questId}/complete`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to complete quest");
        return;
      }

      setQuests((current) =>
        current.map((quest) =>
          quest._id === questId
            ? { ...quest, status: "completed", completedAt: new Date().toISOString() }
            : quest
        )
      );

      setStartedMission(null);
      setRewardPopup({ xp: data.rewards.xp, gold: data.rewards.gold });
      setTimeout(() => setRewardPopup(null), 1800);
    } catch (error) {
      console.error("Complete quest error:", error);
      alert("Something went wrong");
    } finally {
      setCompletingQuest(null);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05070a] text-[#f5f1e8]">      {rewardPopup && (
        <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center">
          <div className="animate-pulse border border-[#d6b36a]/60 bg-[#0b0e13]/95 px-10 py-8 text-center shadow-2xl">
            <div className="text-xs font-bold tracking-[0.35em] text-[#d6b36a]">QUEST COMPLETE</div>
            <div className="mt-3 text-4xl font-black tracking-tight text-white">
              +{rewardPopup.xp} XP
            </div>
            <div className="mt-2 text-lg font-bold tracking-[0.2em] text-[#d6b36a]">
              +{rewardPopup.gold} GOLD
            </div>
          </div>
        </div>
      )}
      {/* =========================================================
          GLOBAL ATMOSPHERE
      ========================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(213,154,58,.16), transparent 34%), radial-gradient(circle at 90% 70%, rgba(60,110,120,.08), transparent 35%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#05070a_100%)]" />
      </div>

      {/* =========================================================
          SIDEBAR
      ========================================================== */}
      <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[250px] border-r border-white/[0.07] bg-[#06090d]/95 backdrop-blur-2xl lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-[86px] items-center gap-4 border-b border-white/[0.07] px-7">
          <div className="relative flex h-11 w-11 items-center justify-center">
            <div className="absolute inset-0 rotate-45 border border-[#d9a441]" />
            <div className="absolute inset-[7px] rotate-45 border border-[#d9a441]/30" />
            <span className="relative text-lg font-black text-[#e4ad4d]">
              A
            </span>
          </div>

          <div>
            <div className="text-[18px] font-black tracking-[0.25em]">
              ASCEND
            </div>
            <div className="mt-1 text-[8px] tracking-[0.28em] text-white/35">
              REAL LIFE. HIGHER LEVEL.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">
          <div className="mb-4 px-4 text-[9px] font-bold tracking-[0.25em] text-white/20">
            YOUR JOURNEY
          </div>

          {[
            ["Home", "⌂"],
            ["Missions", "◎"],
            ["World", "◉"],
            ["Avatar", "♙"],
            ["Armory", "◇"],
            ["Map", "△"],
            ["Shop", "□"],
          ].map(([name, icon]) => (
            <button
              key={name}
              onClick={() => setActiveNav(name)}
              className={`relative mb-1 flex w-full items-center gap-4 px-4 py-3.5 text-left text-sm transition ${
                activeNav === name
                  ? "bg-gradient-to-r from-[#d9a441]/15 to-transparent text-[#f3ca77]"
                  : "text-white/45 hover:bg-white/[0.025] hover:text-white"
              }`}
            >
              {activeNav === name && (
                <span className="absolute bottom-0 left-0 top-0 w-[2px] bg-[#d9a441] shadow-[0_0_14px_rgba(217,164,65,.8)]" />
              )}

              <span
                className={`text-xl ${
                  activeNav === name ? "text-[#e2ad4e]" : "text-white/35"
                }`}
              >
                {icon}
              </span>

              <span className="font-medium">{name}</span>

              {name === "Missions" && (
                <span className="ml-auto text-[9px] text-white/25">03</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom user */}
        <div className="border-t border-white/[0.07] p-4">
          <div className="flex items-center gap-3 border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9a441]/50 bg-[#17130b] text-sm font-bold text-[#e8b75b]">
              P
            </div>

            <div className="min-w-0">
              <div className="truncate text-xs font-bold">Ascender</div>
              <div className="mt-1 text-[9px] tracking-wider text-white/30">
                ASCENSION · LV 12
              </div>
            </div>

            <button className="ml-auto text-white/25 transition hover:text-white">
              ⚙
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================== */}
      <div className="relative z-10 min-h-screen lg:ml-[250px]">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 flex h-[70px] items-center justify-between border-b border-white/[0.07] bg-[#05070a]/75 px-5 backdrop-blur-xl lg:px-9">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center border border-[#d9a441] text-sm font-black text-[#d9a441]">
              A
            </div>
            <span className="text-sm font-black tracking-[0.22em]">
              ASCEND
            </span>
          </div>

          <div className="hidden text-[10px] tracking-[0.2em] text-white/25 lg:block">
            WORLD / THE ASCENSION
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Streak */}
            <div className="hidden items-center gap-3 border-r border-white/10 pr-5 sm:flex">
              <span className="text-[#f1a64b]">♨</span>
              <div>
                <div className="text-xs font-bold">7</div>
                <div className="text-[8px] tracking-wider text-white/25">
                  STREAK
                </div>
              </div>
            </div>

            {/* Ember */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#d9a441]">◆</span>
              <span className="text-xs font-bold">1,240</span>
              <span className="hidden text-[8px] tracking-widest text-white/25 sm:block">
                EMBER
              </span>
            </div>

            {/* XP */}
            <div className="hidden items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 md:flex">
              <span className="text-[9px] font-bold text-white/35">
                XP
              </span>

              <div className="h-[3px] w-20 overflow-hidden bg-white/10">
                <div className="h-full w-[79%] bg-[#d9a441]" />
              </div>

              <span className="text-[9px] text-white/40">
                2,840 / 3,600
              </span>
            </div>

            <button className="text-lg text-white/50 hover:text-white">
              ♧
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9a441]/50 bg-[#11100c] text-xs font-bold">
              P
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-9 lg:py-9">
          {/* =====================================================
              HERO
          ====================================================== */}
          <section className="relative min-h-[390px] overflow-hidden border border-white/[0.08]">
            {/* Cinematic background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=90')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/75 to-[#05070a]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-[#05070a]/10" />

            {/* Hero content */}
            <div className="relative z-10 flex min-h-[390px] flex-col justify-between p-7 lg:p-11">
              <div>
                <div className="mb-4 flex items-center gap-3 text-[9px] font-bold tracking-[0.28em] text-[#e1ad51]">
                  <span className="h-px w-8 bg-[#d9a441]" />
                  DAY 18 · SATURDAY, SEPTEMBER 12
                </div>

                <h1 className="max-w-[680px] text-4xl font-black leading-[0.94] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                  GOOD MORNING,
                  <br />
                  <span className="text-[#e3b158]">ASCENDER.</span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                  Discipline today builds the freedom you want tomorrow.
                </p>
              </div>

              {/* Objective */}
              <div className="mt-10 max-w-[850px] border-l-2 border-[#d9a441] bg-black/35 p-5 backdrop-blur-md lg:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div className="hidden h-14 w-14 shrink-0 items-center justify-center border border-[#d9a441]/40 bg-[#d9a441]/10 text-2xl text-[#e5b253] sm:flex">
                      ✦
                    </div>

                    <div>
                      <div className="mb-2 inline-block bg-[#d9a441] px-2 py-1 text-[8px] font-black tracking-[0.18em] text-black">
                        TODAY&apos;S OBJECTIVE
                      </div>

                      <h2 className="text-2xl font-black">
                        Build Your Focus
                      </h2>

                      <p className="mt-1 text-xs text-white/45">
                        Complete 2 deep work sessions to strengthen your
                        Discipline and Intelligence.
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        {[true, false, false, false].map((done, i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-14 ${
                              done ? "bg-[#e1ad51]" : "bg-white/15"
                            }`}
                          />
                        ))}

                        <span className="ml-2 text-[9px] text-white/35">
                          1 / 2
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="flex shrink-0 items-center justify-center gap-3 bg-[#e5b455] px-6 py-4 text-xs font-black tracking-wider text-black transition hover:bg-[#f0c36b]">
                    VIEW DETAILS
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              MISSIONS
          ====================================================== */}
          <section className="mt-9">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="text-[9px] font-black tracking-[0.28em] text-[#d9a441]">
                  ACTIVE MISSIONS
                </div>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  Choose your next move.
                </h2>
              </div>

              <div className="text-[9px] tracking-[0.15em] text-white/25">
                3 / 5 COMPLETED TODAY
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {quests.map((mission, index) => {
                const active = startedMission === mission.title;

                return (
                  <article
                    key={mission.title}
                    className={`group relative overflow-hidden border transition duration-500 ${
                      active
                        ? "border-[#d9a441]/70"
                        : "border-white/[0.08] hover:border-[#d9a441]/40"
                    }`}
                  >
                    {/* Mission image */}
                    <div className="relative h-52 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url('${mission.image}')`,
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d] via-[#080a0d]/30 to-transparent" />

                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/45 text-lg backdrop-blur">
                        {index === 0 ? "✦" : index === 1 ? "◈" : "◉"}
                      </div>

                      <div className="absolute bottom-4 left-5">
                        <div className="mb-2 text-[8px] font-black tracking-[0.2em] text-[#e0ae51]">
                          {mission.stat}
                        </div>
                        <h3 className="text-2xl font-black">
                          {mission.title}
                        </h3>
                      </div>
                    </div>

                    {/* Mission details */}
                    <div className="bg-[#0b0d10] p-5">
                      <p className="min-h-[40px] text-xs leading-5 text-white/45">
                        {mission.description}
                      </p>

                      <div className="mt-5 flex items-center gap-4 border-t border-white/[0.07] pt-4">
                        <div className="flex items-center gap-2 text-[9px] text-white/35">
                          <span>◷</span>
                          {mission.duration}
                        </div>

                        <div className="text-[9px] font-bold text-[#d9a441]">
                          ◆ {mission.reward} ASCENSION
                        </div>

                        <div className="ml-auto text-[9px] text-white/35">
                          {mission.bonus}
                        </div>
                      </div>

                      <button
                        onClick={() => { if (active) { completeQuest(mission._id); } else { setStartedMission(mission.title); } }}
                        className={`mt-5 w-full py-3.5 text-[10px] font-black tracking-[0.18em] transition ${
                          active
                            ? "bg-[#d9a441] text-black"
                            : "border border-white/15 text-white/65 hover:border-[#d9a441]/60 hover:text-[#e7b65d]"
                        }`}
                      >
                        {active ? "MISSION ACTIVE  ✓" : "START MISSION  →"}
                      </button>

                      {active && (
                        <div className="mt-3 border border-[#d9a441]/20 bg-[#d9a441]/[0.04] p-3 text-[10px] leading-5 text-white/45">
                          Your run has started. Complete the real-world
                          activity, then return to ASCEND to claim your
                          reward.
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* =====================================================
              WORLD
          ====================================================== */}
          <section className="relative mt-12 overflow-hidden border border-white/[0.08]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1800&q=85')",
              }}
            />

            <div className="absolute inset-0 bg-[#080b0d]/75" />

            <div className="relative z-10 p-6 lg:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="text-[9px] font-black tracking-[0.3em] text-[#d9a441]">
                    YOUR WORLD
                  </div>
                  <h2 className="mt-2 text-2xl font-black">
                    Progress builds your realm.
                  </h2>
                </div>

                <div className="text-xs text-white/35">
                  3 OF 6 REALMS DISCOVERED
                </div>
              </div>

              {/* World path */}
              <div className="relative mt-10">
                <div className="absolute left-[7%] right-[7%] top-8 hidden h-px bg-white/10 md:block" />

                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
                  {worldStages.map((stage, index) => (
                    <div
                      key={stage.name}
                      className="relative flex flex-col items-center text-center"
                    >
                      <div
                        className={`relative z-10 flex h-16 w-16 items-center justify-center border ${
                          stage.unlocked
                            ? "border-[#d9a441] bg-[#18140b] text-[#e2ad50] shadow-[0_0_30px_rgba(217,164,65,.12)]"
                            : "border-white/10 bg-[#090b0d] text-white/15"
                        }`}
                      >
                        <span className="text-xl">{stage.icon}</span>

                        {!stage.unlocked && (
                          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#121519] text-[9px]">
                            🔒
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-3 text-xs font-bold ${
                          stage.unlocked
                            ? "text-white"
                            : "text-white/25"
                        }`}
                      >
                        {stage.name}
                      </div>

                      <div className="mt-1 text-[9px] tracking-wider text-white/25">
                        LEVEL {stage.level}
                      </div>

                      {stage.unlocked && index === 2 && (
                        <div className="mt-2 text-[8px] font-bold tracking-wider text-[#d9a441]">
                          CURRENT
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              LOWER SECTION
          ====================================================== */}
          <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.45fr]">
            {/* Avatar */}
            <div className="relative min-h-[420px] overflow-hidden border border-white/[0.08] bg-[#090c10]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-[#07090c]/70 to-transparent" />

              <div className="relative z-10 flex min-h-[420px] flex-col justify-between p-7">
                <div>
                  <div className="text-[9px] font-black tracking-[0.3em] text-[#d9a441]">
                    YOUR AVATAR
                  </div>

                  <div className="mt-3 text-3xl font-black">
                    The Wanderer
                  </div>

                  <div className="mt-2 text-xs text-white/40">
                    Focused · Resilient · Evolving
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-[9px] tracking-[0.25em] text-white/30">
                    ASCENSION 12
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-1 flex-1 bg-white/10">
                      <div className="h-full w-[79%] bg-[#d9a441]" />
                    </div>

                    <span className="text-[10px] text-white/40">
                      79%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Abilities */}
            <div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[9px] font-black tracking-[0.3em] text-[#d9a441]">
                    ABILITIES
                  </div>

                  <h2 className="mt-2 text-2xl font-black">
                    What you&apos;re becoming.
                  </h2>
                </div>

                <button className="text-[9px] font-bold tracking-wider text-[#d9a441] hover:text-[#f1c36d]">
                  VIEW ALL →
                </button>
              </div>

              <div className="mt-8 space-y-6">
                {abilities.map((ability) => (
                  <div key={ability.short}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center border border-white/10 bg-white/[0.02] text-[8px] font-black text-[#d9a441]">
                          {ability.short}
                        </div>

                        <span className="text-xs font-semibold">
                          {ability.name}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-white/50">
                        {ability.value}
                      </span>
                    </div>

                    <div className="h-[4px] bg-white/[0.07]">
                      <div
                        className="h-full bg-gradient-to-r from-[#a97829] to-[#e5b65e]"
                        style={{ width: `${ability.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Unlock */}
              <div className="relative mt-10 overflow-hidden border border-white/[0.08] bg-[#0a0d10] p-5">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#d9a441]/10 blur-3xl" />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="h-16 w-20 overflow-hidden border border-white/10">
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=500&q=80')",
                      }}
                    />
                  </div>

                  <div>
                    <div className="text-[8px] font-black tracking-[0.25em] text-white/30">
                      NEXT UNLOCK
                    </div>

                    <div className="mt-1 text-sm font-black">
                      The Library
                    </div>

                    <div className="mt-1 text-[10px] text-white/35">
                      Reach Discipline 90
                    </div>
                  </div>

                  <div className="ml-auto text-white/20">🔒</div>
                </div>
              </div>

              <div className="mt-8 border-l border-[#d9a441]/40 pl-5">
                <p className="max-w-md text-sm italic leading-6 text-white/35">
                  “You don&apos;t find yourself by chance. You build yourself
                  by choice.”
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <footer className="mt-16 flex flex-col justify-between gap-3 border-t border-white/[0.07] py-8 text-[8px] tracking-[0.25em] text-white/20 sm:flex-row">
            <span>ASCEND · REAL LIFE. HIGHER LEVEL.</span>
            <span>YOUR LIFE. YOUR QUEST. YOUR EVOLUTION.</span>
          </footer>
        </div>
      </div>

      {/* =========================================================
          MOBILE NAV
      ========================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-white/[0.08] bg-[#07090c]/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        {[
          ["Home", "⌂"],
          ["Missions", "◎"],
          ["World", "◉"],
          ["Avatar", "♙"],
          ["Shop", "□"],
        ].map(([name, icon]) => (
          <button
            key={name}
            onClick={() => setActiveNav(name)}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[8px] ${
              activeNav === name
                ? "text-[#e4b35b]"
                : "text-white/35"
            }`}
          >
            <span className="text-lg">{icon}</span>
            {name}
          </button>
        ))}
      </div>
    </main>
  );
}















