import { userPostHandler } from 'activitypub-core';
import serviceAccount from "../../credentials";
import type { IncomingMessage, ServerResponse } from 'http';
import { Request, Response } from 'express';

export const handleUserPostRequest = async (req: IncomingMessage, res: ServerResponse) => {
  return userPostHandler(serviceAccount)(req, res);
};