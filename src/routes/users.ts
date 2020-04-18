import { Router } from 'express';

const router = Router();

router.get('/users', (req, res, _next) => {
  res.status(200).json({ message: 'Hello, World!' });
});

export default router;
