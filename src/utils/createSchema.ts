import Joi from '@hapi/joi';

type SchemaProps<T> = {
  [key in keyof T]: Joi.Schema;
};

export const createSchema = <T>(
  props: SchemaProps<Partial<T>>,
): Joi.ObjectSchema<any> => {
  return Joi.object().keys(props).required();
};
