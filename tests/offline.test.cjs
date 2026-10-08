const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function worker() {
  const handlers = {}, deleted = [], added = [], calls = [];
  const cache = { addAll: async assets => added.push(...assets), match: async request => request.cached || undefined,
    put: async () => calls.push('put') };
  const self = { location: { origin: 'https://example.test' }, clients: { claim: async () => calls.push('claim') },
    skipWaiting: () => calls.push('skip'), addEventListener: (event, handler) => { handlers[event] = handler; } };
  vm.runInNewContext(fs.readFileSync('service-worker.js', 'utf8'), { self, URL,
    caches: { open: async () => cache, keys: async () => ['other-app-cache', 'charakterbogen-cache-v3', 'charakterbogen-cache-v4'],
      delete: async key => deleted.push(key) }, fetch: async () => ({ ok: true, clone() { return this; } }) });
  return { handlers, deleted, added, calls };
}

test('installation precaches every local image and script under relative deployment paths', async () => {
  const w = worker(); let pending;
  w.handlers.install({ waitUntil: promise => { pending = promise; } }); await pending;
  assert.equal(w.calls.includes('skip'), false);
  for (const path of w.added) if (path !== './') assert.equal(fs.existsSync(path), true, path);
  for (const image of fs.readdirSync('img').filter(path => /\.(png|svg)$/.test(path))) assert.ok(w.added.includes('./img/' + image), image);
  assert.ok(w.added.includes('./js/character-store.js'));
});

test('activation awaits clients.claim and preserves unrelated caches', async () => {
  const w = worker(); let pending;
  w.handlers.activate({ waitUntil: promise => { pending = promise; } }); await pending;
  assert.deepEqual(w.deleted, ['charakterbogen-cache-v3']);
  assert.deepEqual(w.calls, ['claim']);
});

test('fetch uses coherent cached app files and ignores POST and cross-origin requests', async () => {
  const w = worker(); let pending;
  const cached = { body: 'offline' };
  w.handlers.fetch({ request: { method: 'GET', url: 'https://example.test/WH_Manuell/index.html', cached }, respondWith: promise => { pending = promise; } });
  assert.equal(await pending, cached);
  const unexpected = () => { throw new Error('should not intercept'); };
  w.handlers.fetch({ request: { method: 'POST', url: 'https://example.test' }, respondWith: unexpected });
  w.handlers.fetch({ request: { method: 'GET', url: 'https://fonts.example.test' }, respondWith: unexpected });
  w.handlers.message({ data: { type: 'SKIP_WAITING' } });
  assert.deepEqual(w.calls, ['skip']);
});
