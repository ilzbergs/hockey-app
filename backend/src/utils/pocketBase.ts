import PocketBase from 'pocketbase';
import { Request } from 'express';

export function getPB(req: Request): PocketBase {
  try {
    // const pb = new PocketBase('http://127.0.0.1:8090');
    const pb = new PocketBase('http://157.180.23.211:8090');
    // const pb = new PocketBase('http://pocketbase:8090'); // Docker Compose service nosaukums

    const cookie = req.headers.cookie || '';
    pb.authStore.loadFromCookie(cookie);
    return pb;
  } catch (error) {
    console.error('PocketBase savienojuma kļūda:', error);
    throw error;
  }
}
