import '../fixture';
import { request } from '../request';
import { database } from '../../src/utils/database';
import { sign } from '../../src/utils/jwt';

const insertCustomer = async (token: string) => {
  const response = await request()
    .post('/customers')
    .set({ Authorization: `Bearer ${token}` })
    .send({ name: 'customer' });
  if (response.status !== 201) {
    throw new Error(`Invalid status code ${response.status}`);
  }
  return response.body.customer;
};

describe('customers', () => {
  let token: string;

  beforeAll(async () => {
    token = await sign({});
  });

  afterEach(async () => {
    await database.from('customers').delete();
  });

  test('GET /customers', async () => {
    expect.assertions(2);
    const response = await request().get('/customers');
    expect(response.status).toBe(200);
    expect(response.body.customers).toHaveLength(0);
  });

  test('POST /customers', async () => {
    expect.assertions(1);
    const insertCustomer = { name: 'customer' };
    const response = await request()
      .post('/customers')
      .set({ Authorization: `Bearer ${token}` })
      .send(insertCustomer);
    expect(response.status).toBe(201);
  });

  test('GET /customers/:customerId', async () => {
    expect.assertions(2);
    const customer = await insertCustomer(token);
    const response = await request().get(`/customers/${customer.customerId}`);
    expect(response.status).toBe(200);
    expect(response.body.customer).toEqual(customer);
  });

  test('PUT /customers/:customerId', async () => {
    expect.assertions(2);
    const customer = await insertCustomer(token);
    const response = await request()
      .put(`/customers/${customer.customerId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ name: 'new name' });
    expect(response.status).toBe(200);
    expect(response.body.customer).toEqual({ ...customer, name: 'new name' });
  });

  test('DELETE /customers/:customerId', async () => {
    expect.assertions(3);
    const customer = await insertCustomer(token);
    let response;
    response = await request().get(`/customers/${customer.customerId}`);
    expect(response.status).toBe(200);
    response = await request()
      .delete(`/customers/${customer.customerId}`)
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toBe(204);
    response = await request().get(`/customers/${customer.customerId}`);
    expect(response.status).toBe(404);
  });
});
