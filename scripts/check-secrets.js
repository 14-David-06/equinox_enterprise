#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedFiles() {
  try {
    const out = execSync('git diff --name-only --cached --diff-filter=ACM', { encoding: 'utf8' });
    return out.split('\n').map(s => s.trim()).filter(Boolean);
  } catch (err) {
    console.error('Error getting staged files:', err.message);
    return [];
  }
}

const rules = [
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'Potential AWS Secret', regex: new RegExp('aws(.{0,20})?(secret|secret_key|access|access_key)(.{0,20})?=[\\s\\\"]?([A-Za-z0-9/+=]{40})','gi') },
  { name: 'JWT token', regex: /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.]+/g },
  { name: 'Generic token like api_key', regex: new RegExp('(token|secret|passwd|password|api_key|apikey|auth)\\s*[:=]\\s*[\'\\\"]?[A-Za-z0-9-_.]{8,}[\'\\\"]?','gi') },
];

function scanFile(file) {
  try {
    const content = fs.readFileSync(file, { encoding: 'utf8' });
    const matches = [];
    for (const r of rules) {
      const found = content.match(r.regex);
      if (found && found.length) matches.push({ rule: r.name, matches: found.slice(0,3) });
    }
    return matches;
  } catch (err) {
    // ignore binary or unreadable files
    return [];
  }
}

function main() {
  const files = getStagedFiles();
  if (!files.length) {
    console.log('No staged files to scan.');
    process.exit(0);
  }

  let foundAny = false;
  for (const f of files) {
    // ignore files in .git or node_modules
    if (f.startsWith('.git') || f.includes('node_modules')) continue;
    const abs = path.resolve(process.cwd(), f);
    if (!fs.existsSync(abs)) continue;
    const results = scanFile(abs);
    if (results.length) {
      foundAny = true;
      console.error(`\nPotential secret(s) found in: ${f}`);
      for (const r of results) {
        console.error(` - ${r.rule}: ${r.matches.join(' | ')}${r.matches.length>3? ' ...':''}`);
      }
    }
  }

  if (foundAny) {
    console.error('\n🔐 Commit aborted - remove secrets or unstage the offending files before committing.');
    process.exit(1);
  }

  console.log('No obvious secrets found in staged files.');
  process.exit(0);
}

main();
