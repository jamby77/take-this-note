import { Request, Response } from "express";
import { createNote, deleteNote, getNoteById, getUserNotes, updateNote } from "../data/notes";
import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { getPagination, StatusCodes } from "../router";

export const listNotes = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { page, limit } = getPagination(req);
  const {
    tag,
    q,
  }: {
    tag?: string;
    q?: string;
  } = req.query;

  const notes = await getUserNotes(user.id, page, limit, tag, q);
  return res.json(notes);
};

export const getNote = async (req: WithAuthProp<Request>, res: Response) => {
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
export const createUserNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(401);
  }
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    return res.send("Title and content are required");
  }
  const note = await createNote({ title, content, userId: user.id });
  res.status(201);

  return res.json(note);
};

export const updateUserNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(401);
  }
  const { title, content } = req.body;
  const { id } = req.params;
  if (!id || !title || !content) {
    res.status(400);
    return res.send("Id, title and content are required");
  }
  const exisingNote = await getNoteById(+id);
  if (!exisingNote) {
    res.status(404);
    return res.send("Note not found");
  }
  if (exisingNote.userId !== user.id) {
    res.status(403);
    return res.send("You do not have permission to update this note");
  }

  const note = await updateNote(+id, { title, content, userId: exisingNote.userId });
  return res.json(note);
};

export const deleteUserNote = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(401);
  }
  const { id } = req.params;
  if (!id) {
    res.status(400);
    return res.send("Id is required");
  }
  const exisingNote = await getNoteById(parseInt(id, 10));
  if (!exisingNote) {
    res.status(404);
    return res.send("Note not found");
  }
  if (exisingNote.userId !== user.id) {
    res.status(403);
    return res.send("You do not have permission to delete this note");
  }
  await deleteNote(parseInt(id, 10));
  return res.sendStatus(200);
};
