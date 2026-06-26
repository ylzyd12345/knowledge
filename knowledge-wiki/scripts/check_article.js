#!/usr/bin/env node
/**
 * Article quality checker for the knowledge-wiki skill.
 * Usage: node check_article.js <article-path> [--master-plan <path>]
 */
const fs = require('fs');
const path = require('path');

const articlePath = process.argv[2];
const planPath = process.argv[4] || 'vault/02-Areas/Master-Plan.md';

if (!articlePath) {
  console.error('Usage: node check_article.js <article-path> [--master-plan <path>]');
  process.exit(1);
}

const errors = [];
const warnings = [];
let content;
try {
  content = fs.readFileSync(articlePath, 'utf8');
} catch (e) {
  console.error('Cannot read file: ' + articlePath);
  process.exit(1);
}

// 1. Frontmatter check
const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
if (!fmMatch) {
  errors.push('Missing YAML frontmatter');
} else {
  const fm = fmMatch[1];
  const required = ['title', 'tags', 'stage', 'status', 'type', 'summary', 'related'];
  required.forEach(field => {
    if (!fm.includes(field + ':')) errors.push('Frontmatter missing field: ' + field);
  });
  const titleMatch = fm.match(/title:\s*"([^"]+)"/);
  const fileName = path.basename(articlePath, '.md');
  if (titleMatch && titleMatch[1] !== fileName) {
    errors.push('title "' + titleMatch[1] + '" does not match filename "' + fileName + '"');
  }
}

// 2. 8 mandatory sections
const sections = ['概念定义', '核心原理', '实际应用', '源码分析', '面试常见题目', '思维发散', '相关概念（待扩展）'];
sections.forEach(s => {
  if (!content.includes('## ' + s)) errors.push('Missing section: ## ' + s);
});

// 3. Opening blockquote
if (!content.match(/^> /m)) warnings.push('Missing opening blockquote (summary)');

// 4. Link format
const badLinks = content.match(/\[\[[^\]|]+\]\]/g);
if (badLinks) warnings.push('Links without display name: ' + badLinks.length + ' found (use [[path|display]])');

// 5. Related section should be plain text (no [[ ]] )
const relatedSection = content.match(/## 相关概念（待扩展）\n([\s\S]*?)$/);
if (relatedSection && relatedSection[1].includes('[[')) {
  errors.push('Related concepts section contains wiki links (should be plain text)');
}

// 6. Master-Plan consistency
if (fs.existsSync(planPath)) {
  const plan = fs.readFileSync(planPath, 'utf8');
  const summaryMatch = content.match(/summary:\s*"([^"]+)"/);
  if (summaryMatch) {
    const summary = summaryMatch[1];
    if (!plan.includes(summary)) warnings.push('summary not found in Master-Plan.md');
  }
}

// Output
console.log('\n=== Article Quality Check ===');
console.log('File: ' + articlePath);
if (errors.length === 0 && warnings.length === 0) {
  console.log('All checks passed');
} else {
  errors.forEach(e => console.log('ERROR: ' + e));
  warnings.forEach(w => console.log('WARN:  ' + w));
  if (errors.length > 0) process.exit(1);
}
