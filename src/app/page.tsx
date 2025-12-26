"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { runOffice } from "@/lib/engine/orchestrator";
import type { Scenario } from "@/lib/contracts/scenario";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type CharacterId =
  | "ceo"
  | "clinical"
  | "cs"
  | "ops"
  | "marketing"
  | "sales"
  | "accounting";

type Character = {
  id: CharacterId;
  name: string;
  title: string;
  tagline: string;
  img: string;
};

const CHARACTERS: Character[] = [
  {
    id: "ceo",
    name: "CEO",
    title: "The decider",
    tagline: "Wants certainty. In an uncertain universe. Cute.",
    img: "/lego/ceo.png",
  },
  {
    id: "clinical",
    name: "Clinical",
    title: "The guardrail",
    tagline: "Compliance first. Always. No compromises.",
    img: "/lego/clinical.png",
  },
  {
    id: "cs",
    name: "Customer Success",
    title: "The empath",
    tagline: "Feels the pain. Translates it into action.",
    img: "/lego/cs.png",
  },
  {
    id: "ops",
    name: "Operations",
    title: "The firefighter",
    tagline: "Ships fixes. Breaks things. Learns. Repeats.",
    img: "/lego/ops.png",
  },
  {
    id: "marketing",
    name: "Marketing",
    title: "The megaphone",
    tagline: "Wants to spend more. Always. No notes.",
    img: "/lego/marketing.png",
  },
  {
    id: "sales",
    name: "Sales",
    title: "The pusher",
    tagline: "Optimistic. Discount-friendly. Fearless.",
    img: "/lego/sales.png",
  },
  {
    id: "accounting",
    name: "Accounting",
    title: "The leash",
    tagline: "Hates surprises. Loves receipts.",
    img: "/lego/accounting.png",
  },
];

