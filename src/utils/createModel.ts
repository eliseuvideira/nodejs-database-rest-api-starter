import Knex, { QueryBuilder } from 'knex';
import { toSnake, camelToSnake } from './toSnake';
import { toCamel } from './toCamel';
import { removeKeys } from './removeKeys';
import { getOrderBy, orderByToSnake } from './getOrderBy';

type PropsToArray<T> = {
  [key in keyof T]: any[];
};

type SortPropsField<T> = {
  column: keyof T & string;
  order: 'asc' | 'desc';
};

type FilterProps<T> = Partial<T> & {
  $like?: Partial<T>;
  $in?: PropsToArray<Partial<T>>;
  $sort?: SortPropsField<Partial<T>>[];
  $limit?: number;
  $offset?: number;
};

type PaginationProps = {
  page: number;
  perPage: number;
  lastPage: number;
  totalItems: number;
};

type ModifyFunction = (builder: Knex.QueryBuilder) => void;

type ModelIgnoreKeys<T> = {
  insert?: (keyof T)[];
  update?: (keyof T)[];
  select?: (keyof T)[];
};

type ModelFind<T> = (
  database: Knex,
  filter?: FilterProps<T> | null,
  modify?: ModifyFunction | null,
) => Promise<T[]>;

type ModelFindOne<T> = (
  database: Knex,
  filter?: FilterProps<T> | null,
  modify?: ModifyFunction | null,
) => Promise<T | null>;

type ModelCount<T> = (
  database: Knex,
  filter?: FilterProps<T> | null,
  modify?: ModifyFunction | null,
) => Promise<number>;

type ModelExists<T> = (
  database: Knex,
  filter?: FilterProps<T> | null,
  modify?: ModifyFunction | null,
) => Promise<boolean>;

type ModelInsertOne<T> = (database: Knex, model: T) => Promise<T>;

type ModelUpdateOne<T> = (database: Knex, model: T) => Promise<T>;

type ModelDeleteOne<T> = (database: Knex, model: T) => Promise<void>;

export type Model<T> = {
  table: string;
  fields: (keyof T)[];
  find: ModelFind<T>;
  findOne: ModelFindOne<T>;
  count: ModelCount<T>;
  exists: ModelExists<T>;
  insertOne: ModelInsertOne<T>;
  updateOne: ModelUpdateOne<T>;
  deleteOne: ModelDeleteOne<T>;
};

export const getWhere = <T>(filter: FilterProps<T>): Partial<T> =>
  removeKeys(filter, ['$in', '$like', '$limit', '$offset', '$sort']);

const applyLike = <T>(
  builder: Knex.QueryBuilder,
  likeFields: Partial<T>,
): void => {
  for (const key of Object.keys(likeFields)) {
    builder.andWhere(
      camelToSnake(key),
      'like',
      `%${likeFields[key as keyof T]}%`,
    );
  }
};

const applyIn = <T>(
  builder: Knex.QueryBuilder,
  inFields: PropsToArray<T>,
): void => {
  for (const key of Object.keys(inFields)) {
    builder.whereIn(camelToSnake(key), inFields[key as keyof T]);
  }
};

const applyFilter = <T>(
  builder: Knex.QueryBuilder,
  filter: FilterProps<T>,
): void => {
  if (filter.$like) {
    applyLike(builder, filter.$like);
  }
  if (filter.$in) {
    applyIn(builder, filter.$in);
  }
  if (filter.$limit) {
    builder.limit(filter.$limit);
  }
  if (filter.$offset) {
    builder.offset(filter.$offset);
  }
  if (filter.$sort) {
    builder.orderBy(orderByToSnake(filter.$sort));
  }
};

const getModify = <T>(
  modify: ModifyFunction | null = null,
  filter: FilterProps<T> | null = null,
) => (builder: QueryBuilder): void => {
  if (modify) {
    modify(builder);
  }
  if (filter) {
    applyFilter(builder, filter);
  }
};

const createFind = <T>(
  table: string,
  ignoreKeys: ModelIgnoreKeys<T> | null = null,
): ModelFind<T> => async (
  database,
  filter = null,
  modify = null,
): Promise<T[]> => {
  const rows: any[] = await database
    .from(table)
    .where(toSnake(getWhere(filter || {})))
    .modify(getModify(modify, filter));
  return rows.map((row) =>
    removeKeys(toCamel(row), (ignoreKeys && ignoreKeys.select) || []),
  );
};

