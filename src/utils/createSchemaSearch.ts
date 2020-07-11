import Joi from '@hapi/joi';

const MAX_PER_PAGE = 50;

export type SearchProps<T> = {
  [key in keyof T]: Joi.Schema;
};

export type SearchQueryFields<T> = {
  search?: Partial<T>;
  page: number;
  perPage: number;
  sort: string;
};

export const createSchemaSearch = <T>(
  search: SearchProps<Partial<T>>,
  sortFields: (keyof T)[],
): Joi.ObjectSchema<any> => {
  if (sortFields.length === 0) {
    throw new Error("'sortFields' parameter must have at least one value");
  }

  return Joi.object()
    .keys({
      search: Joi.object().keys(search),
      page: Joi.number().integer().min(1).default(1),
      perPage: Joi.number()
        .integer()
        .min(1)
        .max(MAX_PER_PAGE)
        .default(MAX_PER_PAGE),
      sort: Joi.string()
        .regex(
          new RegExp(
            `^(${sortFields.join('|')})(:(asc|desc))?(,(${sortFields.join(
              '|',
            )})(:(asc|desc))?)*$`,
          ),
        )
        .default(sortFields[0] as string),
    })
    .required();
};