function byId(id: CharacterId) {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown character: ${id}`);
  return c;
}

export default function Page() {
  const [step, setStep] = useState<Step>(0);
  const [variant, setVariant] = useState<"A" | "B">("A");

  const scenario: Scenario = useMemo(() => {
  const isA = variant === "A";

  return {
    id: "ai-backoffice-team",
    title: "AI Backoffice Team — Imperfect by Design",
    backlogCS: isA ? 420 : 120,
    monthlyBudget: isA ? 60000 : 45000,
    constraints: {
      complianceStrict: true,
      discountCap: isA ? 0.15 : 0.05, // B = VIPs asking for shortcuts → keep cap tight
    },
    freeText: isA
      ? "Support backlog is exploding. Doctors complain about response times. Team is overloaded. We need triage, automation, and a realistic plan."
      : "VIP doctors are escalating a clinical issue and want a shortcut. We must protect compliance and patient safety while offering a workable path forward.",
  };
}, [variant]);


  const result = useMemo(() => {
    // Only run the orchestrator after Panel 2 is shown
    if (step < 2) return null;
    return runOffice(scenario);
  }, [scenario, step]);

  const office = useMemo(() => officeStatus(result), [result]);

  return (
  <main className="min-h-screen bg-slate-50 text-slate-900">
    <CinematicStyles />

    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-700">
            <span className="font-semibold">Project:</span>
            <span>AI Backoffice Team (Multi-Agent)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            A whole “office” of AI agents…
            <span className="block text-slate-600 font-semibold">
              and the cracks start showing.
            </span>
          </h1>
          <p className="max-w-2xl text-slate-700">
            This is a narrative demo: an AI-led backoffice tries to make a
            decision under pressure. You’ll see coordination, misalignment,
            policy risks, and the point where humans must step in.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="rounded-2xl border bg-white px-4 py-3">
            <div className="text-xs text-slate-500">Office Status</div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: office.color }}
              />
              <span className="font-semibold">{office.label}</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">{office.hint}</div>
          </div>
        </div>
      </header>

      <div className="mt-8 rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
        {/* Panels */}
        {step === 0 && <Panel0_Team />}
        {step === 1 && (
          <Panel1_Situation variant={variant} setVariant={setVariant} />
        )}
        {step === 2 && (
          <Panel2_EveryoneTalks result={result} variant={variant} />
        )}
        {step === 3 && <Panel3_Clash result={result} />}
        {step === 4 && <Panel4_TrafficLight office={office} />}
        {step === 5 && <Panel5_CEO result={result} />}
        {step === 6 && <Panel6_Finale result={result} />}

        {/* Controls */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(0)}
              className="rounded-xl border px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              disabled={step === 0}
            >
              Back to start
            </button>

            <button
              onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
              className="rounded-xl border px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
              disabled={step === 0}
            >
              Back
            </button>

            <button
              onClick={() => setStep((s) => (s < 6 ? ((s + 1) as Step) : s))}
              className="rounded-xl bg-slate-900 text-white px-5 py-2 hover:bg-slate-800 disabled:opacity-50"
              disabled={step === 6}
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="inline-flex items-center gap-2">
              <span className="font-semibold">Panel:</span>
              <span>{step + 1} / 7</span>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-6 rounded-full ${
                    i <= step ? "bg-slate-900" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-xs text-slate-500">
        Built as a portfolio narrative: coordination is impressive — but the
        “human layer” is still mandatory.
      </footer>
    </div>
  </main>
);
}

/* ======================================================
   Panels
====================================================== */

function Panel0_Team() {
  return (
    <div className="space-y-6 cin-fadeUp">
      <Title
        kicker="Panel 1"
        title="Meet the characters"
        subtitle="An AI backoffice. Seven personalities (and 7 different goals)."
        directorLine="Casting call: everyone’s brilliant… and everyone’s biased."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHARACTERS.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border bg-slate-50/60 p-4 flex gap-4 items-center"
          >
            <Avatar charId={c.id} size={64} />
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-slate-600">{c.title}</div>
              <div className="text-xs text-slate-500 mt-1 italic">
                “{c.tagline}”
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <p className="text-slate-700">
          In the next panels, each screen has a “narrator” avatar on the side.
          It’s not decoration: it signals which mindset is dominating the scene.
        </p>
      </div>
    </div>
  );
}

function Panel1_Situation(props: {
  variant: "A" | "B";
  setVariant: (v: "A" | "B") => void;
}) {
  const { variant, setVariant } = props;

  return (
    <PanelWithAvatar
      charId="ops"
      side="left"
      note="Reality check: the inbox doesn’t care about your roadmap."
    >
      <div className="space-y-6">
        <Title
          kicker="Panel 2"
          title="Then reality hits"
          subtitle="Support is drowning. The inbox is screaming."
          directorLine="Open on chaos. Everyone pretends this is fine."
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setVariant("A")}
            className={`rounded-xl border px-5 py-3 ${
              variant === "A" ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
            }`}
          >
            Situation A
          </button>
          <button
            onClick={() => setVariant("B")}
            className={`rounded-xl border px-5 py-3 ${
              variant === "B" ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
            }`}
          >
            Situation B
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <div className="text-lg font-semibold">
            {variant === "A"
              ? "Support backlog is exploding."
              : "VIP doctors are escalating a clinical issue. They want a shortcut."}
          </div>
          <div className="text-slate-600 mt-1">
            {variant === "A"
              ? "People are waiting. Everyone’s stressed."
              : "They’re basically asking: ‘Can you bend the rules… just this once?’"}
          </div>
        </div>
      </div>
    </PanelWithAvatar>
  );
}

function Panel2_EveryoneTalks(props: { result: any; variant: "A" | "B" }) {
  const { result, variant } = props;

  const marketingLine =
    pickAgentSummary(result, "Marketing") ??
    "Let’s increase the budget to boost the pipeline!";
  const salesLine =
    pickAgentSummary(result, "Sales") ?? "Discounts fix everything. Trust me bro.";
  const accountingLine =
    pickAgentSummary(result, "Accounting") ??
    "Wait. We need to freeze non-essential spend.";

  const clinicalLine =
    variant === "B"
      ? "Nope. If it’s not compliant, it’s not happening."
      : "Keep it clean. No risky claims, no shortcuts.";

  const csLine =
    pickAgentSummary(result, "Customer Success") ??
    (variant === "A"
      ? "We need triage and a clear SLA. People are burning out."
      : "Doctors want speed. Patients still need safety. We need a real plan.");

  const opsLine =
    pickAgentSummary(result, "Operations") ??
    (variant === "A"
      ? "We can automate the top 3 ticket types. But not overnight."
      : "We can patch a workflow, but clinical policy can’t be hand-waved.");

  return (
    <PanelWithAvatar
      charId="ceo"
      side="right"
      note="Everybody talks. The CEO tries to keep it from becoming a musical."
    >
      <div className="space-y-6">
        <Title
          kicker="Panel 3"
          title="The whole office talks at once"
          subtitle="Each agent optimizes for its own KPI. Coordination is… aspirational."
          directorLine="Cut to the meeting. Six voices. Zero ownership."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SpeechCard charId="marketing" text={marketingLine} />
          <SpeechCard charId="sales" text={salesLine} />
          <SpeechCard charId="accounting" text={accountingLine} />
          <SpeechCard charId="clinical" text={clinicalLine} />
          <SpeechCard charId="cs" text={csLine} />
          <SpeechCard charId="ops" text={opsLine} />
        </div>

        <div className="rounded-2xl border bg-slate-50/60 p-5">
          <p className="text-slate-700">
            A “team of AI agents” can generate ideas fast — but it can also
            generate contradictions fast. Humans are still the only reliable
            conflict-resolution layer.
          </p>
        </div>
      </div>
    </PanelWithAvatar>
  );
}

function Panel3_Clash(props: { result: any }) {
  const { result } = props;
  const conflicts = (result?.conflicts ?? []).slice(0, 3);

  return (
    <PanelWithAvatar
      charId="accounting"
      side="left"
      note="Trade-offs are just arguments wearing spreadsheets."
    >
      <div className="space-y-6">
        <Title
          kicker="Panel 4"
          title="Decision clash"
          subtitle="When good ideas crash into each other."
          directorLine="The meeting ends. The arguing begins."
        />

        <div className="rounded-2xl border bg-white p-5">
          <div className="font-semibold text-slate-900">
            What the orchestrator detected
          </div>
          <div className="text-sm text-slate-600 mt-1">
            A simple conflict extractor: budget vs speed vs compliance vs satisfaction.
          </div>

          <div className="mt-4 space-y-3">
            {conflicts.length ? (
              conflicts.map((c: any, i: number) => (
                <div key={i} className="rounded-xl border bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{toHumanConflict(c)}</div>
                    <SeverityPill severity={c?.severity ?? "medium"} />
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Actors: {prettyActors(c?.actors)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-600">
                No explicit conflicts extracted (either because the run didn’t return them
                or because the scenario was mild). In a real system, this is where you’d
                increase observability.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-50/60 p-5">
          <p className="text-slate-700">
            Even when every agent is “smart,” the system can be dumb as a whole.
            Intelligence doesn’t automatically compose.
          </p>
        </div>
      </div>
    </PanelWithAvatar>
  );
}

function Panel4_TrafficLight(props: { office: OfficeStatus }) {
  const { office } = props;

  return (
    <PanelWithAvatar
      charId="clinical"
      side="right"
      note="If it’s not compliant, it’s not shipping."
    >
      <div className="space-y-6 text-center">
        <Title
          kicker="Panel 5"
          title="The big traffic light"
          subtitle="The system tries to decide… and then panics."
          directorLine="A single light tries to summarize a messy reality."
        />

        <div className="mx-auto max-w-xl rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-center gap-3">
            <span
              className="inline-block h-6 w-6 rounded-full"
              style={{ background: office.color }}
            />
            <div className="text-2xl font-bold">{office.label}</div>
          </div>
          <div className="text-slate-600 mt-2">{office.hint}</div>

          <div className="mt-5 text-left rounded-2xl border bg-slate-50/60 p-5">
            <div className="font-semibold">Interpretation</div>
            <div className="text-sm text-slate-700 mt-1">
              <p>
                <span className="font-semibold">GO:</span> Low risk + aligned. Automate.
              </p>
              <p className="mt-2">
                <span className="font-semibold">NEEDS HUMAN:</span> Conflicts or uncertainty.
                Human review + policy guardrails.
              </p>
              <p className="mt-2">
                <span className="font-semibold">STOP:</span> Policy blockers or unsafe shortcuts.
                Escalate immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PanelWithAvatar>
  );
}

function Panel5_CEO(props: { result: any }) {
  const { result } = props;

  const ceoSummary =
    pickAgentSummary(result, "CEO") ??
    "We need a decision: align to policy, protect patients, and unblock support.";

  const postMortem = toHumanPostMortem(result);

  return (
    <PanelWithAvatar
      charId="ceo"
      side="left"
      note="Decision time. Accountability has entered the chat."
    >
      <div className="space-y-6">
        <Title
          kicker="Panel 6"
          title="CEO decision & post-mortem"
          subtitle="A single-owner model can be fast… and dangerously confident."
          directorLine="Close-up on the decider. Everyone else suddenly goes quiet."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5">
            <div className="flex items-center gap-3">
              <Avatar charId="ceo" size={56} />
              <div>
                <div className="font-semibold">CEO summary</div>
                <div className="text-sm text-slate-600">Final call</div>
              </div>
            </div>
            <div className="mt-4">
              <SpeechBubble text={ceoSummary} />
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-50/60 p-5">
            <div className="font-semibold">Post-mortem (human-readable)</div>
            <div className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
              {postMortem}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <div className="font-semibold">Takeaway</div>
          <p className="text-slate-700 mt-2">
            The “AI office” is helpful for generating options, simulating trade-offs, and
            summarizing constraints. But when stakes include policy, safety, and trust,
            you don’t want a model’s confidence — you want a human’s responsibility.
          </p>
        </div>
      </div>
    </PanelWithAvatar>
  );
}

function Panel6_Finale(props: { result: any }) {
  const { result } = props;
  const status = officeStatus(result);

  return (
    <PanelWithAvatar
      charId="cs"
      side="right"
      note="The lesson: AI can help… but it still needs grown-ups."
    >
      <div className="space-y-6">
        <Title
          kicker="Panel 7"
          title="Final note"
          subtitle="Imperfect agents make a great demo — and a risky product."
          directorLine="Fade out: speed is not a substitute for judgment."
        />

        <div className="rounded-2xl border bg-slate-50/60 p-6">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-4 w-4 rounded-full"
              style={{ background: status.color }}
            />
            <div className="font-semibold">Ending status: {status.label}</div>
          </div>
          <p className="text-slate-700 mt-3">
            This project is intentionally built to show imperfections: misalignment, conflicts,
            and unsafe shortcuts. The value is not “AI replaces teams.” The value is “AI makes
            teams faster — when humans stay in the loop.”
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold">What it demonstrates</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>Multi-agent coordination patterns</li>
              <li>Conflict detection + summarization</li>
              <li>Policy guardrails & escalation</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold">What it warns about</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>Overconfident single-owner decisions</li>
              <li>Goal misalignment (KPIs ≠ outcomes)</li>
              <li>“Fast wrong” is worse than slow</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="font-semibold">Real-world next steps</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>Audit logs + observability</li>
              <li>Human approval gates</li>
              <li>Test suites for policies & claims</li>
            </ul>
          </div>
        </div>
      </div>
    </PanelWithAvatar>
  );
}

/* ======================================================
   UI bits
====================================================== */

function Title(props: {
  kicker: string;
  title: string;
  subtitle: string;
  directorLine?: string;
}) {
  return (
    <div className="space-y-2 cin-fadeUp">
      {props.directorLine ? (
        <div className="text-sm text-slate-500 italic">{props.directorLine}</div>
      ) : null}
      <div className="text-xs uppercase tracking-wider text-slate-500">
        {props.kicker}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        {props.title}
      </h2>
      <p className="text-slate-600">{props.subtitle}</p>
    </div>
  );
}

function Avatar(props: { charId: CharacterId; size?: number }) {
  const c = byId(props.charId);
  const size = props.size ?? 72;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border bg-white"
      style={{ width: size, height: size }}
    >
      <Image
        src={c.img}
        alt={`${c.name} avatar`}
        fill
        className="object-cover"
        sizes={`${size}px`}
        priority={false}
      />
    </div>
  );
}

function SpeechCard(props: { charId: CharacterId; text: string }) {
  const c = byId(props.charId);
  return (
    <div className="rounded-2xl border bg-white p-5 cin-fadeUp">
      <div className="flex items-center gap-3">
        <Avatar charId={props.charId} size={56} />
        <div className="min-w-0">
          <div className="font-semibold">{c.name}</div>
          <div className="text-sm text-slate-600">{c.title}</div>
        </div>
      </div>
      <div className="mt-4">
        <SpeechBubble text={props.text} />
      </div>
    </div>
  );
}

function SpeechBubble(props: { text: string }) {
  return (
    <div className="relative rounded-2xl border bg-white p-4 text-slate-800">
      <div className="text-sm md:text-base">{props.text}</div>
      <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t rotate-45" />
    </div>
  );
}

/* ======================================================
   Cinematic layout wrapper
====================================================== */

function PanelWithAvatar(props: {
  charId: CharacterId;
  children: ReactNode;
  side?: "left" | "right";
  note?: string;
}) {
  const { charId, children, side = "left", note } = props;
  const c = byId(charId);

  const avatarCol = (
    <div
      className={`w-full md:w-47.5 shrink-0 ${
        side === "left" ? "cin-left" : "cin-right"
      }`}
    >
      <div className="rounded-2xl border bg-slate-50/60 p-4 flex md:flex-col items-center gap-3">
        <Avatar charId={charId} size={84} />
        <div className="text-center md:text-left">
          <div className="font-semibold leading-tight">{c.name}</div>
          <div className="text-sm text-slate-600">{c.title}</div>
          {note ? (
            <div className="text-xs text-slate-500 mt-2 italic">{note}</div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {side === "left" ? avatarCol : null}
      <div className="min-w-0 flex-1 cin-fadeUp">{children}</div>
      {side === "right" ? avatarCol : null}
    </div>
  );
}

function CinematicStyles() {
  return (
    <style jsx global>{`
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-14px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(14px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .cin-fadeUp {
        animation: fadeUp 420ms ease-out both;
      }
      .cin-left {
        animation: slideInLeft 420ms ease-out both;
      }
      .cin-right {
        animation: slideInRight 420ms ease-out both;
      }
    `}</style>
  );
}

function SeverityPill(props: { severity: string }) {
  const sev = String(props.severity ?? "").toLowerCase();
  const isHigh = sev === "high";
  const isMed = sev === "medium";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isHigh
          ? "bg-red-50 text-red-700 border-red-200"
          : isMed
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200"
      }`}
    >
      {isHigh ? "High" : isMed ? "Medium" : "Low"}
    </span>
  );
}

