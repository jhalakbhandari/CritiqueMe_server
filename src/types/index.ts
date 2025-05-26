import { Request } from "express";

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
