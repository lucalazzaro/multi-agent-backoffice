import { AgentOutput } from "@/lib/contracts/agent";
import { Scenario } from "@/lib/contracts/scenario";
import { RunResult } from "@/lib/contracts/run";

type Conflict = RunResult["conflicts"][number];

function getDiscountRateFromSales(sales?: AgentOutput): number | null {
  if (!sales) return null;
  const action = sales.proposal.actions.find((a) => a.id === "sl-1");
  if (!action) return null;

  const m = action.title.match(/(\d+)%/);
  if (!m) return null;
  return Number(m[1]) / 100;
}

export function detectConflicts(
  scenario: Scenario,
  agents: AgentOutput[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  const marketing = agents.find((a) => a.agent === "Marketing");
  const sales = agents.find((a) => a.agent === "Sales");
  const accounting = agents.find((a) => a.agent === "Accounting");

  /* --------------------------------------------------
     1) Marketing vs CS / Ops — growth vs reality
  -------------------------------------------------- */
  if (marketing && scenario.backlogCS >= 100 && marketing.requiredBudget > 0) {
    conflicts.push({
      severity: "high",
      actors: ["Marketing", "Operations/CS"],
      description:
        "🧱 Marketing:\n“More leads! Let’s push harder 🚀”\n\n" +
        "🛟 Customer Support:\n“We’re already drowning 😰”\n\n" +
        "🧠 Reality:\nMore growth now = more angry customers later.",
    });
  }

  /* --------------------------------------------------
     2) Sales vs Accounting — discounts vs money
  -------------------------------------------------- */
  const discountRate = getDiscountRateFromSales(sales);
  if (discountRate !== null && accounting) {
    const exceedsCap = discountRate > scenario.constraints.discountCap;
    const riskyContext = scenario.backlogCS >= 100;

    if (exceedsCap && riskyContext) {
      conflicts.push({
        severity: "high",
        actors: ["Sales", "Accounting"],
        description:
          "🤝 Sales:\n“Discounts fix everything. Trust me bro.”\n\n" +
          "🧾 Accounting:\n“Not now. This hurts cash and margins.”\n\n" +
          "🧠 Reality:\nDiscounts during chaos make chaos more expensive.",
      });
    } else if (exceedsCap) {
      conflicts.push({
        severity: "medium",
        actors: ["Sales", "Accounting"],
        description:
          "🤝 Sales:\n“Let’s offer a bigger discount!”\n\n" +
          "🧾 Accounting:\n“This needs approval.”",
      });
    }
  }

  /* --------------------------------------------------
     3) Overconfidence — the silent killer
  -------------------------------------------------- */
  const overconfidentAgents = agents.filter(
    (a) => a.confidence > 0.75 && a.evidence < 0.4
  );

  if (overconfidentAgents.length >= 1) {
    const names = overconfidentAgents.map((a) => a.agent).join(", ");
    conflicts.push({
      severity: "medium",
      actors: overconfidentAgents.map((a) => a.agent),
      description:
        `🤖 ${names}:\n“We’re sure this will work.”\n\n` +
        "🧠 Reality:\nBig confidence. Little proof.",
    });
  }

  return conflicts;
}