const createFindOne = <T>(
  table: string,
  ignoreKeys: ModelIgnoreKeys<T> | null = null,
): ModelFindOne<T> => async (
  database,
  filter = null,
  modify = null,
): Promise<T | null> => {
  const row: any | null = await database
    .from(table)
    .where(toSnake(getWhere(filter || {})))
    .modify(getModify(modify, filter))
    .first();
  if (!row) {
    return null;
  }
  return removeKeys(toCamel(row), (ignoreKeys && ignoreKeys.select) || []);
};

const createCount = <T>(table: string): ModelCount<T> => async (
  database,
  filter = null,
  modify = null,
): Promise<number> => {
  const { count } = await database
    .from(table)
    .where(toSnake(getWhere(filter || {})))
    .modify(
      getModify(
        modify,
        removeKeys((filter || {}) as FilterProps<T>, [
          '$sort',
          '$limit',
          '$offset',
        ]),
      ),
    )
    .count()
    .first();
  return +count;
};

const createExists = <T>(count: ModelCount<T>): ModelExists<T> => async (
  database,
  filter = null,
  modify = null,
): Promise<boolean> => {
  const rowNumber = await count(database, filter, modify);
  return rowNumber > 0;
};

const createInsertOne = <T>(
  table: string,
  ignoreKeys: ModelIgnoreKeys<T> | null = null,
): ModelInsertOne<T> => async (database: Knex, model: T): Promise<T> => {
  const [savedModel] = await database
    .from(table)
    .insert(removeKeys(toSnake(model), (ignoreKeys && ignoreKeys.insert) || []))
    .returning('*');
  return removeKeys(
    toCamel(savedModel),
    (ignoreKeys && ignoreKeys.select) || [],
  );
};

const createUpdateOne = <T>(
  table: string,
  getPrimaryKey: (props: T) => Partial<T>,
  ignoreKeys: ModelIgnoreKeys<T> | null = null,
): ModelUpdateOne<T> => async (database: Knex, model: T): Promise<T> => {
  const [savedModel] = await database
    .from(table)
    .update(removeKeys(toSnake(model), (ignoreKeys && ignoreKeys.update) || []))
    .where(toSnake(getPrimaryKey(model)))
    .returning('*');
  return removeKeys(
    toCamel(savedModel),
    (ignoreKeys && ignoreKeys.select) || [],
  );
};

const createDeleteOne = <T>(
  table: string,
  getPrimaryKey: (props: T) => Partial<T>,
): ModelDeleteOne<T> => async (database: Knex, model: T): Promise<void> => {
  await database
    .from(table)
    .where(toSnake(getPrimaryKey(model)))
    .delete();
};

export const createModel = <T>(
  table: string,
  fields: (keyof T & string)[],
  getPrimaryKey: (props: T) => Partial<T>,
  ignoreKeys: ModelIgnoreKeys<T> | null = null,
): Model<T> => {
  const find = createFind<T>(table, ignoreKeys);
  const findOne = createFindOne<T>(table, ignoreKeys);
  const count = createCount<T>(table);
  const exists = createExists<T>(count);
  const insertOne = createInsertOne<T>(table, ignoreKeys);
  const updateOne = createUpdateOne<T>(table, getPrimaryKey, ignoreKeys);
  const deleteOne = createDeleteOne<T>(table, getPrimaryKey);
  return {
    table,
    fields,
    find,
    findOne,
    count,
    exists,
    insertOne,
    updateOne,
    deleteOne,
  };
};

const merge = <T>(
  obj1?: T | null,
  obj2?: T | null,
): Partial<T> | undefined | null => {
  if (!obj1 || !obj2) {
    return obj1 || obj2 || undefined;
  }
  return { ...obj1, ...obj2 };
};

export const createSearchQuery = <T>(ModelClass: Model<T>) => async (
  query: any,
  database: Knex,
  filter: FilterProps<T> | null = null,
  modify: ModifyFunction | null = null,
): Promise<[T[], FilterProps<T>, PaginationProps]> => {
  const { page, perPage, $eq, $like, $in, $sort } = query;

  const mergedFilter = {
    ...$eq,
    ...getWhere(filter || {}),
    $in: merge($in, filter?.$in),
    $like: merge($like, filter?.$like),
    $limit: filter?.$limit != null ? filter.$limit : perPage,
    $offset: filter?.$offset != null ? filter.$offset : (page - 1) * perPage,
    $sort: filter?.$sort != null ? filter.$sort : getOrderBy($sort),
  };

  const totalItems = await ModelClass.count(database, mergedFilter, modify);

  const pagination = {
    page,
    perPage,
    totalItems,
    lastPage: Math.ceil(totalItems / perPage),
  };

  const items = await ModelClass.find(database, mergedFilter, modify);

  return [items, mergedFilter, pagination];
};
