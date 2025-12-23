import { Scenario } from "@/lib/contracts/scenario";
import { RunResult } from "@/lib/contracts/run";

import { marketingAgent } from "@/lib/engine/agents/marketing";
import { salesAgent } from "@/lib/engine/agents/sales";
import { accountingAgent } from "@/lib/engine/agents/accounting";

import { detectConflicts } from "@/lib/engine/conflictDetector";
import { policyGate } from "@/lib/engine/policyGate";

export function runOffice(scenario: Scenario): RunResult {
  const agents = [
    marketingAgent(scenario),
    salesAgent(scenario),
    accountingAgent(scenario),
  ];

  const conflicts = detectConflicts(scenario, agents);
  const policyFindings = policyGate(scenario, agents);

  const postMortem: string[] = [];

  // Overconfidence
  const overconf = agents.filter((a) => a.confidence > 0.75 && a.evidence < 0.4);
  for (const a of overconf) {
    postMortem.push(
      `Overconfidence detected: ${a.agent} confidence high (${a.confidence}) but evidence low (${a.evidence}).`
    );
  }

  // Misalignment
  if (conflicts.some((c) => c.actors.includes("Sales") && c.actors.includes("Accounting"))) {
    postMortem.push("Misalignment: Sales optimization conflicts with cash constraints.");
  }
  if (conflicts.some((c) => c.actors.includes("Marketing"))) {
    postMortem.push("Misalignment: Growth spend conflicts with service capacity constraints.");
  }

  // Policy
  if (policyFindings.some((p) => p.status === "blocked")) {
    postMortem.push("Policy violation detected: one or more actions were blocked.");
  } else if (policyFindings.some((p) => p.status === "needs_approval")) {
    postMortem.push("Policy gate triggered: one or more actions need human approval.");
  }

  return {
    agents,
    conflicts,
    policyFindings,
    postMortem,
  };
}
