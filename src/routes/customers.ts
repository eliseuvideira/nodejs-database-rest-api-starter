import { Router } from 'express';
import {
  getCustomers,
  postCustomers,
  getCustomer,
  putCustomer,
  deleteCustomer,
} from '../controllers/customers';
import { query, body, params } from '../middlewares/validation';
import {
  getCustomersQuery,
  postCustomersBody,
  getCustomerParams,
  putCustomerBody,
} from '../validations/customers';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/customers', query(getCustomersQuery), getCustomers);

router.post('/customers', auth, body(postCustomersBody), postCustomers);

router.get('/customers/:customerId', params(getCustomerParams), getCustomer);

router.put(
  '/customers/:customerId',
  auth,
  params(getCustomerParams),
  body(putCustomerBody),
  putCustomer,
);

router.delete(
  '/customers/:customerId',
  auth,
  params(getCustomerParams),
  deleteCustomer,
);

export default router;
