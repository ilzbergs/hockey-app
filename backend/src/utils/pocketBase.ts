// Code for connecting to PocketBase and authenticating as an admin user
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

// Admin autentifikācija (ja tiešām vajag izmantot šādi)
export async function authenticateAdmin() {
    try {
        const adminAuth = await pb.admins.authWithPassword('toms.ilzbergs@gmail.com', 'korn6171620');
        console.log('Superlietotājs autentificējies veiksmīgi:', adminAuth);
    } catch (error) {
        console.error('Neizdevās autentificēties:', error);
        throw error;
    }
}

export default pb;
