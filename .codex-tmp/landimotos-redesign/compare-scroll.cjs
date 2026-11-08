const fs = require('node:fs');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const before = __dirname + '/scroll-before/';
const after = __dirname + '/scroll-after/';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
assert.deepEqual(read(before + 'hashes.json'), read(after + 'hashes.json'));
const report = { protectedFileHashes: '14 unchanged', viewports: [] };
for (const width of [1440, 1024, 768, 390, 320]) {
  const normalize = nodes => nodes.map(node => ({ ...node, bounds: node.bounds[2] === 0 && node.bounds[3] === 0 ? [0, 0, 0, 0] : node.bounds }));
  const previous = normalize(read(before + `protected-${width}.json`));
  const current = normalize(read(after + `protected-${width}.json`));
  const differences = current.flatMap((node, index) => JSON.stringify(node) === JSON.stringify(previous[index]) ? [] : [{ index, tag: node.tag }]);
  assert.deepEqual(differences, [], `protected differences at ${width}px`);
  report.viewports.push({ width, nodes: current.length, changedTextStylesOrGeometry: 0 });
}
const hash = crypto.createHash('sha256').update(fs.readFileSync('public/assets/videos/landimotos-demo-operativo.mp4')).digest('hex');
assert.equal(hash, fs.readFileSync('.codex-tmp/video-review/recording-sha256.txt', 'utf8').trim());
report.videoHash = 'unchanged';
assert.deepEqual(read(after + 'errors.json'), []);
fs.writeFileSync(after + 'comparison.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
