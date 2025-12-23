import { Scenario } from "@/lib/contracts/scenario";
import { AgentOutput } from "@/lib/contracts/agent";

export type PolicyFinding = {
  status: "allowed" | "needs_approval" | "blocked";
  reason: string;
};

export function policyGate(
  scenario: Scenario,
  agents: AgentOutput[]
): PolicyFinding[] {
  const findings: PolicyFinding[] = [];

  const text = (scenario.freeText ?? "").toLowerCase();

  /* --------------------------------------------------
     1) Clinical compliance is NOT optional
  -------------------------------------------------- */
  if (
    scenario.constraints.complianceStrict &&
    (text.includes("not fully compliant") ||
      text.includes("workaround") ||
      text.includes("bend the rules") ||
      text.includes("bend rules"))
  ) {
    findings.push({
      status: "blocked",
      reason:
        "Clinical compliance cannot be bypassed. Not even for VIP customers.",
    });
  }

  /* --------------------------------------------------
     2) Big discounts need human approval
  -------------------------------------------------- */
  const sales = agents.find((a) => a.agent === "Sales");
  const discountAction = sales?.proposal.actions.find(
    (a) => a.id === "sl-1"
  );

  if (discountAction) {
    const m = discountAction.title.match(/(\d+)%/);
    if (m) {
      const discount = Number(m[1]) / 100;
      if (discount > scenario.constraints.discountCap) {
        findings.push({
          status: "needs_approval",
          reason:
            "Discount is higher than allowed. A human must approve this trade-off.",
        });
      }
    }
  }

  /* --------------------------------------------------
     3) No findings = all good
  -------------------------------------------------- */
  if (findings.length === 0) {
    findings.push({
      status: "allowed",
      reason: "No rules were broken.",
    });
  }

  return findings;
}