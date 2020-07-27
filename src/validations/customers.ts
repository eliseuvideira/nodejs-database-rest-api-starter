import { createSchema, createSchemaSearch } from '../utils/createSchema';
import { ICustomer, Customer } from '../models/Customer';
import Joi from 'joi';

export const getCustomersQuery = createSchemaSearch<ICustomer>(Customer, {
  customerId: Joi.number().integer(),
  customerName: Joi.string(),
  customerCreatedAt: Joi.date(),
  customerUpdatedAt: Joi.date(),
});

export const postCustomersBody = createSchema<ICustomer>({
  customerName: Joi.string().required(),
});

export const getCustomerParams = createSchema<ICustomer>({
  customerId: Joi.number().integer().required(),
});

export const putCustomerBody = createSchema<ICustomer>({
  customerName: Joi.string().required(),
});
