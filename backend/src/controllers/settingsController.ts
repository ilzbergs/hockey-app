import { Request, Response } from 'express';
import { settings } from '../config/settings';

function getSettings(req: Request, res: Response): void {
  res.status(200).json(settings);
}
 export { getSettings };