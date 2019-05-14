/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v3';
const DATA_CACHE_NAME = 'data-cache-v4';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  '/pwa',
  'index.html',
  'about.html',
  'contact.html',
  'portfolio.html',
  'favicon.ico',
  '/pwa/scripts/main.js',
  '/pwa/styles/main.css',
  '/pwa/img/about.jpg',
  '/pwa/img/contact.jpg',
  '/pwa/img/cover.jpg',
  '/pwa/img/material-portfolio-screenshot.jpg',
  '/pwa/img/person1.jpg',
  '/pwa/img/person2.jpg',
  '/pwa/img/portfolio-header.jpg',
  '/pwa/img/portfolio1.jpg',
  '/pwa/img/portfolio2.jpg',
  '/pwa/img/portfolio3.jpg',
  '/pwa/img/portfolio4.jpg',
  '/pwa/img/portfolio5.jpg',
  '/pwa/img/portfolio6.jpg',
  '/pwa/img/portfolio7.jpg',
  '/pwa/img/portfolio8.jpg',
  '/pwa/img/portfolio9.jpg',
  '/pwa/img/site-logo.png',
  '/pwa/img/site-logo.svg',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // CODELAB: Add fetch event handler here.
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match('offline.html');
                });
          })
  );
});
