/* Pages use network-first; cached assets return immediately and refresh in the background. */
const V='kidhub-e63020856e807963';
const CORE=['./','./index.html','./studio.html','./activity-kit.js','./resources.html','./portal.css','./portal.js','./portal-data.js','./dashboard-shell.js','./offline.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('kidhub-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
function timedFetch(request){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
 return fetch(request,{signal:controller.signal}).finally(()=>clearTimeout(timer));
}
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 const page=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
 const cache=caches.open(V);
 const cached=cache.then(c=>c.match(r,{ignoreSearch:true}));
 const network=timedFetch(r).then(async res=>{
  if(res.status>=500)throw Error('Server unavailable');
  if(res.ok){const copy=res.clone();try{await(await cache).put(r,copy)}catch(_){}}
  return res;
 });
 e.waitUntil(network.catch(()=>{}));
 const offline=()=>new Response(page?'<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KidHub offline</title><h1>This page is not saved offline yet.</h1><p>Reconnect and visit this page first.</p><a href="'+self.registration.scope+'index.html">Return to KidHub</a></html>':'Resource unavailable offline',{status:503,headers:{'Content-Type':page?'text/html;charset=utf-8':'text/plain;charset=utf-8'}});
 e.respondWith(page?network.catch(async()=>await cached||offline()):cached.then(m=>m||network).catch(offline));
});
