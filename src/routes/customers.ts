import { Router } from 'express';
import {
  getCustomers,
  postCustomers,
  getCustomer,
  putCustomer,
  deleteCustomer,
} from '../controllers/customers';

const router = Router();

router.get('/customers', getCustomers);

router.post('/customers', postCustomers);

router.get('/customers/:customerId', getCustomer);

router.put('/customers/:customerId', putCustomer);

router.delete('/customers/:customerId', deleteCustomer);

export default router;