/* ======================================================
   Logic helpers (human-friendly)
====================================================== */

type OfficeStatus = {
  label: "GO" | "NEEDS HUMAN" | "STOP";
  color: string;
  hint: string;
};

function officeStatus(result: any): OfficeStatus {
  const findings = result?.policyFindings ?? [];
  const conflicts = result?.conflicts ?? [];

  const hasBlockers =
    findings.some((f: any) => String(f?.severity).toLowerCase() === "blocker") ||
    findings.some((f: any) => String(f?.severity).toLowerCase() === "high");

  const hasConflicts = Array.isArray(conflicts) && conflicts.length > 0;

  if (hasBlockers) {
    return {
      label: "STOP",
      color: "#ef4444",
      hint: "Policy blockers detected. Escalate.",
    };
  }

  if (hasConflicts) {
    return {
      label: "NEEDS HUMAN",
      color: "#f59e0b",
      hint: "Conflicts or uncertainty. Human review needed.",
    };
  }

  return {
    label: "GO",
    color: "#22c55e",
    hint: "Low risk + aligned. Safe to proceed.",
  };
}

function pickAgentSummary(result: any, agentName: string): string | null {
  const summaries = result?.agentSummaries ?? result?.summaries ?? [];
  if (!Array.isArray(summaries)) return null;

  const hit = summaries.find((s: any) => {
    const who = String(s?.agent ?? s?.name ?? "").toLowerCase();
    return who.includes(agentName.toLowerCase());
  });

  const txt = hit?.summary ?? hit?.message ?? hit?.text ?? null;
  return txt ? String(txt) : null;
}

