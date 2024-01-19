/**
 * This is a worker script that will find all the games
 * that are shared between set of friends.
 */

self.addEventListener('message', (message) => {
  const users: User[] = message.data;
  postMessage('tralala');
});
