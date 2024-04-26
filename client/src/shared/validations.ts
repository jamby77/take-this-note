import { z } from "zod";

export const noteSchema = z.object({
  id: z.number().gte(1).optional(),
  title: z.string().trim().min(3).max(100),
  content: z.string().trim().min(3).max(500),
  userId: z.number().gte(1).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  tags: z.array(z.string().trim().min(2).max(50)).optional(),
});
export type NoteValidation = z.infer<typeof noteSchema>;

export const parseNote = (note: NoteValidation) => {
  return noteSchema.safeParse(note);
};

export const tagSchema = z.object({
  id: z.number().gte(1).optional(),
  name: z.string().trim().min(2).max(50),
});
export const parseTag = (tag: TagValidation) => {
  return tagSchema.safeParse(tag);
};

export type TagValidation = z.infer<typeof tagSchema>;
