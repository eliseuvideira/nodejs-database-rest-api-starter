import { createSchemaSearch } from '../utils/createSchemaSearch';
import { ICustomer } from '../models/Customer';
import Joi from '@hapi/joi';
import { createSchema } from '../utils/createSchema';

export const getCustomersQuery = createSchemaSearch<ICustomer>(
  {
    customerId: Joi.number().integer(),
    customerName: Joi.string(),
    customerCreatedAt: Joi.date(),
    customerUpdatedAt: Joi.date(),
  },
  ['customerId', 'customerName', 'customerCreatedAt', 'customerUpdatedAt'],
);

export const postCustomersBody = createSchema<ICustomer>({
  customerName: Joi.string().required(),
});

export const getCustomerParams = createSchema<ICustomer>({
  customerId: Joi.number().integer().required(),
});

export const putCustomerBody = createSchema<ICustomer>({
  customerName: Joi.string().required(),
});
