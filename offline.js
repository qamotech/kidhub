// The dashboard and library must install offline support without opening Studio first.
(() => {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  let refresh = false;
  const offer = worker => {
    if (!worker || document.getElementById('kh-offline-update')) return;
    const notice = document.createElement('aside');
    notice.id = 'kh-offline-update';
    notice.setAttribute('role', 'status');
    notice.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:2147483647;max-width:calc(100vw - 32px);padding:16px;border:2px solid #6545b5;border-radius:12px;background:white;color:#23304b;font:16px system-ui;box-sizing:border-box';
    notice.append('An update is ready. Save your work before refreshing. ');
    const button = document.createElement('button');
    button.textContent = 'Refresh';
    button.style.cssText = 'min-height:44px;padding:8px 16px';
    button.onclick = () => { refresh = true; worker.postMessage('skip'); };
    notice.append(button);
    document.body.append(notice);
  };
  navigator.serviceWorker.register('sw.js').then(reg => {
    if (navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) offer(worker);
      });
    });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refresh) { refresh = false; location.reload(); }
  });
})();
