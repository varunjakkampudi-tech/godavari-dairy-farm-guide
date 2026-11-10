(function () {
  'use strict';
  const root = document.currentScript?.dataset.root ?? './';
  let installPrompt = null;
  const installed = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  function updateNetworkNotice() {
    let note = document.getElementById('offline-notice');
    if (!navigator.onLine) {
      if (!note) {
        note = document.createElement('p'); note.id = 'offline-notice'; note.className = 'offline-notice';
        note.setAttribute('role', 'status'); note.setAttribute('aria-live', 'polite');
        note.textContent = 'Offline mode: previously opened guides and saved records remain available on this device.';
        document.body.prepend(note);
      }
    } else note?.remove();
  }
  function installButton() {
    if (!installPrompt || installed() || document.getElementById('install-app')) return;
    const tools = document.querySelector('.headtools'); if (!tools) return;
    const button = document.createElement('button'); button.id = 'install-app'; button.type = 'button';
    button.className = 'iconbtn'; button.textContent = 'Install app';
    button.addEventListener('click', async () => {
      if (!installPrompt) return;
      const promptEvent = installPrompt; await promptEvent.prompt();
      const choice = await promptEvent.userChoice; installPrompt = null; button.remove();
      if (choice?.outcome === 'accepted') window.dispatchEvent(new CustomEvent('gdfg-install-accepted'));
    });
    tools.append(button);
  }
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; installButton(); });
  window.addEventListener('appinstalled', () => { installPrompt = null; document.getElementById('install-app')?.remove(); });
  window.addEventListener('online', updateNetworkNotice);
  window.addEventListener('offline', updateNetworkNotice);
  updateNetworkNotice();
  if ('serviceWorker' in navigator) window.addEventListener('load', () => {
    navigator.serviceWorker.register(root + 'sw.js').catch(() => {});
  });
})();
