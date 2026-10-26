const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('manifest declares separate standard and opaque maskable PNG icons with matching files', () => {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  const purposes = new Set();
  const sources = new Set();
  for (const icon of manifest.icons) {
    assert.ok(['any', 'maskable'].includes(icon.purpose));
    assert.equal(icon.type, 'image/png');
    assert.equal(sources.has(icon.src), false, 'use a dedicated file for each icon');
    sources.add(icon.src);
    purposes.add(icon.purpose);
    assert.ok(icon.src.startsWith('img/'));
    assert.equal(path.normalize(icon.src), icon.src);
    const png = fs.readFileSync(icon.src);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.subarray(12, 16).toString('ascii'), 'IHDR');
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.equal(icon.sizes, `${width}x${height}`, icon.src);
    assert.equal(width, height);
    if (icon.purpose === 'maskable') {
      assert.ok(width >= 512);
      assert.equal(png[25], 2, 'maskable PNG uses opaque RGB');
      let offset = 8;
      while (offset < png.length) {
        assert.notEqual(png.subarray(offset + 4, offset + 8).toString('ascii'), 'tRNS', 'no transparent RGB pixels');
        offset += 12 + png.readUInt32BE(offset);
      }
    }
  }
  assert.deepEqual([...purposes].sort(), ['any', 'maskable']);
  for (const size of ['192x192', '512x512']) {
    assert.ok(manifest.icons.some(icon => icon.purpose === 'any' && icon.sizes === size));
  }
});

test('manifest installation preview matches the referenced JPEG dimensions', () => {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  for (const screenshot of manifest.screenshots) {
    const jpeg = fs.readFileSync(screenshot.src);
    assert.equal(jpeg.readUInt16BE(0), 0xffd8);
    assert.equal(screenshot.type, 'image/jpeg');
    assert.equal(screenshot.form_factor, 'narrow');
    let dimensions;
    for (let offset = 2; offset + 8 < jpeg.length;) {
      assert.equal(jpeg[offset], 0xff);
      const marker = jpeg[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        dimensions = `${jpeg.readUInt16BE(offset + 7)}x${jpeg.readUInt16BE(offset + 5)}`;
        break;
      }
      offset += 2 + jpeg.readUInt16BE(offset + 2);
    }
    assert.ok(dimensions, 'JPEG contains a frame header');
    assert.equal(screenshot.sizes, dimensions);
  }
});
