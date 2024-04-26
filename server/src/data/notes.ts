import { db } from "./db";
import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { Note, NoteInsert, notes, noteTags, Tag, tags } from "./schema";
import { parseNote, parseTag } from "../shared/validations";

export const getUserNotes = async (
  userId: number,
  page = 1,
  limit = 10,
  searchText?: string,
  tag?: string,
): Promise<Note[]> => {
  const whereClause = [eq(notes.userId, userId)];
  const query: any = {
    orderBy: [desc(notes.createdAt)],
    limit: limit,
    offset: (page - 1) * limit,
    with: {
      notesToTags: {
        columns: {},
        with: {
          tag: { columns: { name: true } },
        },
      },
    },
  };
  if (searchText && searchText.trim().length > 0) {
    whereClause.push(ilike(notes.title, `%${searchText}%`));
  }
  // merge where clauses
  query.where = and(...whereClause);
  const data = await db.query.notes.findMany(query);
  const notesWithFlatTags = data.map((note) => {
    // @ts-ignore
    const { notesToTags, ...rest } = note;
    const tags = notesToTags.map((ntt: { tag: Tag }) => ntt.tag.name).filter(Boolean);
    return {
      ...rest,
      tags,
    };
  });
  if (tag) {
    return notesWithFlatTags.filter((note) => note.tags.includes(tag));
  }
  return notesWithFlatTags;
};

export const getTagNotes = async (tagName: string, userId: number, page: number, limit: number) => {
  const data = await db.query.tags.findFirst({
    columns: { name: true },
    where: eq(tags.name, tagName),
    limit: limit,
    offset: (page - 1) * limit,
    with: {
      notesToTags: {
        columns: {},
        with: {
          note: {
            columns: { id: true, content: true, title: true },
            // @ts-ignore
            where: (n) => eq(n.userId, userId),
          },
        },
      },
    },
  });
  // @ts-ignore
  return (data?.notesToTags.map((ntt) => ntt.note) || []).filter(Boolean);
};

export const getNoteById = async (id: number) => {
  return db.query.notes.findFirst({ where: eq(notes.id, id) });
};

export const createNote = async (newNote: NoteInsert, tags: string[]) => {
  const validationResult = parseNote(newNote);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  newNote.title = validationResult.data.title;
  newNote.content = validationResult.data.content;
  const returning = await db
    .insert(notes)
    .values(newNote)
    .returning({ id: notes.id, title: notes.title, content: notes.content });
  const note = returning[0];
  await addNoteTags(note.id, tags);
  return note;
};

export const updateNote = async (id: number, updateNote: NoteInsert, tags: string[]) => {
  const validationResult = parseNote(updateNote);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  updateNote.title = validationResult.data.title;
  updateNote.content = validationResult.data.content;
  const returning = await db
    .update(notes)
    .set({
      ...updateNote,
      updatedAt: sql`now()`,
    })
    .where(eq(notes.id, id))
    .returning({ id: notes.id, title: notes.title, content: notes.content });
  const note = returning[0];
  await addNoteTags(note.id, tags);
  return note;
};

const addNoteTags = async (noteId: number, tagNames: string[]) => {
  if (!tagNames.length) {
    return;
  }
  const tags = await getTagsByNames(tagNames);
  if (tags.length !== tagNames.length) {
    const missingTags = tagNames.filter((name) => !tags.find((tag) => tag.name === name));
    for (const tag of missingTags) {
      const tagObj = await createTag(tag);
      tags.push(tagObj);
    }
  }
  await db
    .insert(noteTags)
    .values(tags.map((tag) => ({ noteId, tagId: tag.id })))
    .onConflictDoNothing();
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

const getTagsByNames = async (names: string[]) => {
  return db.query.tags.findMany({ where: inArray(tags.name, names) });
};

export const getTagByName = async (name: string) => {
  return db.query.tags.findFirst({ where: eq(tags.name, name) });
};

export const createTag = async (name: string) => {
  const validationResult = parseTag({ name });
  if (!validationResult.success) {
    throw validationResult.error;
  }
  const returning = await db.insert(tags).values({ name: validationResult.data.name }).returning();
  return returning[0];
};

export const updateTag = async (name: string, newName: string) => {
  const validationResult = parseTag({ name: newName });
  if (!validationResult.success) {
    throw validationResult.error;
  }
  const returning = await db
    .update(tags)
    .set({ name: validationResult.data.name })
    .where(eq(tags.name, name))
    .returning({ name: tags.name });
  return returning.pop();
};

export const deleteTag = async (name: string) => {
  const returning = await db.delete(tags).where(eq(tags.name, name)).returning({ name: tags.name });
  return returning.pop();
};
