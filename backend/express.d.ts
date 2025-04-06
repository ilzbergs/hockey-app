// express.d.ts
import { User } from './src/models/userModel';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}
