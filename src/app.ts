import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { readdirSync } from 'fs';
import { join } from 'path';
import { notFound, exception } from './middlewares/errors';

const app = express();

app.use(cors());
app.use(json());

const routes = readdirSync(join(__dirname, 'routes'));
for (const route of routes) {
  app.use(require(join(__dirname, 'routes', route)).default);
}

app.use(notFound);
app.use(exception);

export default app;
