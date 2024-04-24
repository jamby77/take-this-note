import { Request, Response } from "express";
import { createTag, deleteTag, getTagByName, getTags, updateTag } from "../data/notes";
import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { getPagination, StatusCodes } from "../router";

export const listTags = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { page, limit } = getPagination(req);

  const notes = await getTags(page, limit);
  return res.json(notes);
};

// create CRUD handlers
export const create = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { name: tagName } = req.body;
  if (!tagName) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return res.send("Tag is required");
  }
  const tag = await createTag(tagName);
  res.status(StatusCodes.CREATED);
  return res.json(tag);
};

export const updateTagName = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { tag } = req.params;
  const { name: tagName } = req.body;
  if (!tag || !tagName) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return res.send("Both old and new tag name are required");
  }
  const exisingTag = await getTagByName(tag);
  if (!exisingTag) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return res.send("Tag not found");
  }

  const newTag = await updateTag(tag, tagName);
  return res.json(newTag);
};

export const deleteATag = async (req: WithAuthProp<Request>, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  const { tag } = req.params;
  if (!tag) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return res.send("Tag is required");
  }
  const exisingTag = await getTagByName(tag);
  if (!exisingTag) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return res.send("Tag not found");
  }
  await deleteTag(tag);
  return res.sendStatus(StatusCodes.NO_CONTENT);
};
