import express, { NextFunction, Request, Response } from "express";
import {
  ClerkExpressRequireAuth,
  ClerkMiddlewareOptions,
  WithAuthProp,
} from "@clerk/clerk-sdk-node";
import { createUser, getAuthenticatedUser, getUserByEmail } from "./data/users";
import { usersController } from "./users/usersController";
import { notesController } from "./notes/notesController";
import { tagsController } from "./notes/tagsController";

export const router = express.Router();

// get logged in user
const authOptions: ClerkMiddlewareOptions = {
  signInUrl: `${process.env.FRONTEND_URL}/sign-in`,
};
// add express middleware to check if clerk session exists and if so, add user to it
function wrappedAuthMiddleware() {
  // const authMiddleware = ClerkExpressWithAuth(authOptions); // less strict
  const authMiddleware = ClerkExpressRequireAuth(authOptions);
  const userMiddleware = async (req: WithAuthProp<Request>, _: Response, next: NextFunction) => {
    // await authMiddleware(req, res, next);
    if (req.auth?.userId && !req.user) {
      // this will fetch user data from Clerk on each authenticated request
      const authUser = await getAuthenticatedUser(req.auth.userId);
      const user = await getUserByEmail(authUser?.email);
      if (user) {
        req.user = user;
      } else if (authUser?.email) {
        // user is authenticated but not in database, create it
        req.user = await createUser({
          email: authUser.email,
          name: authUser.name,
        });
      }
    }
    return next();
  };
  return [authMiddleware, userMiddleware];
}
const authMiddleware = wrappedAuthMiddleware();

// heartbeat
router.get("/hello", (_: Request, res) => {
  res.send("Hello!");
});

// user
router.post("/users/register", usersController.register);
router.get("/users/me", authMiddleware, usersController.getUser);

// notes
router.get("/notes", authMiddleware, notesController.listNotes);
router.post("/notes", authMiddleware, notesController.createUserNote);
router.put("/notes/:id", authMiddleware, notesController.updateUserNote);
router.get("/notes/:id", authMiddleware, notesController.getNote);
router.delete("/notes/:id", authMiddleware, notesController.deleteUserNote);

// tags
router.get("/tags", authMiddleware, tagsController.listTags);
router.get("/tags/:tag", authMiddleware, tagsController.getNotesForTag);
router.post("/tags", authMiddleware, tagsController.create);
router.put("/tags/:tag", authMiddleware, tagsController.updateTagName);
router.delete("/tags/:tag", authMiddleware, tagsController.deleteATag);

export const getPagination = (req: Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  return { page, limit };
};

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
