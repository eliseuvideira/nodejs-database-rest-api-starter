import { Model } from './createModel';
import { SearchQueryFields } from './createSchemaSearch';
import { getOrderBy, OrderByField } from './getOrderBy';
import Knex from 'knex';

export interface Reflection<T> {
  page: number;
  perPage: number;
  search: Partial<T>;
  sort: OrderByField[];
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
  const modelItems = ModelClass.find(
    database,
    search
      ? searchFields.reduce(
          (prev, key) =>
            search[key] != null ? { ...prev, [key]: search[key] } : prev,
          {} as Partial<T>,
        )
      : null,
    {
      page,
      perPage,
      orderBy,
      likeFields:
        search &&
        likeFields.reduce(
          (prev, key) =>
            search[key] != null ? { ...prev, [key]: search[key] } : prev,
          {} as Partial<T>,
        ),
    },
    null,
  );
  return Promise.all([modelItems, Promise.resolve(reflection)]);
};
