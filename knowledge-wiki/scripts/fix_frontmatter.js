#!/usr/bin/env node
/**
 * Fix missing frontmatter fields: type, summary, related
 * Usage: node fix_frontmatter.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const dryRun = process.argv.includes('--dry-run');
const areasDir = 'vault/02-Areas';
const planPath = 'vault/02-Areas/Master-Plan.md';
const rulesPath = 'vault/_Config/rules.md';

// Skip special files (MOCs, plans, paths)
const skipFiles = ['Master-Plan.md', 'Java-Learning-Path.md', 'Java-Core-MOC.md'];

const typeMap = {
  'Basics': '地图型', 'API': '工具型', 'Collections': '机制型',
  'Concurrency': '机制型', 'IO': '机制型', 'JVM': '机制型', 'Advanced': '机制型',
  'Spring': '框架型', 'ORM': '框架型', 'Database': '工具型',
  'Tools': '工具型', 'Testing': '工具型', 'Design-Patterns': '地图型',
  'Distributed-Systems': '地图型', 'High-Concurrency': '机制型',
  'Middleware': '地图型', 'Security': '机制型',
  'DevOps': '框架型'
};

const plan = fs.readFileSync(planPath, 'utf8');
const planEntries = {};
plan.split('\n').forEach(line => {
  const m = line.match(/\[\[([^\]|]+)\\|([^\]]+)\]\]\s*\|\s*([^|]+)\s*\|\s*[✅⬜]/);
  if (m) {
    const link = m[1], name = m[2], summary = m[3].trim();
    planEntries[name] = { link, summary };
  }
});

let rulesTypes = {};
if (fs.existsSync(rulesPath)) {
  const rules = fs.readFileSync(rulesPath, 'utf8');
  const typeSection = rules.match(/#### [^#]+?\n([\s\S]*?)\n#### /);
  if (typeSection) {
    const rows = typeSection[1].match(/\| ([^|]+\.md) \| ([^|]+) \|/g);
    if (rows) rows.forEach(r => {
      const m = r.match(/\| ([^|]+\.md) \| ([^|]+) \|/);
      if (m) rulesTypes[m[1].trim()] = m[2].trim();
    });
  }
}

const files = [];
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.md') && !skipFiles.includes(f)) files.push(full);
  });
}
walk(areasDir);

let fixed = 0, skipped = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return;
  
  const fm = fmMatch[1];
  const fileName = path.basename(file, '.md');
  const relPath = path.relative(areasDir, file).replace(/\\/g, '/');
  
  const missing = [];
  if (!fm.includes('type:')) missing.push('type');
  if (!fm.includes('summary:')) missing.push('summary');
  if (!fm.includes('related:')) missing.push('related');
  
  if (missing.length === 0) { skipped++; return; }
  
  const inferred = {};
  if (missing.includes('type')) {
    inferred.type = rulesTypes[fileName + '.md'] || typeMap[path.basename(path.dirname(file))] || '机制型';
  }
  if (missing.includes('summary')) {
    const entry = planEntries[fileName];
    inferred.summary = entry ? entry.summary : fileName.replace(/-/g, ' ');
  }
  if (missing.includes('related')) {
    inferred.related = '[]';
  }
  
  let newFm = fm;
  if (missing.includes('type')) newFm = newFm.replace(/(status:\s*".*?")/, '$1\ntype: "' + inferred.type + '"');
  if (missing.includes('summary')) newFm = newFm.replace(/(type:\s*".*?")/, '$1\nsummary: "' + inferred.summary + '"');
  if (missing.includes('related')) newFm = newFm.replace(/(summary:\s*".*?")/, '$1\nrelated: ' + inferred.related);
  
  const newContent = content.replace(/^---\n[\s\S]*?\n---\n/, '---\n' + newFm + '\n---\n');
  
  if (dryRun) {
    console.log('[DRY] ' + relPath + ' add: ' + missing.join(', '));
  } else {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('[FIX] ' + relPath + ' add: ' + missing.join(', '));
  }
  fixed++;
});

console.log('\nDone: ' + fixed + ' fixed, ' + skipped + ' already complete');
if (dryRun) console.log('(dry-run mode, no files modified)');
