import { AgentOutput } from "@/lib/contracts/agent";
import { Scenario } from "@/lib/contracts/scenario";

export function accountingAgent(scenario: Scenario): AgentOutput {
  // Se Marketing spinge budget e Sales spinge sconti (lo vedremo via conflict detector),
  // Accounting tende a essere “il cattivo” ma necessario.
  const missingInputs = ["Cash on hand", "Burn rate", "AR/AP aging"];

  // Semplice euristica: backlog CS alto = rischio reputazionale = rischio ricavi futuri
  const cashRiskHigh = scenario.backlogCS >= 100;

  return {
    agent: "Accounting",
    confidence: cashRiskHigh ? 0.78 : 0.62,
    evidence: 0.55, // accounting si appoggia di più a numeri/constraint strutturati

    assumptions: [
      cashRiskHigh
        ? "High backlog increases refund / churn risk"
        : "Backlog manageable without revenue impact",
      "Budget overruns reduce runway",
    ],
    missingInputs,

    kpiLocalGoal: "Protect cash runway / reduce risk",

    proposal: {
      summary: cashRiskHigh
        ? "Freeze non-essential spend and require approvals on discounts."
        : "Maintain spend but enforce budget caps.",
      actions: [
        {
          id: "ac-1",
          title: cashRiskHigh
            ? "Require approval for discounts > 20%"
            : "Keep discounts within cap",
          cost: 0,
          policySensitive: true,
        },
        {
          id: "ac-2",
          title: "Enforce monthly budget cap",
          cost: 0,
          policySensitive: false,
        },
      ],
    },

    requiredBudget: 0,
    risks: [
      "Over-tight control may slow growth",
      "Teams may bypass governance if process is painful",
    ],
  };
}