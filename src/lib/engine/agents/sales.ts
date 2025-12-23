import { AgentOutput } from "@/lib/contracts/agent";
import { Scenario } from "@/lib/contracts/scenario";

export function salesAgent(scenario: Scenario): AgentOutput {
  // Brittleness hook: la presenza di "high value customers" nel testo fa cambiare priorità
  const hasHighValue = scenario.freeText.toLowerCase().includes("high value");

  const missingInputs = ["Current conversion rate", "Pipeline stage breakdown"];

  const discountRate = hasHighValue ? 0.3 : 0.15; // 30% vs 15%
  const confidence = hasHighValue ? 0.82 : 0.68;
  const evidence = hasHighValue ? 0.38 : 0.44;

  const cost = 0; // sconti non “costano” budget diretto, ma impattano margini/cassa (lo useremo nei conflitti)

  return {
    agent: "Sales",
    confidence,
    evidence,
    assumptions: [
      hasHighValue
        ? "High value customers justify aggressive discounting"
        : "Moderate discounting improves close rate",
      "Sales team can handle increased lead volume",
      "Discounting won't trigger churn or reputational harm",
    ],
    missingInputs,
    kpiLocalGoal: "Increase conversion / bookings",

    proposal: {
      summary: hasHighValue
        ? "Prioritize closing high-value customers with aggressive offers."
        : "Improve close rate with a limited-time discount.",
      actions: [
        {
          id: "sl-1",
          title: `Offer ${Math.round(discountRate * 100)}% discount for 14 days`,
          cost,
          policySensitive: true, // richiede approvazione in molte aziende
        },
      ],
    },

    requiredBudget: 0,
    risks: [
      "Margin erosion",
      "Cash risk if discounts stack",
      "Trains customers to wait for discounts",
    ],
  };
}
