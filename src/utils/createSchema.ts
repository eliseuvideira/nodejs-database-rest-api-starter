import Joi from 'joi';
import { Model } from './createModel';
import { removeKeys } from '@ev-fns/object-fns';

const PAGINATION_ITEMS_PER_PAGE =
  +(process.env.PAGINATION_ITEMS_PER_PAGE || 0) || 50;

type SchemaProps<T> = {
  [key in keyof T]: Joi.Schema;
};

export const createSchema = <T>(
  props: SchemaProps<Partial<T>>,
): Joi.ObjectSchema => Joi.object().keys(props).required();

const getEqSchema = <T extends SchemaProps<Partial<T>>>(
  search: T,
  ignoreKeys: (keyof T)[] = [],
): Joi.Schema => Joi.object().keys(removeKeys(search, ignoreKeys));

const getLikeSchema = <T extends SchemaProps<Partial<T>>>(
  search: T,
  ignoreKeys: (keyof T)[] = [],
): Joi.Schema => {
  const invalidKeys = Object.keys(search).filter(
    (key) => search[key as keyof T].type !== 'string',
  );

  return Joi.object().keys(
    removeKeys(search, (invalidKeys as (keyof T)[]).concat(ignoreKeys)),
  );
};

const getInSchema = <T extends SchemaProps<Partial<T>>>(
  search: T,
  ignoreKeys: (keyof T)[] = [],
): Joi.Schema => {
  const keys = Object.keys(removeKeys(search, ignoreKeys)) as (keyof T)[];

  const schema: SchemaProps<any> = {};

  keys.forEach((key) => {
    schema[key] = Joi.array().items(search[key]);
  });

  return Joi.object().keys(schema);
};

export const createSchemaSearch = <T>(
  ModelClass: Model<T>,
  search: SchemaProps<Partial<T>>,
  ignoreKeys?: {
    $eq?: (keyof T & string)[];
    $like?: (keyof T & string)[];
    $in?: (keyof T & string)[];
    $sort?: (keyof T & string)[];
  },
): Joi.ObjectSchema => {
  const sortFields = ModelClass.fields.filter(
    (field) =>
      !ignoreKeys ||
      !ignoreKeys.$sort ||
      !ignoreKeys.$sort.includes(field as keyof T & string),
  );

  return Joi.object()
    .keys({
      page: Joi.number().integer().min(1).default(1),
      perPage: Joi.number()
        .integer()
        .min(1)
        .max(PAGINATION_ITEMS_PER_PAGE)
        .default(PAGINATION_ITEMS_PER_PAGE),
      $sort: Joi.string()
        .regex(
          new RegExp(
            `^(${sortFields.join('|')})(:(asc|desc))?(,(${sortFields.join(
              '|',
            )})(:(asc|desc))?)*$`,
          ),
        )
        .default(`${sortFields[0]}:asc`),
      $eq: getEqSchema(search, ignoreKeys?.$eq),
      $like: getLikeSchema(search, ignoreKeys?.$like),
      $in: getInSchema(search, ignoreKeys?.$in),
    })
    .required();
};
