/**
 * Validate knowledge base articles against rules and scoring criteria.
 * Usage: node validate_articles.js [domain]
 *   domain: optional, e.g. "Java-Core" to validate only that domain
 */

const fs = require('fs');
const path = require('path');

const VAULT_ROOT = 'vault/02-Areas';
const REQUIRED_FRONTMATTER = ['title', 'tags', 'stage', 'status', 'type', 'summary'];
const REQUIRED_SECTIONS = [
  '概念定义', '核心原理', '实际应用', '源码分析',
  '面试常见题目', '思维发散', '相关概念'
];
const VALID_TYPES = ['地图型', '机制型', '工具型', '框架型'];
const VALID_STATUSES = ['fleeting', 'literature', 'permanent'];
const WORD_COUNT_RANGES = {
  '地图型': [1500, 2500],
  '机制型': [3000, 5000],
  '工具型': [2000, 3500],
  '框架型': [2500, 4000],
};

function extractFrontmatter(content) {
  if (!content.startsWith('---\n')) return null;
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const yaml = content.substring(4, end);
  const fm = {};
  let currentKey = null;
  let inArray = false;
  const arrayItems = [];

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inArray) {
      if (trimmed.startsWith('- ')) {
        arrayItems.push(trimmed.substring(2).trim().replace(/^["']|["']$/g, ''));
      } else {
        fm[currentKey] = arrayItems;
        inArray = false;
        arrayItems.length = 0;
      }
    }

    if (!inArray) {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0 && !trimmed.startsWith('-')) {
        const key = trimmed.substring(0, colonIdx).trim();
        const val = trimmed.substring(colonIdx + 1).trim();
        if (val === '') {
          currentKey = key;
          inArray = true;
          arrayItems.length = 0;
        } else {
          fm[key] = val.replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  if (inArray && currentKey) {
    fm[currentKey] = arrayItems;
  }

  return fm;
}

function countChineseChars(content) {
  const bodyStart = content.indexOf('\n---\n', 4);
  const body = bodyStart > -1 ? content.substring(bodyStart + 5) : content;
  const chineseChars = body.match(/[\u4e00-\u9fff]/g);
  return chineseChars ? chineseChars.length : 0;
}

function checkSections(content) {
  const missing = [];
  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(`## ${section}`)) {
      missing.push(section);
    }
  }
  return missing;
}

function isKebabCase(filename) {
  return /^[A-Z][a-zA-Z0-9]*(-[A-Z][a-zA-Z0-9]*)*\.md$/.test(filename) ||
         /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)*\.md$/.test(filename);
}

function validateFile(filePath) {
  const issues = [];
  const warnings = [];
  const info = [];
  const filename = path.basename(filePath);
  const relPath = filePath.replace(/\\/g, '/');

  const content = fs.readFileSync(filePath, 'utf8');
  const fm = extractFrontmatter(content);

  // Check file naming
  if (!isKebabCase(filename)) {
    issues.push(`File name "${filename}" is not English Kebab-case`);
  }

  // Check frontmatter
  if (!fm) {
    issues.push('Missing or malformed frontmatter');
    return { file: relPath, issues, warnings, info, score: 0 };
  }

  for (const field of REQUIRED_FRONTMATTER) {
    if (!(field in fm) || fm[field] === '' || fm[field] === undefined) {
      issues.push(`Missing frontmatter field: ${field}`);
    }
  }

  // Check type validity
  if (fm.type && !VALID_TYPES.includes(fm.type)) {
    warnings.push(`Invalid type "${fm.type}", expected one of: ${VALID_TYPES.join(', ')}`);
  }

  // Check status validity
  if (fm.status && !VALID_STATUSES.includes(fm.status)) {
    warnings.push(`Invalid status "${fm.status}", expected one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Check title matches filename
  const expectedTitle = filename.replace('.md', '');
  if (fm.title && fm.title !== expectedTitle) {
    warnings.push(`Title "${fm.title}" does not match filename "${expectedTitle}"`);
  }

  // Check word count
  if (fm.type && WORD_COUNT_RANGES[fm.type]) {
    const charCount = countChineseChars(content);
    const [min, max] = WORD_COUNT_RANGES[fm.type];
    if (charCount < min) {
      warnings.push(`Chinese char count (${charCount}) below ${fm.type} minimum (${min})`);
    } else if (charCount > max) {
      warnings.push(`Chinese char count (${charCount}) above ${fm.type} maximum (${max})`);
    } else {
      info.push(`Chinese chars: ${charCount} (within ${fm.type} range ${min}-${max})`);
    }
  }

  // Check required sections
  const missingSections = checkSections(content);
  if (missingSections.length > 0) {
    issues.push(`Missing sections: ${missingSections.join(', ')}`);
  }

  // Check tags is array
  if (fm.tags && !Array.isArray(fm.tags)) {
    warnings.push('tags should be an array');
  }

  // Score estimation
  let score = 10;
  score -= issues.length * 1.5;
  score -= warnings.length * 0.5;
  score = Math.max(0, Math.min(10, score));

  return { file: relPath, issues, warnings, info, score: Math.round(score * 10) / 10, fm };
}

function main() {
  const domainFilter = process.argv[2];
  const searchDir = domainFilter ? path.join(VAULT_ROOT, domainFilter) : VAULT_ROOT;

  if (!fs.existsSync(searchDir)) {
    console.error(`Directory not found: ${searchDir}`);
    process.exit(1);
  }

  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.md') && !entry.name.includes('MOC') && !entry.name.includes('Learning-Path')) {
        files.push(fullPath);
      }
    }
  }
  walk(searchDir);

  console.log(`\nValidating ${files.length} articles in ${searchDir}\n`);
  console.log('='.repeat(80));

  let totalScore = 0;
  let issueCount = 0;
  let warnCount = 0;
  const results = [];

  for (const file of files) {
    const result = validateFile(file);
    results.push(result);
    totalScore += result.score;
    issueCount += result.issues.length;
    warnCount += result.warnings.length;

    const statusIcon = result.issues.length > 0 ? '❌' : result.warnings.length > 0 ? '⚠️' : '✅';
    console.log(`\n${statusIcon} ${result.file} (score: ${result.score}/10)`);

    if (result.fm) {
      console.log(`   type: ${result.fm.type || 'N/A'} | stage: ${result.fm.stage || 'N/A'} | status: ${result.fm.status || 'N/A'}`);
    }

    for (const issue of result.issues) {
      console.log(`   ❌ ${issue}`);
    }
    for (const warn of result.warnings) {
      console.log(`   ⚠️  ${warn}`);
    }
    for (const i of result.info) {
      console.log(`   ℹ️  ${i}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\nSummary:`);
  console.log(`  Articles: ${files.length}`);
  console.log(`  Avg Score: ${(totalScore / files.length).toFixed(1)}/10`);
  console.log(`  Issues: ${issueCount}`);
  console.log(`  Warnings: ${warnCount}`);
  console.log(`  Pass (≥8.0): ${results.filter(r => r.score >= 8.0).length}/${files.length}`);

  if (issueCount > 0) {
    process.exit(1);
  }
}

main();