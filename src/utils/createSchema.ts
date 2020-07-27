import Joi from 'joi';

type SchemaProps<T> = {
  [key in keyof T]: Joi.Schema;
};

export const createSchema = <T>(
  props: SchemaProps<Partial<T>>,
): Joi.ObjectSchema => Joi.object().keys(props).required();
