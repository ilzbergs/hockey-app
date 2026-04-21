import { Request, Response } from 'express';
import { getPB } from '../utils/pocketBase';

/**
 * Get application settings
 */
async function getSettings(req: Request, res: Response) {
  try {
    const pb = getPB(req);

  const settings = await pb.collection('settings').getFullList();

    res.status(200).json(settings);
    console.log(settings);
    
  } catch (error) {
    res.status(500).json({
      message: 'Neizdevās ielādēt settings',
    });
  }
}

export { getSettings };
