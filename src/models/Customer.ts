import { createModel, createSearchQuery } from '../functions/createModel';

export interface ICustomer {
  customerId?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Customer = createModel<ICustomer>(
  'customers',
  ['customerId', 'name', 'createdAt', 'updatedAt'],
  ({ customerId }) => ({
    customerId,
  }),
  {
    insert: ['customerId', 'createdAt', 'updatedAt'],
    update: ['customerId', 'createdAt', 'updatedAt'],
  },
);

export const customerSearchQuery = createSearchQuery<ICustomer>(Customer);
