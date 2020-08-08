import './utils/fixture';
import { request } from './utils/request';

describe('status', () => {
  test('GET /status', async () => {
    expect.assertions(1);
    const response = await request().get('/status');
    expect(response.status).toBe(204);
  });
});
