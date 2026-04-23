import { Request, Response } from 'express';

export async function getSettings(req: Request, res: Response) {
  try {
    res.status(200).json({
      championshipStart: '2026-04-26T14:30:00.000Z',
    });
  } catch (error) {
    res.status(500).json({ message: 'Neizdevās ielādēt settings' });
  }
}
