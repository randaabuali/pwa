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
const CACHE_NAME = 'static-cache-v6';
// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  '/pwa',
  'index.html',
  'about.html',
  'contact.html',
  'portfolio.html',
  'favicon.ico',
  'scripts/main.js',
  'styles/main.css',
  'img/about.jpg',
  'img/contact.jpg',
  'img/cover.jpg',
  'img/material-portfolio-screenshot.png',
  'img/person1.jpg',
  'img/person2.jpg',
  'img/portfolio-header.jpg',
  'img/portfolio1.jpg',
  'img/portfolio2.jpg',
  'img/portfolio3.jpg',
  'img/portfolio4.jpg',
  'img/portfolio5.jpg',
  'img/portfolio6.jpg',
  'img/portfolio7.jpg',
  'img/portfolio8.jpg',
  'img/portfolio9.jpg',
  'img/site-logo.png',
  'img/site-logo.svg',
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

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    // External request, or POST, ignore
    return void event.respondWith(fetch(event.request));
  }

  event.respondWith(
    // Always try to download from server first
    fetch(event.request).then(response => {
      // When a download is successful cache the result
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, response)
      });
      // And of course display it
      return response.clone();
    }).catch((_err) => {
      // A failure probably means network access issues
      // See if we have a cached version
      return caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // We did have a cached version, display it
          return cachedResponse;
        }


      });
    })
  );
});
