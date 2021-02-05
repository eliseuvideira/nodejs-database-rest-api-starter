import { Customer, ICustomer } from '../models/Customer';
import { database } from '../functions/database';
import { HttpError } from '@ev-fns/errors';
import { endpoint } from '@ev-fns/endpoint';

export const getCustomers = endpoint(async (req, res) => {
  const { items, totalItems } = await Customer.searchQuery(req.query, database);
  res.status(200).header('x-total-count', `${totalItems}`).json({ items });
});

export const postCustomers = endpoint(async (req, res) => {
  let customer = req.body as ICustomer;

  await database.transaction(async (database) => {
    customer = await Customer.insertOne(database, { ...customer });
  });

  res.status(201).json({ customer });
});

export const getCustomer = endpoint(async (req, res) => {
  const { customerId } = req.params;

  const customer = await Customer.findOne(database, {
    customerId: +customerId,
  });
  if (!customer) {
    throw new HttpError(404, 'Not found');
  }

  res.status(200).json({ customer });
});

export const putCustomer = endpoint(async (req, res) => {
  const { customerId } = req.params;

  const found = await Customer.findOne(database, {
    customerId: +customerId,
  });
  if (!found) {
    throw new HttpError(404, 'Not found');
  }

  let customer = req.body as ICustomer;

  await database.transaction(async (database) => {
    customer = await Customer.updateOne(database, {
      ...customer,
      customerId: +customerId,
    });
  });

  res.status(200).json({ customer });
});

export const patchCustomer = endpoint(async (req, res) => {
  const { customerId } = req.params;

  const found = await Customer.findOne(database, {
    customerId: +customerId,
  });
  if (!found) {
    throw new HttpError(404, 'Not found');
  }

  let customer = req.body as ICustomer;

  await database.transaction(async (database) => {
    customer = await Customer.updateOne(database, {
      ...customer,
      customerId: +customerId,
    });
  });

  res.status(200).json({ customer });
});

export const deleteCustomer = endpoint(async (req, res) => {
  const { customerId } = req.params;

  const customer = await Customer.findOne(database, {
    customerId: +customerId,
  });
  if (!customer) {
    throw new HttpError(404, 'Not found');
  }

  await database.transaction(async (database) => {
    await Customer.deleteOne(database, {
      ...customer,
      customerId: +customerId,
    });
  });

  res.status(204).end();
});