function toHumanConflict(c: any): string {
  const label =
    c?.label ?? c?.type ?? "Conflicting objectives detected (no label provided).";
  const detail = c?.detail ?? c?.description ?? "";

  if (detail) return `${String(label)} — ${String(detail)}`;
  return String(label);
}

function prettyActors(actors: any): string {
  if (!actors) return "—";
  if (Array.isArray(actors)) return actors.map(String).join(", ");
  return String(actors);
}

/**
 * One-line “director’s cut” translation.
 * This is the function you referenced, renamed to avoid clashing with the report builder below.
 */
function toHumanPostMortemLine(text: string) {
  const t = String(text ?? "").toLowerCase();

  if (t.includes("overconfidence")) {
    return "Someone sounded super confident… with not much proof.";
  }
  if (t.includes("misalignment")) {
    return "Everyone optimized their own goal. Nobody owned the whole mess.";
  }
  if (t.includes("policy") || t.includes("violation") || t.includes("blocked")) {
    return "A ‘smart’ idea ran into rules. Rules won.";
  }
  if (t.includes("brittle")) {
    return "A tiny wording change made the plan flip. Yikes.";
  }

  return String(text ?? "")
    .replaceAll("Overconfidence detected:", "Overconfidence:")
    .replaceAll("Misalignment:", "People problem:")
    .replaceAll("Policy violation:", "Rules problem:");
}

