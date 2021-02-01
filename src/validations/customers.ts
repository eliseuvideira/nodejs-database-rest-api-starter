import { createSchema, createSchemaSearch } from '../functions/createSchema';
import { ICustomer, Customer } from '../models/Customer';
import Joi from 'joi';

export const getCustomersQuery = createSchemaSearch<ICustomer>(Customer, {
  customerId: Joi.number().integer(),
  name: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

export const postCustomersBody = createSchema<ICustomer>({
  name: Joi.string().required(),
});

export const getCustomerParams = createSchema<ICustomer>({
  customerId: Joi.number().integer().required(),
});

export const putCustomerBody = createSchema<ICustomer>({
  name: Joi.string().required(),
});
