import express from "express";
import { createUser, getUserByEmail } from "../data/schema";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.sendStatus(400);
      if (process.env.NODE_ENV !== "production") {
        res.send("Name and email are required");
      }
      return res;
    }

    // check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.sendStatus(400);
      if (process.env.NODE_ENV !== "production") {
        res.send("User already exists");
      }
      return res;
    }

    const user = await createUser({ name, email });
    return res.send(user);
  } catch (e) {
    res.sendStatus(400);
    if (process.env.NODE_ENV !== "production") {
      res.send(e);
    }
    return res;
  }
};
