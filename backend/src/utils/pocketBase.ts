import PocketBase from 'pocketbase';

const adminToken = 'tavs-admin-token';

const pb = new PocketBase(
  'https://hockey-app.pockethost.io',
);
pb.authStore.save(adminToken);
pb.autoCancellation(false);

export default pb;
