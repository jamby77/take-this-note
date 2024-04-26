import { Request, Response } from "express";
import { createNote, deleteNote, getNoteById, getUserNotes, updateNote } from "../data/notes";
import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { getPagination, StatusCodes } from "../router";
import { ZodError } from "zod";

const listNotes = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { page, limit } = getPagination(req);
  const {
    q,
    tag,
  }: {
    q?: string;
    tag?: string;
  } = req.query;

  const notes = await getUserNotes(user.id, page, limit, q, tag);
  return res.json(notes);
};

const getNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { id } = req.params;
  if (!id) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.send("Id is required");
  }
  const note = await getNoteById(+id);
  if (!note) {
    res.status(StatusCodes.NOT_FOUND);
    return res.send("Note not found");
  }
  if (note.userId !== user.id) {
    res.status(StatusCodes.FORBIDDEN);
    return res.send("You do not have permission to access this note");
  }
  return res.json(note);
};

// create CRUD handlers
const createUserNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.send("Title and content are required");
  }
  try {
    const note = await createNote({
      title,
      content,
      userId: user.id,
    });
    res.status(StatusCodes.CREATED);
    return res.json(note);
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST);
    if (e instanceof ZodError) {
      return res.send(e.issues);
    }
    return res.send("Error creating note");
  }
};

const updateUserNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { title, content } = req.body;
  const { id } = req.params;
  if (!id || !title || !content) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.send("Id, title and content are required");
  }
  const exisingNote = await getNoteById(+id);
  if (!exisingNote) {
    res.status(StatusCodes.NOT_FOUND);
    return res.send("Note not found");
  }
  if (exisingNote.userId !== user.id) {
    res.status(StatusCodes.FORBIDDEN);
    return res.send("You do not have permission to update this note");
  }

  try {
    const note = await updateNote(+id, {
      title,
      content,
      userId: exisingNote.userId,
    });
    return res.json(note);
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST);
    if (e instanceof ZodError) {
      return res.send(e.issues);
    }
    return res.send("Error updating note");
  }
};

const deleteUserNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { id } = req.params;
  if (!id) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.send("Id is required");
  }
  const exisingNote = await getNoteById(parseInt(id, 10));
  if (!exisingNote) {
    res.status(StatusCodes.NOT_FOUND);
    return res.send("Note not found");
  }
  if (exisingNote.userId !== user.id) {
    res.status(StatusCodes.FORBIDDEN);
    return res.send("You do not have permission to delete this note");
  }
  await deleteNote(parseInt(id, 10));
  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const notesController = {
  listNotes,
  getNote,
  createUserNote,
  updateUserNote,
  deleteUserNote,
};
