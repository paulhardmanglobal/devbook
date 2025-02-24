import { z } from 'zod';

export const todoSchema = z.object({
  text: z.string().min(5, 'Please enter at least 5 characters'),
});

export type todoSchemaType = z.infer<typeof todoSchema>;
