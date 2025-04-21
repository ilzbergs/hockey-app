import PocketBase from 'pocketbase';
import { Request } from 'express';

export function getPB(req: Request): PocketBase {
  const pb = new PocketBase('http://65.109.11.244:8090');

  // Nolasām cookies no pieprasījuma
  const cookie = req.headers.cookie || '';
  pb.authStore.loadFromCookie(cookie);

  return pb;
}
