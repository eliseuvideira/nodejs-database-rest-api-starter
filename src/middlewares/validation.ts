import { ObjectSchema } from 'joi';
import { RequestHandler } from 'express';
import { HttpError } from '../utils/HttpError';

const createRequestValidate = (key: 'body' | 'params' | 'query') => (
  schema: ObjectSchema,
): RequestHandler => async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req[key]);
    req[key] = value;
    next();
  } catch (err) {
    next(new HttpError(400, err.message));
  }
};

export const body = createRequestValidate('body');

export const query = createRequestValidate('query');

export const params = createRequestValidate('params');
