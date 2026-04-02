const CACHE_NAME = 'prompt-lab-v2.9';

// 初始只缓存本地核心文件，确保安装一定能成功
const MANDATORY_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 安装阶段
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在预缓存本地核心文件...');
      return cache.addAll(MANDATORY_ASSETS);
    })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// 拦截请求策略：网络优先，失败后尝试缓存
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});