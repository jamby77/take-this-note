import express, { Express, NextFunction, Request, Response } from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
// see https://clerk.com/docs/references/backend/overview
// see https://github.com/clerk/javascript/tree/main/packages/sdk-node
import { LooseAuthProp } from "@clerk/clerk-sdk-node";
import { router } from "./router";

dotenv.config({
  path: [".env.local", ".env"],
});
declare global {
  namespace Express {
    interface Request extends LooseAuthProp {
      user?: {
        id: number;
        name: string | null;
        email: string;
        notes?: any[];
      };
    }
  }
}

const app: Express = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", router);

app.use((err: any, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(401).json({ error: "Unauthenticated" });
});

const port = Number(process.env.PORT || 3000);
ViteExpress.listen(app, port, () => console.log(`Server is listening on port ${port}...`));
