import { createModel } from '@ev-fns/model';

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
