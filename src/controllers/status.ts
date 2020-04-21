import { RequestHandler } from 'express';

export const getStatus: RequestHandler = (_req, res, _next) => {
  res.status(204).end();
};
