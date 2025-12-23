"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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
  title: string; // short role label
  tagline: string; // funny one-liner
  img: string; // /public path
};

const COMPANY = {
  name: "AstraDent MedTech",
  subtitle: "A tiny AI backoffice… with very loud opinions.",
};

const CHARACTERS: Character[] = [
  {
    id: "ceo",
    name: "CEO",
    title: "The final boss",
    tagline: "Signs things. Takes the blame. Sleeps poorly.",
    img: "/lego/ceo.png",
  },
  {
    id: "clinical",
    name: "Clinical Support",
    title: "The picky ones",
    tagline: "Loves rules. Hates shortcuts. Smells risk.",
    img: "/lego/clinical.png",
  },
  {
    id: "cs",
    name: "Customer Success",
    title: "The firefighter",
    tagline: "Keeps users calm. Hates backlog. Drinks coffee.",
    img: "/lego/cs.png",
  },
  {
    id: "ops",
    name: "Operations",
    title: "Reality check",
    tagline: "Capacity is finite. Physics is undefeated.",
    img: "/lego/ops.png",
  },
  {
    id: "marketing",
    name: "Marketing",
    title: "The hype engine",
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
    tagline: "Keeps bills on a leash. Very tight leash.",
    img: "/lego/accounting.png",
  },
];

const byId = (id: CharacterId) => CHARACTERS.find((c) => c.id === id)!;

/* ======================================================
   Scenarios (simple + readable)
====================================================== */

const situationA: Scenario = {
  id: "A",
  title: "Backlog is exploding",
  backlogCS: 120,
  monthlyBudget: 10000,
  constraints: { complianceStrict: true, discountCap: 0.2 },
  freeText: "Support backlog is exploding",
};

const situationB: Scenario = {
  ...situationA,
  id: "B",
  title: "VIP doctors + clinical escalation",
  freeText:
    "A VIP clinic is escalating an urgent clinical issue. They want a quick workaround, even if it’s not fully compliant.",
};

export default function Page() {
  const [step, setStep] = useState<Step>(0);
  const [variant, setVariant] = useState<"A" | "B">("A");

  // CEO “human in the loop”
  const [owner, setOwner] = useState("");
  const [rationale, setRationale] = useState("");
  const [ceoDecision, setCeoDecision] = useState<
    "pending" | "approved" | "changes" | "blocked"
  >("pending");

  const scenario = variant === "A" ? situationA : situationB;

  const result = useMemo(() => runOffice(scenario), [scenario]);
  const office = useMemo(() => officeStatus(result), [result]);

  const needsHuman =
    office.label === "NEEDS HUMAN" || office.label === "STOP";

  const canApprove =
    office.label === "GO" ||
    (office.label === "NEEDS HUMAN" &&
      owner.trim().length > 0 &&
      rationale.trim().length > 0);

  // navigation
  const isLast = step === 6;
  const canBack = step > 0;

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Soft header / “comic cover” */}
        <header className="rounded-2xl border bg-white/70 backdrop-blur p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{COMPANY.name}</h1>
              <p className="text-slate-600 mt-1">{COMPANY.subtitle}</p>
            </div>

            {/* tiny progress */}
            <div className="text-sm text-slate-500">
              Panel <span className="font-semibold">{step + 1}</span> / 7
            </div>
          </div>
        </header>

        {/* PANEL */}
        <section className="rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
          {step === 0 && <Panel0_Team />}
          {step === 1 && (
            <Panel1_Situation
              variant={variant}
              setVariant={setVariant}
            />
          )}
          {step === 2 && <Panel2_EveryoneTalks result={result} variant={variant} />}
          {step === 3 && <Panel3_Clash result={result} />}
          {step === 4 && <Panel4_TrafficLight office={office} />}
          {step === 5 && (
            <Panel5_CEO
              office={office}
              owner={owner}
              setOwner={setOwner}
              rationale={rationale}
              setRationale={setRationale}
              ceoDecision={ceoDecision}
              setCeoDecision={setCeoDecision}
              canApprove={canApprove}
              needsHuman={needsHuman}
            />
          )}
          {step === 6 && <Panel6_Finale result={result} />}
        </section>

        {/* NAV */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
            disabled={!canBack}
            className={`rounded-xl border px-4 py-2 ${
              canBack ? "hover:bg-slate-50" : "opacity-40"
            }`}
          >
            Back
          </button>

          {isLast ? (
            <button
              onClick={() => {
                setStep(0);
                setCeoDecision("pending");
                setOwner("");
                setRationale("");
              }}
              className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-50"
            >
              Back to the start
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => ((s + 1) as Step))}
              className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-50"
            >
              Next
            </button>
          )}
        </div>

      </div>
    </main>
  );
}

