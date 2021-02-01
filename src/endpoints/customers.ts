import { Customer, customerSearchQuery } from '../models/Customer';
import { database } from '../functions/database';
import { HttpError } from '@ev-fns/errors';
import { endpoint } from '@ev-fns/endpoint';

export const getCustomers = endpoint(async (req, res) => {
  const [customers, filter, pagination] = await customerSearchQuery(
    req.query,
    database,
  );
  res.status(200).json({ customers, filter, pagination });
});

export const postCustomers = endpoint(async (req, res) => {
  const customerData = req.body;
  const customer = await Customer.insertOne(database, customerData);
  res.status(201).json({ customer });
});

export const getCustomer = endpoint(async (req, res) => {
  const { customerId } = (req.params as unknown) as { customerId: number };
  const customer = await Customer.findOne(database, { customerId });
  if (!customer) {
    throw new HttpError(404, 'Not found');
  }
  res.status(200).json({ customer });
});

export const putCustomer = endpoint(async (req, res) => {
  const { customerId } = (req.params as unknown) as { customerId: number };
  const customer = await Customer.findOne(database, { customerId });
  if (!customer) {
    throw new HttpError(404, 'Not found');
  }
  const newCustomerData = req.body;
  const updatedCustomer = await Customer.updateOne(database, {
    ...newCustomerData,
    customerId,
  });
  res.status(200).json({ customer: updatedCustomer });
});

export const deleteCustomer = endpoint(async (req, res) => {
  const { customerId } = (req.params as unknown) as { customerId: number };
  const customer = await Customer.findOne(database, { customerId });
  if (!customer) {
    throw new HttpError(404, 'Not found');
  }
  await Customer.deleteOne(database, customer);
  res.status(204).end();
});
