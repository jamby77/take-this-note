import { index, integer, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
});

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type UserWithNotes = User & { notes: Note[] };

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (notesSchema) => ({
    nameIdx: index("title_idx").on(notesSchema.title),
  }),
);
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));
export const notesRelations = relations(notes, ({ one }) => ({
  author: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));
export type Note = InferSelectModel<typeof notes>;
export type NoteInsert = InferInsertModel<typeof notes>;

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export type Tag = InferSelectModel<typeof tags>;
export type TagInsert = InferInsertModel<typeof tags>;

export const noteTagsRelations = relations(notes, ({ many }) => ({
  notesToTags: many(note_tags),
}));
export const tagNotesRelations = relations(tags, ({ many }) => ({
  notesToTags: many(note_tags),
}));

export const note_tags = pgTable(
  "note_tags",
  {
    noteId: integer("note_id")
      .references(() => notes.id, { onDelete: "cascade" })
      .notNull(),
    tagId: integer("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (nts) => ({
    pk: primaryKey({
      name: "note_tags_pkey",
      columns: [nts.noteId, nts.tagId],
    }),
  }),
);

export type NoteTag = InferSelectModel<typeof note_tags>;
export type NoteTagInsert = InferInsertModel<typeof note_tags>;
export const notesToTagsRelations = relations(note_tags, ({ one }) => ({
  note: one(notes, {
    fields: [note_tags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [note_tags.tagId],
    references: [tags.id],
  }),
}));
