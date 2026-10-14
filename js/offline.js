window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  if (splash) splash.style.display = 'none';
  if (!('serviceWorker' in navigator)) return;
  let requestedUpdate = false;
  let reloading = false;
  const prompted = new WeakSet();
  function promptUpdate(worker) {
    if (!worker || prompted.has(worker)) return;
    prompted.add(worker);
    // Never reload over an incomplete load or an unsaved storage failure.
    if (confirm(t('update_available'))) {
      if (!saveState()) { alert(t('update_save_failed')); return; }
      requestedUpdate = true;
      document.querySelectorAll('button, input, select, textarea').forEach(el => { el.disabled = true; });
      worker.postMessage({ type: 'SKIP_WAITING' });
    }
  }
  navigator.serviceWorker.register('./service-worker.js').then(reg => {
    promptUpdate(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(worker);
      });
    });
  }).catch(error => { console.error(t('offline_error'), error); });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Another tab's update must not force this tab to reload without consent.
    if (requestedUpdate && !reloading) { reloading = true; window.location.reload(); }
  });
});
