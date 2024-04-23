import { index, integer, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
});

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
    user_id: integer("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (notesSchema) => ({
    nameIdx: index("title_idx").on(notesSchema.title),
  }),
);

export type Note = InferSelectModel<typeof notes>;
export type NoteInsert = InferInsertModel<typeof notes>;

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export type Tag = InferSelectModel<typeof tags>;
export type TagInsert = InferInsertModel<typeof tags>;

export const note_tags = pgTable(
  "note_tags",
  {
    note_id: integer("note_id")
      .references(() => notes.id)
      .notNull(),
    tag_id: integer("tag_id")
      .references(() => tags.id)
      .notNull(),
  },
  (nts) => ({
    pk: primaryKey({
      name: "note_tags_pkey",
      columns: [nts.note_id, nts.tag_id],
    }),
  }),
);

export type NoteTag = InferSelectModel<typeof note_tags>;
export type NoteTagInsert = InferInsertModel<typeof note_tags>;
