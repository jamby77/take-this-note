import express, { NextFunction, Request, Response } from "express";
import {
  ClerkExpressRequireAuth,
  ClerkMiddlewareOptions,
  WithAuthProp,
} from "@clerk/clerk-sdk-node";
import { getUser, register } from "./users/usersController";
import { getAuthenticatedUser, getUserByEmail } from "./data/users";

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
      }
    }
    return next();
  };
  return [authMiddleware, userMiddleware];
}
const authMiddleware = wrappedAuthMiddleware();

router.get("/users/me", authMiddleware, getUser);
// router.get("/users/me", ClerkExpressRequireAuth(authOptions), getUser);

// register user
router.post("/users/register", register);

// heartbeat
router.get("/hello", (_: Request, res) => {
  res.send("Hello!");
  // res.send("Hello from notes server!");
});

// router.get(
//   "/notes",
//   ClerkExpressRequireAuth(authOptions),
//   async (req: RequireAuthProp<Request>, res) => {
//     res.json(req.user);
//   },
// );
router.get("/notes", authMiddleware, async (req: WithAuthProp<Request>, res: Response) => {
  console.log({ reqUserInHandler: req.user });

  return res.json({
    user: req.user,
    auth: req.auth,
  });
});

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