/* ======================================================
   Panels (comic style)
====================================================== */

function Panel0_Team() {
  return (
    <div className="space-y-6">
      <Title
        kicker="Panel 1"
        title="Meet the characters"
        subtitle="An AI backoffice. Seven personalities (and 7 different goals)."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHARACTERS.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border p-4 bg-slate-50/60"
          >
            <div className="flex items-center gap-3">
              <Avatar charId={c.id} size={56} />
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-slate-600">
                  {c.title}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-700">
              <span className="font-semibold">Tagline:</span> {c.tagline}
            </div>
          </div>
        ))}
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
    <div className="space-y-6">
      <Title
        kicker="Panel 2"
        title="Then reality hits"
        subtitle="Support is drowning. The inbox is screaming."
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
  );
}

function Panel2_EveryoneTalks(props: { result: any; variant: "A" | "B" }) {
  const { result, variant } = props;

  const marketingLine =
    pickAgentSummary(result, "Marketing") ??
    "Let’s increase the budget to boost the pipeline!";
  const salesLine =
    pickAgentSummary(result, "Sales") ??
    "Discounts fix everything. Trust me bro.";
  const accountingLine =
    pickAgentSummary(result, "Accounting") ??
    "Wait, guys. We need to freeze non-essential spend.";

  // Clinical: different line depending on scenario
  const clinicalLine =
    variant === "B"
      ? "Nope. If it’s not compliant, it’s not happening."
      : "Keep it clean. No risky claims, no shortcuts.";

  return (
    <div className="space-y-6">
      <Title
        kicker="Panel 3"
        title="Everyone talks at once"
        subtitle="Individually smart. Collectively… a group project."
      />

      <div className="grid gap-5 lg:grid-cols-4">
        <SpeechCard
          charId="marketing"
          speaker="Marketing"
          bubble={toComic(marketingLine, "Marketing")}
        />
        <SpeechCard
          charId="sales"
          speaker="Sales"
          bubble={toComic(salesLine, "Sales")}
        />
        <SpeechCard
          charId="accounting"
          speaker="Accounting"
          bubble={toComic(accountingLine, "Accounting")}
        />
        <SpeechCard
          charId="clinical"
          speaker="Clinical Support"
          bubble={clinicalLine}
        />
      </div>

      <div className="text-sm text-slate-600 italic">
        Nobody is “wrong”. That’s the trap.
      </div>
    </div>
  );
}


