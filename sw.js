// Minimaler Service Worker. Zwei Jobs:
// 1. Erfüllt die Installierbarkeits-Voraussetzung fürs Homescreen-Icon (siehe manifest.json).
// 2. Nötig, damit Benachrichtigungen auf dem Handy zuverlässig ankommen - Android Chrome
//    unterstützt "new Notification()" direkt aus der Seite NICHT, nur
//    registration.showNotification() über einen aktiven Service Worker (siehe notifyUser()
//    in script.js). Kein Offline-Caching, das wurde nicht gebraucht/gewünscht.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
// Reiner Pass-Through ohne Caching - ein fehlgeschlagener Fetch (z.B. ein blockiertes externes
// Vereinswappen) soll ganz normal als Netzwerkfehler durchschlagen, statt hier künstlich in
// eine erfundene Antwort verwandelt zu werden (das würde den echten Fehler nur verschleiern).
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
