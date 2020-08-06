import { RequestHandler } from 'express';
import { HttpError } from '../utils/HttpError';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/constants';

const verifyToken = (token: string, secret: string): Record<string, any> => {
  let data: string | Record<string, any>;
  try {
    data = verify(token, secret);
  } catch (err) {
    err.status = 401;
    throw err;
  }
  if (!data || typeof data === 'string') {
    throw new HttpError(401, 'Unauthorized');
  }
  return data;
};

export const auth: RequestHandler = (req, res, next) => {
  try {
    const auth = req.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      res.set('WWW-Authenticate', 'Bearer');
      throw new HttpError(401, 'Unauthorized');
    }
    const token = auth.slice(7, auth.length);
    req.token = verifyToken(token, JWT_SECRET);
    next();
  } catch (err) {
    next(err);
  }
};