/**
 * Full report builder (summary + findings + conflicts).
 * This used to be called toHumanPostMortem(text: string) in your snippet,
 * but here it’s intentionally a report, not just a line.
 */
function toHumanPostMortem(result: any): string {
  if (!result) {
    return `No run result available yet.\n\nTip: Click "Next" to trigger the orchestrator.`;
  }

  const findings = result?.policyFindings ?? [];
  const conflicts = result?.conflicts ?? [];
  const rawSummary =
    result?.finalSummary ??
    result?.summary ??
    "No final summary provided by the system.";

  const directorLine = toHumanPostMortemLine(String(rawSummary ?? ""));

  const lines: string[] = [];
  lines.push(`Director’s cut:\n- ${directorLine || "Humans still need to own the decision."}`);
  lines.push(`\nSystem summary:\n- ${String(rawSummary)}`);

  if (Array.isArray(findings) && findings.length) {
    lines.push(`\nPolicy findings:`);
    for (const f of findings.slice(0, 6)) {
      const sev = String(f?.severity ?? "medium");
      const msg = String(f?.message ?? f?.detail ?? JSON.stringify(f));
      lines.push(`- [${sev.toUpperCase()}] ${msg}`);
    }
  } else {
    lines.push(`\nPolicy findings:\n- None reported.`);
  }

  if (Array.isArray(conflicts) && conflicts.length) {
    lines.push(`\nConflicts:`);
    for (const c of conflicts.slice(0, 6)) {
      lines.push(`- ${toHumanConflict(c)}`);
    }
  } else {
    lines.push(`\nConflicts:\n- None reported.`);
  }

  lines.push(
    `\nHuman note:\n- If this were production, you'd add audit logs, tests, and hard approval gates.`
  );

  return lines.join("\n");
}

