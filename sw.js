import { seed } from './src/db';
import { handleRequest } from './src/request';

self.addEventListener('install', function(event) {});

self.addEventListener('activate', async function(event) {
  await seed();
});

self.addEventListener('fetch', async event => {
  handleRequest(event.request);
});
