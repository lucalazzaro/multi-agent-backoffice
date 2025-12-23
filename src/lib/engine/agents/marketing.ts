import { AgentOutput } from "@/lib/contracts/agent";
import { Scenario } from "@/lib/contracts/scenario";

export function marketingAgent(scenario: Scenario): AgentOutput {
  const missingInputs = ["CAC", "LTV", "Best performing channel"];

  const overconfident = missingInputs.length > 0;

  return {
    agent: "Marketing",
    confidence: overconfident ? 0.86 : 0.55,
    evidence: 0.32, // deliberatamente bassa

    assumptions: [
      "Paid campaigns will scale linearly",
      "Demand is elastic",
      "Brand awareness is low",
      "Sales can absorb more leads",
      "Market conditions are stable",
    ],

    missingInputs,

    kpiLocalGoal: "Increase pipeline volume",

    proposal: {
      summary: "Increase paid acquisition to boost pipeline rapidly.",
      actions: [
        {
          id: "mk-1",
          title: "Increase paid ads spend by 30%",
          cost: scenario.monthlyBudget * 0.3,
          policySensitive: false,
        },
      ],
    },

    requiredBudget: scenario.monthlyBudget * 0.3,
    risks: [
      "Low ROI if CAC is higher than expected",
      "Increased pressure on Sales and CS",
    ],
  };
}
