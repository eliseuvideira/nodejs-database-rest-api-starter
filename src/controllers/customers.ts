import { RequestHandler } from 'express';
import { Customer, customerSearchQuery } from '../models/Customer';
import { database } from '../utils/database';
import { HttpError } from '../utils/HttpError';

export const getCustomers: RequestHandler = async (req, res, next) => {
  try {
    const [customers, filter, pagination] = await customerSearchQuery(
      req.query,
      database,
    );
    res.status(200).json({ customers, filter, pagination });
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
