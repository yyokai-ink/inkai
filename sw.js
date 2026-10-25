/* INKAI sw.js — ЄДИНИЙ service worker: (1) кешує статику й бібліотеки → повторний запуск швидкий навіть при поганому інтернеті,
   (2) приймає push-сповіщення (замінює firebase-messaging-sw.js — той файл більше не потрібен). Ключі беруться з config.js. */
const V="inkai-20261025b";
try{importScripts("config.js")}catch(e){}
try{const c=self.INK_CFG&&INK_CFG.firebase;if(c&&c.apiKey&&!String(c.apiKey).startsWith("PASTE")){
 importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");
 firebase.initializeApp(c);const m=firebase.messaging();
 m.onBackgroundMessage(p=>{const n=p.notification||{};self.registration.showNotification(n.title||"INKAI",{body:n.body||"",icon:"Иконка1.PNG",badge:"Иконка1.PNG",data:{url:"game1.html"}})})}}catch(e){}
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window"}).then(l=>{for(const c of l)if("focus"in c)return c.focus();return clients.openWindow("game1.html")}))});
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>clients.claim())));
const SKIP=/firestore\.googleapis|identitytoolkit|securetoken|firebaseinstallations|fcmregistrations|google-analytics|googletagmanager|accounts\.google|apis\.google\.com\/js\/api/;
const STATIC=/\.(js|css|png|jpe?g|webp|gif|svg|mp3|ogg|wav|json|woff2?)$/i,LIBS=/gstatic\.com\/firebasejs|cdn\.tailwindcss|cdnjs\.cloudflare|fonts\.(googleapis|gstatic)\.com/;
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||r.headers.get("range"))return;const u=new URL(r.url);
 if(SKIP.test(u.host+u.pathname)||/\.mp4$/i.test(u.pathname))return;
 if(r.mode==="navigate"){      // HTML: спершу мережа (щоб завжди була свіжа версія), без мережі — з кешу
  e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ca=>ca.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match("game1.html"))));return}
 if(!((u.origin===location.origin&&STATIC.test(u.pathname))||LIBS.test(u.host+u.pathname)))return;
 e.respondWith(caches.open(V).then(async ca=>{const m=await ca.match(r);      // статика: миттєво з кешу + тихе оновлення (версії файлів у ?v= — нова збірка = нові адреси)
  const net=fetch(r).then(x=>{if(x&&(x.ok||x.type==="opaque"))ca.put(r,x.clone());return x}).catch(()=>m);return m||net}))});
