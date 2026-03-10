import { z } from "zod";

export const answerSchema = z.object({
  nodeKey: z.string().min(1),
  value: z.string().min(1)
});
