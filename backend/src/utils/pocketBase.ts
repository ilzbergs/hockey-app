import PocketBase from 'pocketbase';

const adminToken = 'tavs-admin-token';

const pb = new PocketBase(
  process.env.POCKETBASE_URL
);
pb.authStore.save(adminToken);
pb.autoCancellation(false);

export default pb;
