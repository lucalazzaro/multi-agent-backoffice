import { z } from "zod";

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  backlogCS: z.number().min(0),
  monthlyBudget: z.number().min(0),
  constraints: z.object({
    complianceStrict: z.boolean(),
    discountCap: z.number(), // es: 0.2 = 20%
  }),
  freeText: z.string(), // qui vive la brittleness
});

export type Scenario = z.infer<typeof ScenarioSchema>;
