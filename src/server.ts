import http from 'http';
import app from './app';

const port = process.env.PORT;
app.set('port', port);

const server = http.createServer(app);

const onError = <T extends { syscall: string; code: string }>(err: T): void => {
  if (err.syscall !== 'listen') {
    throw err;
  }
  switch (err.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    default:
      throw err;
  }
};

const onListening = (): void => {
  const addr = server.address();
  if (addr && typeof addr !== 'string') {
    console.log(`Listening on port ${addr.port}`);
  }
};

(async (): Promise<void> => {
  server.listen({ a: port });
  server.on('error', onError);
  server.on('listening', onListening);
})().catch((err) => {
  console.error(err);
});
