import { RequestHandler } from 'express';
import { Customer, ICustomer } from '../models/Customer';
import { database } from '../utils/database';
import { HttpError } from '../utils/HttpError';
import { searchQuery } from '../utils/searchQuery';
import { SearchQueryFields } from '../utils/createSchemaSearch';

export const getCustomers: RequestHandler = async (req, res, next) => {
  try {
    const {
      page,
      perPage,
      search,
      sort,
    } = (req.query as unknown) as SearchQueryFields<ICustomer>;
    const [customers, reflection] = await searchQuery(
      Customer,
      database,
      {
        page,
        perPage,
        search,
        sort,
      },
      ['customerId', 'customerCreatedAt', 'customerUpdatedAt'],
      ['customerName'],
    );
    res.status(200).json({ customers, reflection });
  } catch (err) {
    next(err);
  }
};
export const postCustomers: RequestHandler = async (req, res, next) => {
  try {
    const customerData = req.body;
    const customer = await Customer.insertOne(database, customerData);
    res.status(201).json({ customer });
  } catch (err) {
    next(err);
  }
};

export const getCustomer: RequestHandler = async (req, res, next) => {
  try {
    const { customerId } = (req.params as unknown) as { customerId: number };
    const customer = await Customer.findOne(database, { customerId });
    if (!customer) {
      throw new HttpError(404, 'Not found');
    }
    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};

export const putCustomer: RequestHandler = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer: RequestHandler = async (req, res, next) => {
  try {
    const { customerId } = (req.params as unknown) as { customerId: number };
    const customer = await Customer.findOne(database, { customerId });
    if (!customer) {
      throw new HttpError(404, 'Not found');
    }
    await Customer.deleteOne(database, customer);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
