import express, { Request, Response } from "express";
import { createUser, getAuthenticatedUser, getUserByEmail } from "../data/users";
import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { User, UserInsert, UserWithNotes } from "../data/schema";

/**
 * Get currently authenticated user
 */
async function getUser(req: WithAuthProp<express.Request>, res: express.Response) {
  if (!req.auth?.userId) {
    res.json({ error: "Unauthenticated: missing userId" });
    return res.sendStatus(401);
  }

  const user = await getAuthenticatedUser(req.auth.userId);

  if (!user) {
    res.json({ error: "Unauthenticated: failed to fetch user" });
    return res.sendStatus(401);
  }
  const email = user.email;
  let existingUser: UserWithNotes | undefined | User = await getUserByEmail(email);
  // if not in database, create it
  if (!existingUser) {
    let name = "";
    if (user.firstName || user.lastName) {
      name = `${user.firstName} ${user.lastName}`.trim();
    }
    const newUser: UserInsert = { email: user.email };
    if (name.length > 0) {
      newUser.name = name;
    }
    existingUser = await createUser(newUser);
  }

  return res.json(existingUser);
}

const register = async (req: Request, res: Response) => {
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

export const usersController = { getUser, register };
