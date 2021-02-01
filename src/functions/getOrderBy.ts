import { camelToSnake } from '@ev-fns/string-fns';

export interface OrderByField {
  column: string;
  order: 'asc' | 'desc';
}

export const getOrderBy = (sort: string): OrderByField[] => {
  const columns: {
    [key: string]: string;
  } = sort.split(',').reduce(
    (prev, column) => ({
      ...prev,
      [column.split(':')[0]]: column.split(':')[1] || 'asc',
    }),
    {},
  );
  return Object.keys(columns).map((key) => ({
    column: key,
    order: columns[key] as 'asc' | 'desc',
  }));
};

export const orderByToSnake = (
  orderBy: { column: string; order: string }[],
): { column: string; order: string }[] => {
  return orderBy.map((item) => ({
    column: camelToSnake(item.column),
    order: item.order,
  }));
};