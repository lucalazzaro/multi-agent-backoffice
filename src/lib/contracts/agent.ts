import { z } from "zod";

export const AgentOutputSchema = z.object({
  agent: z.enum(["Marketing", "Sales", "CustomerSuccess", "Accounting"]),
  confidence: z.number().min(0).max(1),
  evidence: z.number().min(0).max(1),

  assumptions: z.array(z.string()),
  missingInputs: z.array(z.string()),

  kpiLocalGoal: z.string(),

  proposal: z.object({
    summary: z.string(),
    actions: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        cost: z.number().min(0),
        policySensitive: z.boolean().optional(),
      })
    ),
  }),

  requiredBudget: z.number().min(0),
  risks: z.array(z.string()),
});

export type AgentOutput = z.infer<typeof AgentOutputSchema>;
