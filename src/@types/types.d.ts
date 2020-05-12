/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/interface-name-prefix */
interface ObjectWithAnyProps {
  [key: string]: any;
}

declare namespace Express {
  export interface Request {
    token: ObjectWithAnyProps | undefined;
  }
}
