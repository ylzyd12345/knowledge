#!/usr/bin/env node
/**
 * Update Master-Plan.md progress based on actual files in 02-Areas/.
 * Usage: node update_progress.js
 */
const fs = require('fs');
const path = require('path');

const areasDir = 'vault/02-Areas';
const planPath = 'vault/02-Areas/Master-Plan.md';

const skipFiles = ['Master-Plan.md', 'Java-Learning-Path.md', 'Java-Core-MOC.md'];
const allFiles = [];
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.md') && !skipFiles.includes(f)) allFiles.push(full);
  });
}
walk(areasDir);
console.log('Found ' + allFiles.length + ' articles in 02-Areas/');

let plan = fs.readFileSync(planPath, 'utf8');
let updated = 0;

allFiles.forEach(file => {
  const relPath = path.relative(areasDir, file).replace(/\\/g, '/');
  const fileName = path.basename(file, '.md');
  const linkPattern = '[[' + relPath.replace(/\.md$/, '') + '\\|';
  if (plan.includes(linkPattern)) return;
  const pendingRegex = new RegExp('\\| (' + fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ') \\| ([^|]+) \\| ⬜ \\|', 'g');
  plan = plan.replace(pendingRegex, (match, name, summary) => {
    updated++;
    return '| [[' + relPath.replace(/\.md$/, '') + '\\|' + name + ']] | ' + summary + ' | ✅ |';
  });
});

let totalDone = 0;
let totalPending = 0;
const catRegex = /\| (一、[^|]+|二、[^|]+|三、[^|]+|四、[^|]+|五、[^|]+|六、[^|]+|七、[^|]+|八、[^|]+|九、[^|]+|十、[^|]+|十一、[^|]+) \| (\d+) \| (\d+) \| (\d+) \|/g;
let m;
while ((m = catRegex.exec(plan)) !== null) {
  totalDone += parseInt(m[3]);
  totalPending += parseInt(m[4]);
}
plan = plan.replace(/\| \*\*合计\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \|/,
  '| **合计** | **' + (totalDone + totalPending) + '** | **' + totalDone + '** | **' + totalPending + '** |');

fs.writeFileSync(planPath, plan, 'utf8');
console.log('Updated ' + updated + ' entries to done');
console.log('Total: ' + totalDone + ' done, ' + totalPending + ' pending');
