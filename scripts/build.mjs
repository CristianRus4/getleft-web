#!/usr/bin/env node
// One command for the whole site build and its checks:
//   node scripts/build.mjs
// 1. tools pages  2. English page normalisation (links, canonicals, nav, analytics, CTAs)
// 3. locale copies + sitemap  4. translation report + gate  5. site checks
// Cloudflare Pages serves the committed output, so commit what this writes.

import { execFileSync } from 'node:child_process';
import { ROOT } from './lib/site.mjs';

const steps = [
  ['tools', ['scripts/build-tools-seo.mjs']],
  ['inject', ['scripts/site-inject.mjs']],
  ['i18n', ['scripts/build-i18n.mjs', '--allow-missing']],
  ['translations', ['scripts/check-i18n.mjs', '--gate']],
  ['checks', ['scripts/check-site.mjs']],
];

for (const [name, args] of steps) {
  process.stdout.write(`\n▸ ${name}\n`);
  try {
    execFileSync('node', args, { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.error(`\n✗ build step "${name}" failed`);
    process.exit(1);
  }
}
console.log('\n✓ build passed');
