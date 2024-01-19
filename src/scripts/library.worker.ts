/**
 * This is a worker script that will fetch owned games
 * of a given user.
 */

self.addEventListener('message', (message) => {
  console.log('Worker: Message received from main script', message);
  const { steamId, apiUrl } = message.data;
  fetch(apiUrl, {
    credentials: 'include'
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Worker: Posting message back to main script');
      postMessage(data);
    });
});
