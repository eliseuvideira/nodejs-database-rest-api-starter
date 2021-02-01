import { jwt } from '@ev-fns/jwt';
import { JWT_SECRET } from '../functions/constants';

export const auth = jwt({ secret: JWT_SECRET });
