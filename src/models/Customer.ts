import { createModel, createSearchQuery } from '../utils/createModel';

export interface ICustomer {
  customerId?: number;
  customerName: string;
  customerCreatedAt?: Date;
  customerUpdatedAt?: Date;
}

export const Customer = createModel<ICustomer>(
  'customers',
  ['customerId', 'customerName', 'customerCreatedAt', 'customerUpdatedAt'],
  ({ customerId }) => ({
    customerId,
  }),
  {
    insert: ['customerId', 'customerCreatedAt', 'customerUpdatedAt'],
    update: ['customerId', 'customerCreatedAt', 'customerUpdatedAt'],
  },
);

export const customerSearchQuery = createSearchQuery<ICustomer>(Customer);
