import { db } from "./db";
import { and, BinaryOperator, desc, eq, ilike } from "drizzle-orm";
import { Note, NoteInsert, notes, tags } from "./schema";

export const getUserNotes = async (
  userId: number,
  page = 1,
  limit = 10,
  tag?: string,
  searchText?: string,
): Promise<Note[]> => {
  const query: any = {
    where: eq(notes.userId, userId),
    orderBy: [desc(notes.createdAt)],
    limit: limit,
    offset: (page - 1) * limit,
  };
  if (tag && tag.trim().length > 0) {
    query.with = {
      tags: {
        where: (t: typeof tags, { eq }: { eq: BinaryOperator }) => eq(t.name, tag),
      },
    };
  }
  if (searchText && searchText.trim().length > 0) {
    query.where = and(query.where, ilike(notes.title, `%${searchText}%`));
  }
  return db.query.notes.findMany(query);
};

export const getNoteById = async (id: number) => {
  return db.query.notes.findFirst({ where: eq(notes.id, id) });
};

export const createNote = async (newNote: NoteInsert) => {
  const returning = await db
    .insert(notes)
    .values(newNote)
    .returning({ id: notes.id, title: notes.title, content: notes.content });
  return returning.pop();
};

export const updateNote = async (id: number, note: NoteInsert) => {
  const returning = await db
    .update(notes)
    .set(note)
    .where(eq(notes.id, id))
    .returning({ id: notes.id, title: notes.title, content: notes.content });
  return returning.pop();
};

export const deleteNote = async (id: number) => {
  const returning = await db
    .delete(notes)
    .where(eq(notes.id, id))
    .returning({ title: notes.title });
  return returning.pop();
};

export const getTags = async (page = 1, limit = 10) => {
  return db.query.tags.findMany({
    limit: limit,
    offset: (page - 1) * limit,
  });
};

export const getTagByName = async (name: string) => {
  return db.query.tags.findFirst({ where: eq(tags.name, name) });
};

export const createTag = async (name: string) => {
  const returning = await db.insert(tags).values({ name }).returning({ name: tags.name });
  return returning.pop();
};

export const updateTag = async (name: string, newName: string) => {
  const returning = await db
    .update(tags)
    .set({ name: newName })
    .where(eq(tags.name, name))
    .returning({ name: tags.name });
  return returning.pop();
};

export const deleteTag = async (name: string) => {
  const returning = await db.delete(tags).where(eq(tags.name, name)).returning({ name: tags.name });
  return returning.pop();
};
