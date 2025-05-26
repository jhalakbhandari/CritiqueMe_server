// src/types/index.ts

import { Request } from "express";
import type { Multer } from "multer";

declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
    }
    interface Request {
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };

      user?: Express.User; // Match expected declaration merging
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export interface UpdatePostInput {
  id: string;
  title: string;
  description: string;
  tags: string[];
  media: string;
  status: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}
export interface UpdatePostInput {
  id: string;
  title: string;
  description: string;
  tags: string[];
  media: string;
  status: string;
}
