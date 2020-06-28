import { createModel } from '../utils/createModel';

export interface ICustomer {
  customerId?: number;
  customerName: string;
  customerCreatedAt?: Date;
  customerUpdatedAt?: Date;
}

export const Customer = createModel<ICustomer>(
  'customers',
  ({ customerId }) => ({
    customerId,
  }),
  {
    ignoreInsertFields: [
      'customerId',
      'customerCreatedAt',
      'customerUpdatedAt',
    ],
    ignoreUpdateFields: [
      'customerId',
      'customerCreatedAt',
      'customerUpdatedAt',
    ],
  },
);
