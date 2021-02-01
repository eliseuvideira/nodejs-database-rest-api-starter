import { jwt } from '@ev-fns/jwt';
import { JWT_SECRET } from '../utils/constants';

export const auth = jwt({ secret: JWT_SECRET });
