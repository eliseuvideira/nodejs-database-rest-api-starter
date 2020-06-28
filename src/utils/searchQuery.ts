import { Model } from './createModel';
import { SearchQueryFields } from './createSchemaSearch';
import { toSnake, camelToSnake } from './toSnake';
import { removeUndefined } from './removeUndefined';
import { orderByToSnake, getOrderBy } from './getOrderBy';
import Knex from 'knex';

export interface Reflection<T> {
  page: number;
  perPage: number;
  search: Partial<T>;
  sort: { column: string; order: 'asc' | 'desc' }[];
}

export const searchQuery = <T>(
  ModelClass: Model<T>,
  database: Knex,
  { page, perPage, search, sort }: SearchQueryFields<T>,
  searchFields: (keyof T)[],
  likeFields: (keyof T)[],
): Promise<[T[], Reflection<T>]> => {
  const orderBy = getOrderBy(sort);
  const reflection: Reflection<T> = {
    page,
    perPage,
    search: search
      ? [...searchFields, ...likeFields].reduce(
          (prev, key) =>
            search[key] != null ? { ...prev, [key]: search[key] } : prev,
          {} as Partial<T>,
        )
      : {},
    sort: orderBy,
  };
  // TODO: move filter, limit, offset and orderBy logic to model
  const modelItems = ModelClass.find(database, null, (builder) => {
    if (search) {
      if (searchFields.length) {
        builder.andWhere(
          toSnake(
            removeUndefined(
              searchFields.reduce(
                (prev, key) =>
                  search[key] != null ? { ...prev, [key]: search[key] } : prev,
                {} as Partial<T>,
              ),
            ),
          ),
        );
      }
      if (likeFields.length) {
        likeFields.forEach(
          (field) =>
            search[field] != null &&
            builder.andWhere(
              camelToSnake(field as string),
              'like',
              `%${search[field]}%`,
            ),
        );
      }
    }
    builder
      .limit(perPage)
      .offset((page - 1) * perPage)
      .orderBy(orderByToSnake(orderBy));
  });
  return Promise.all([modelItems, Promise.resolve(reflection)]);
};
