import Knex from 'knex';
import { toSnake } from './toSnake';
import { toCamel } from './toCamel';
import { removeKeys } from './removeKeys';

type ModelFind<T> = (
  database: Knex,
  filter?: Partial<T> | null,
  modify?: ((builder: Knex.QueryBuilder) => void) | null,
) => Promise<T[]>;

type ModelFindOne<T> = (
  database: Knex,
  filter?: Partial<T> | null,
  modify?: ((builder: Knex.QueryBuilder) => void) | null,
) => Promise<T | null>;

type ModelCount<T> = (
  database: Knex,
  filter?: Partial<T> | null,
  modify?: ((builder: Knex.QueryBuilder) => void) | null,
) => Promise<number>;

type ModelExists<T> = (
  database: Knex,
  filter?: Partial<T> | null,
  modify?: ((builder: Knex.QueryBuilder) => void) | null,
) => Promise<boolean>;

type ModelInsertOne<T> = (database: Knex, model: T) => Promise<T>;

type ModelUpdateOne<T> = (database: Knex, model: T) => Promise<T>;

type ModelDeleteOne<T> = (database: Knex, model: T) => Promise<void>;

type Model<T> = {
  find: ModelFind<T>;
  findOne: ModelFindOne<T>;
  count: ModelCount<T>;
  exists: ModelExists<T>;
  insertOne: ModelInsertOne<T>;
  updateOne: ModelUpdateOne<T>;
  deleteOne: ModelDeleteOne<T>;
};

interface CreateFindOptions<T> {
  ignoreSelectFields?: (keyof T)[];
}

const createFind = <T>(
  table: string,
  options: CreateFindOptions<T> | null = null,
): ModelFind<T> => async (
  database: Knex,
  filter: Partial<T> | null = null,
  modify: ((builder: Knex.QueryBuilder) => void) | null = null,
): Promise<T[]> => {
  const rows: any[] = await database
    .from(table)
    .where(toSnake(filter || {}))
    // eslint-disable-next-line
    .modify(modify || (() => {}));
  return rows.map((row) =>
    removeKeys(toCamel(row), options?.ignoreSelectFields),
  );
};

interface CreateFindOneOptions<T> {
  ignoreSelectFields?: (keyof T)[];
}

const createFindOne = <T>(
  table: string,
  options: CreateFindOneOptions<T> | null = null,
): ModelFindOne<T> => async (
  database: Knex,
  filter: Partial<T> | null = null,
  modify: ((builder: Knex.QueryBuilder) => void) | null = null,
): Promise<T | null> => {
  const row: any | null = await database
    .from(table)
    .where(toSnake(filter || {}))
    // eslint-disable-next-line
    .modify(modify || (() => {}))
    .first();
  if (!row) {
    return null;
  }
  return removeKeys(toCamel(row), options?.ignoreSelectFields);
};

const createCount = <T>(table: string) => async (
  database: Knex,
  filter: Partial<T> | null = null,
  modify: ((builder: Knex.QueryBuilder) => void) | null = null,
): Promise<number> => {
  const { count } = await database
    .from(table)
    .where(toSnake(filter || {}))
    // eslint-disable-next-line
    .modify(modify || (() => {}))
    .count()
    .first();
  return +count;
};

const createExists = <T>(count: ModelCount<T>): ModelExists<T> => async (
  database: Knex,
  filter: Partial<T> | null = null,
  modify: ((builder: Knex.QueryBuilder) => void) | null = null,
): Promise<boolean> => {
  const rowNumber = await count(database, filter, modify);
  return rowNumber > 0;
};

interface CreateInsertOneOptions<T> {
  ignoreInsertFields?: (keyof T)[];
  ignoreSelectFields?: (keyof T)[];
}

const createInsertOne = <T>(
  table: string,
  options: CreateInsertOneOptions<T> | null = null,
): ModelInsertOne<T> => async (database: Knex, model: T): Promise<T> => {
  const [savedModel] = await database
    .from(table)
    .insert(removeKeys(toSnake(model), options?.ignoreInsertFields))
    .returning('*');
  return removeKeys(toCamel(savedModel), options?.ignoreSelectFields);
};

interface CreateUpdateOneOptions<T> {
  ignoreUpdateFields?: (keyof T)[];
  ignoreSelectFields?: (keyof T)[];
}

const createUpdateOne = <T>(
  table: string,
  getWhere: (props: T) => Partial<T>,
  options: CreateUpdateOneOptions<T> | null = null,
): ModelUpdateOne<T> => async (database: Knex, model: T): Promise<T> => {
  const [savedModel] = await database
    .from(table)
    .update(removeKeys(toSnake(model), options?.ignoreUpdateFields))
    .where(toSnake(getWhere(model)))
    .returning('*');
  return removeKeys(toCamel(savedModel), options?.ignoreSelectFields);
};

const createDeleteOne = <T>(
  table: string,
  getWhere: (props: T) => Partial<T>,
): ModelDeleteOne<T> => async (database: Knex, model: T): Promise<void> => {
  await database
    .from(table)
    .where(toSnake(getWhere(model)))
    .delete();
};

interface CreateModelOptions<T> {
  ignoreSelectFields?: (keyof T)[];
  ignoreInsertFields?: (keyof T)[];
  ignoreUpdateFields?: (keyof T)[];
}

export const createModel = <T>(
  table: string,
  getWhere: (props: T) => Partial<T>,
  options: CreateModelOptions<T> | null = null,
): Model<T> => {
  const find = createFind<T>(
    table,
    (options?.ignoreSelectFields && {
      ignoreSelectFields: options.ignoreSelectFields,
    }) ||
      null,
  );
  const findOne = createFindOne<T>(
    table,
    (options?.ignoreSelectFields && {
      ignoreSelectFields: options.ignoreSelectFields,
    }) ||
      null,
  );
  const count = createCount<T>(table);
  const exists = createExists<T>(count);
  const insertOne = createInsertOne<T>(
    table,
    (options?.ignoreSelectFields && {
      ignoreSelectFields: options.ignoreSelectFields,
      ignoreInsertFields: options.ignoreInsertFields,
    }) ||
      null,
  );
  const updateOne = createUpdateOne<T>(
    table,
    getWhere,
    (options?.ignoreSelectFields && {
      ignoreSelectFields: options.ignoreSelectFields,
      ignoreUpdateFields: options.ignoreUpdateFields,
    }) ||
      null,
  );
  const deleteOne = createDeleteOne<T>(table, getWhere);
  return {
    find,
    findOne,
    count,
    exists,
    insertOne,
    updateOne,
    deleteOne,
  };
};
