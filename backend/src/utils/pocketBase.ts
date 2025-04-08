import PocketBase from 'pocketbase';

const pb = new PocketBase('https://prognozes.fly.dev/');
pb.autoCancellation(false);

export default pb;
