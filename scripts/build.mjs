#!/usr/bin/env node
// One command for the whole site build and its checks:
//   node scripts/build.mjs
// 0. promote scheduled pages that are due  1. tools pages
// 2. English page normalisation (links, canonicals, nav, analytics, CTAs)
// 3. locale copies + sitemap + publish calendar  4. translation report + gate
// 5. publish schedule checks  6. site checks
// Cloudflare Pages serves the committed output, so commit what this writes.
//
// BUILD_DATE=YYYY-MM-DD builds as of that New Zealand date (default: today in NZ).
// LEFT_SKIP_I18N_GATE=1 skips only the translation-engine gate (CI has no engine);
// the translation report and every other check still run.

import { execFileSync } from 'node:child_process';
import { ROOT } from './lib/site.mjs';
import { buildDate, promoteDuePages } from './lib/publish.mjs';

const date = buildDate();
const skipGate = process.env.LEFT_SKIP_I18N_GATE === '1';

process.stdout.write(`\n▸ publish\n`);
try {
  const moved = promoteDuePages(date);
  console.log(`[publish] build date ${date} (NZ): ${moved.length ? `published ${moved.join(', ')}` : 'no scheduled pages due'}.`);
} catch (err) {
  console.error(`[publish] ${err.message}\n\n✗ build step "publish" failed`);
  process.exit(1);
}

const steps = [
  ['tools', ['scripts/build-tools-seo.mjs']],
  ['inject', ['scripts/site-inject.mjs']],
  ['i18n', ['scripts/build-i18n.mjs', '--allow-missing']],
  ['translations', ['scripts/check-i18n.mjs', ...(skipGate ? [] : ['--gate'])]],
  ['schedule', ['scripts/check-publish.mjs']],
  ['checks', ['scripts/check-site.mjs']],
];
if (skipGate) console.log('[build] LEFT_SKIP_I18N_GATE=1: translation-engine gate skipped.');

for (const [name, args] of steps) {
  process.stdout.write(`\n▸ ${name}\n`);
  try {
    execFileSync('node', args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, BUILD_DATE: date } });
  } catch {
    console.error(`\n✗ build step "${name}" failed`);
    process.exit(1);
  }
}
console.log('\n✓ build passed');
