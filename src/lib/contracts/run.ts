import { z } from "zod";
import { AgentOutputSchema } from "./agent";

export const ConflictSchema = z.object({
  severity: z.enum(["low", "medium", "high"]),
  actors: z.array(z.string()),
  description: z.string(),
});

export const PolicyFindingSchema = z.object({
  status: z.enum(["allowed", "needs_approval", "blocked"]),
  reason: z.string(),
});

export const RunResultSchema = z.object({
  agents: z.array(AgentOutputSchema),
  conflicts: z.array(ConflictSchema),
  policyFindings: z.array(PolicyFindingSchema),
  postMortem: z.array(z.string()),
});

export type RunResult = z.infer<typeof RunResultSchema>;
