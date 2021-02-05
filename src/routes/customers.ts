import { Router } from 'express';
import {
  getCustomers,
  postCustomers,
  getCustomer,
  putCustomer,
  deleteCustomer,
  patchCustomer,
} from '../endpoints/customers';
import { query, body, params } from '@ev-fns/validation';
import {
  getCustomersQuery,
  postCustomersBody,
  getCustomerParams,
  putCustomerBody,
  patchCustomerBody,
} from '../validations/customers';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * GET /customers
 * @tag Customers
 * @response 200
 * @responseContent {Customer[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get('/customers', query(getCustomersQuery), getCustomers);

/**
 * POST /customers
 * @tag Customers
 * @security BearerAuth
 * @bodyContent {CustomerPostBody} application/json
 * @response 201
 * @responseContent {Customer} 201.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/customers', auth, body(postCustomersBody), postCustomers);

/**
 * GET /customers/{customerId}
 * @tag Customers
 * @pathParam {integer} customerId
 * @response 200
 * @responseContent {Customer} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.get('/customers/:customerId', params(getCustomerParams), getCustomer);

/**
 * PUT /customers/{customerId}
 * @tag Customers
 * @security BearerAuth
 * @pathParam {integer} customerId
 * @bodyContent {CustomerPutBody} application/json
 * @response 201
 * @responseContent {Customer} 201.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.put(
  '/customers/:customerId',
  auth,
  params(getCustomerParams),
  body(putCustomerBody),
  putCustomer,
);

/**
 * PATCH /customers/{customerId}
 * @tag Customers
 * @security BearerAuth
 * @pathParam {integer} customerId
 * @bodyContent {CustomerPatchBody} application/json
 * @response 200
 * @responseContent {Customer} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.patch(
  '/customers/:customerId',
  auth,
  params(getCustomerParams),
  body(patchCustomerBody),
  patchCustomer,
);

/**
 * DELETE /customers/{customerId}
 * @tag Customers
 * @security BearerAuth
 * @pathParam {integer} customerId
 * @response 204
 * @response default
 * @responseContent {Error} default.application/json
 */
router.delete(
  '/customers/:customerId',
  auth,
  params(getCustomerParams),
  deleteCustomer,
);

export default router;