function Panel3_Clash(props: { result: any }) {
  const { result } = props;

  // Pick up to 2-3 conflicts and translate them into human speak.
  const conflicts = (result.conflicts ?? []).slice(0, 3);

  return (
    <div className="space-y-6">
      <Title
        kicker="Panel 4"
        title="Decision clash"
        subtitle="When good ideas crash into each other"
      />

      {conflicts.length === 0 ? (
        <div className="rounded-2xl border bg-slate-50 p-5">
          Rare moment: no visible clash. Enjoy it. It won’t last.
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((c: any, idx: number) => (
            <div key={idx} className="rounded-2xl border p-5 bg-white">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="font-semibold text-lg">
                  {prettyActors(c.actors)}
                </div>
                <SeverityPill severity={c.severity} />
              </div>
              <div className="text-sm whitespace-pre-line">
                {c.description}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border bg-slate-50 p-5">
        <div className="font-semibold">Comic translation:</div>
        <div className="text-slate-700">
          “Great ideas… that collide in real life.”
        </div>
      </div>
    </div>
  );
}

function Panel4_TrafficLight(props: { office: OfficeStatus }) {
  const { office } = props;

  return (
    <div className="space-y-6 text-center">
      <Title
        kicker="Panel 5"
        title="The big traffic light"
        subtitle="The system tries to decide… and then panics."
      />

      <div className="flex justify-center">
        <div className={`rounded-2xl px-8 py-5 text-white ${office.color}`}>
          <div className="text-3xl font-bold">{office.label}</div>
          <div className="opacity-90 mt-1">{office.hint}</div>
        </div>
      </div>

      <div className="text-slate-600">
        If it’s not <span className="font-semibold">GO</span>, we need a human brain.
        An accountable one.
      </div>
    </div>
  );
}

function Panel5_CEO(props: {
  office: OfficeStatus;
  owner: string;
  setOwner: (v: string) => void;
  rationale: string;
  setRationale: (v: string) => void;
  ceoDecision: "pending" | "approved" | "changes" | "blocked";
  setCeoDecision: (v: "pending" | "approved" | "changes" | "blocked") => void;
  canApprove: boolean;
  needsHuman: boolean;
}) {
  const {
    office,
    owner,
    setOwner,
    rationale,
    setRationale,
    ceoDecision,
    setCeoDecision,
    canApprove,
    needsHuman,
  } = props;

  return (
    <div className="space-y-6">
      <Title
        kicker="Panel 6"
        title="The approval (or not)"
        subtitle="Someone has to own the consequences."
      />

      <div className="rounded-2xl border bg-slate-50 p-5 flex items-start gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Avatar charId="ceo" size={68} />
          <div>
            <div className="font-semibold text-lg">CEO</div>
            <div className="text-slate-600">“Alright. Who’s signing this?”</div>
          </div>
        </div>

        <div className="ml-auto text-right">
          <div className={`inline-block rounded-xl px-3 py-1 text-white ${office.color}`}>
            {office.label}
          </div>
          <div className="text-xs text-slate-500 mt-1">{office.hint}</div>
        </div>
      </div>

      {needsHuman && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Who owns this decision?
            </label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g., Head of Compliance"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Why are we doing this?
            </label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Short, honest rationale"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          disabled={!canApprove}
          onClick={() => setCeoDecision("approved")}
          className={`rounded-xl border px-5 py-3 ${
            canApprove ? "font-semibold hover:bg-white" : "opacity-40"
          }`}
        >
          Approve
        </button>
        <button
          onClick={() => setCeoDecision("changes")}
          className="rounded-xl border px-5 py-3 hover:bg-white"
        >
          Ask for changes
        </button>
        <button
          onClick={() => setCeoDecision("blocked")}
          className="rounded-xl border px-5 py-3 hover:bg-white"
        >
          Block
        </button>
      </div>

      <div className="text-slate-700">
        <span className="font-semibold">CEO decision:</span>{" "}
        {ceoDecision.toUpperCase()}
      </div>
    </div>
  );
}

function Panel6_Finale(props: { result: any }) {
  const { result } = props;
  const lines: string[] = (result.postMortem ?? []).slice(0, 4);

  return (
    <div className="space-y-6">
      <Title
        kicker="Panel 7"
        title="What went wrong (and why)"
        subtitle="The moral of the story: smart ≠ accountable."
      />

      <div className="rounded-2xl border bg-white p-5">
        <div className="font-semibold">Quick recap:</div>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
          {lines.length === 0 ? (
            <li>No issues detected (suspiciously lucky day).</li>
          ) : (
            lines.map((l, i) => <li key={i}>{toHumanPostMortem(l)}</li>)
          )}
        </ul>
      </div>

      <div className="rounded-2xl border bg-slate-50 p-5">
        <div className="text-xl font-semibold">Why humans still matter</div>
        <div className="text-slate-700 mt-2 space-y-1">
          <div>• AI suggests.</div>
          <div>• Rules constrain.</div>
          <div>• Trade-offs hurt someone.</div>
          <div className="font-semibold">• Humans take responsibility.</div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   UI Bits
====================================================== */

function Title(props: { kicker: string; title: string; subtitle: string }) {
  const { kicker, title, subtitle } = props;
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {kicker}
      </div>
      <div className="text-3xl md:text-4xl font-bold">{title}</div>
      <div className="text-slate-600">{subtitle}</div>
    </div>
  );
}

function Avatar(props: { charId: CharacterId; size: number }) {
  const c = byId(props.charId);
  return (
    <div
      className="rounded-2xl overflow-hidden border bg-white shadow-sm"
      style={{ width: props.size, height: props.size }}
      title={c.name}
    >
      <Image
        src={c.img}
        alt={`${c.name} avatar`}
        width={props.size}
        height={props.size}
        className="object-cover"
        priority
      />
    </div>
  );
}

function SpeechCard(props: { charId: CharacterId; speaker: string; bubble: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50/60 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar charId={props.charId} size={64} />
        <div>
          <div className="font-semibold">{props.speaker}</div>
          <div className="text-sm text-slate-600">{byId(props.charId).title}</div>
        </div>
      </div>

      <SpeechBubble text={props.bubble} />
    </div>
  );
}

function SpeechBubble(props: { text: string }) {
  return (
    <div className="relative rounded-2xl border bg-white p-4 text-slate-800">
      <div className="text-sm md:text-base">{props.text}</div>
      {/* tail */}
      <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t rotate-45" />
    </div>
  );
}

function SeverityPill(props: { severity: string }) {
  const sev = String(props.severity ?? "").toLowerCase();
  const isHigh = sev === "high";
  const isMed = sev === "medium";

  const cls = isHigh
    ? "bg-red-600"
    : isMed
    ? "bg-yellow-600"
    : "bg-green-600";

  const label = isHigh ? "OUCH" : isMed ? "UH-OH" : "OK-ish";

  return (
    <span className={`text-xs text-white px-3 py-1 rounded-xl ${cls}`}>
      {label}
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

  const hasBlocked = findings.some((p: any) => p.status === "blocked");
  const hasApproval = findings.some((p: any) => p.status === "needs_approval");

  if (hasBlocked) {
    return { label: "STOP", color: "bg-red-600", hint: "This breaks company rules." };
  }
  if (hasApproval) {
    return { label: "NEEDS HUMAN", color: "bg-yellow-600", hint: "Someone must sign off." };
  }
  if (conflicts.length > 0) {
    return { label: "NEEDS HUMAN", color: "bg-yellow-600", hint: "People need to choose a trade-off." };
  }
  return { label: "GO", color: "bg-green-600", hint: "No obvious fire… for now." };
}

function pickAgentSummary(result: any, agentName: string): string | null {
  const agents = result?.agents ?? [];
  const a = agents.find((x: any) => String(x.agent).toLowerCase() === agentName.toLowerCase());
  const s = a?.proposal?.summary;
  return typeof s === "string" && s.trim().length > 0 ? s : null;
}

function toComic(
  text: string,
  who: "Marketing" | "Sales" | "Accounting"
) {
  const t = text.toLowerCase();

  if (who === "Marketing") {
    if (t.includes("increase") || t.includes("paid")) {
      return "Let’s increase the budget to boost the pipeline!";
    }
    return "We should push harder to get more leads!";
  }

  if (who === "Sales") {
    if (t.includes("discount")) {
      return "We should offer discounts! People love to save a few pennies!";
    }
    return "Closing faster will calm everyone down.";
  }

  if (who === "Accounting") {
    if (t.includes("spend") || t.includes("budget")) {
      return "Wait, guys. We need to freeze non-essential spend.";
    }
    return "We can’t afford mistakes right now.";
  }

  return text;
}

function toHumanConflict(text: string) {
  return String(text ?? "")
    .replaceAll("lead volume", "incoming work")
    .replaceAll("service capacity", "team bandwidth")
    .replaceAll("cash/margin risk", "money risk")
    .replaceAll("requires human approval", "needs someone to sign it")
    .replaceAll("requires approval", "needs a signature");
}

function prettyActors(actors: any) {
  const arr = Array.isArray(actors) ? actors : [];
  const nice = arr.map((a) => String(a));
  return nice.length ? nice.join(" ↔ ") : "Somebody ↔ Somebody";
}

function toHumanPostMortem(text: string) {
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
  // fallback
  return String(text ?? "")
    .replaceAll("Overconfidence detected:", "Overconfidence:")
    .replaceAll("Misalignment:", "People problem:")
    .replaceAll("Policy violation:", "Rules problem:");
}
