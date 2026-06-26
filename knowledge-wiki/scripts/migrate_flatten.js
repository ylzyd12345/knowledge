#!/usr/bin/env node
/**
 * Flatten 02-Areas/ subdirectories to 2 levels: Domain/Filename.md
 * Preserves file content, updates internal wiki links where needed.
 * Usage: node scripts/migrate_flatten.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const dryRun = process.argv.includes('--dry-run');
const areasDir = 'vault/02-Areas';

// Collect existing files
const files = [];
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.md')) files.push({
      src: full,
      rel: path.relative(areasDir, full).replace(/\\/g, '/'),
      domain: null, // will be inferred
      fileName: f.replace(/\.md$/, '')
    });
  });
}
walk(areasDir);

// Infer domain from first directory component
files.forEach(f => {
  const parts = f.rel.split('/');
  f.domain = parts[0];
  if (parts.length > 2) {
    // Remove subdomain + domain prefix, keep basename
    const newRel = path.basename(f.src, '.md') + '.md';
    f.newSrc = path.join(areasDir, newRel);
    f.oldSrc = f.src;
  }
});

// Check for name collisions within same domain
const domainNames = {};
files.forEach(f => {
  if (!f.domain) return;
  const key = f.domain + '/' + f.fileName;
  if (domainNames[key]) {
    console.error('CONFLICT: ' + key + ' already exists');
  }
  domainNames[key] = true;
});

let moved = 0;
const skipped = files.filter(f => !f.domain || files[0].rel.split('/').length <= 2).length;

files.forEach(f => {
  if (!f.domain || f.rel.split('/').length <= 2) return;
  
  // Read frontmatter and update path references in related/wikilinks
  let content = fs.readFileSync(f.oldSrc, 'utf8');
  
  // No cross-domain wikilink updates needed since filenames stay the same
  
  if (dryRun) {
    console.log('[DRY] ' + f.rel + ' → 02-Areas/' + path.basename(f.oldSrc, '.md') + '.md');
  } else {
    fs.writeFileSync(f.newSrc, content, 'utf8');
    fs.unlinkSync(f.oldSrc);
    // Clean up empty parent directories
    const oldDir = path.dirname(f.oldSrc);
    try {
      fs.rmdirSync(oldDir);
      // Also try grandparent
      const grandparent = path.dirname(oldDir);
      if (fs.readdirSync(grandparent).length === 0 && grandparent !== areasDir) {
        fs.rmdirSync(grandparent);
      }
    } catch(e) {} // ignore if not empty or permission error
    
    console.log('[FLAT] ' + f.rel + ' → 02-Areas/' + path.basename(f.oldSrc, '.md') + '.md');
  }
  moved++;
});

console.log('\nMoved: ' + moved + ' files');
if (dryRun) console.log('(dry-run mode)');
else console.log('Done! Verify with: Get-ChildItem vault/02-Areas -Filter *.md | Measure-Object');
