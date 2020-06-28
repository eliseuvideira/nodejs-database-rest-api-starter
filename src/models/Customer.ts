import { createModel } from '../utils/createModel';

export interface ICustomer {
  customerId?: number;
  customerName: string;
}

export const Customer = createModel<ICustomer>(
  'customer',
  ({ customerId }) => ({
    customerId,
  }),
);
