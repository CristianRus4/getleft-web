#!/usr/bin/env node
// One-off: rewrite English support-article SEO meta (title + description + og)
// for better search-intent alignment. Targets the stable data-i18n keys so it
// works regardless of current text, and keeps en.json (the i18n source of truth)
// in sync. Translated locales keep their existing strings (English is fallback).
//
// Run:  node scripts/patch-support-seo.mjs   then build-tools-seo + build-i18n.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

// key = support_articles.<key>; values are the new English strings.
const META = {
  account_and_sync: {
    title: 'How to Back Up & Sync Your Left Data | Left',
    description: 'Sign in with Apple to back up your dates, habits, streaks, and friends in Left, and sync them across your iPhone, iPad, and Mac.',
    og_title: 'How to back up and sync your Left data',
    og_description: 'Sign in with Apple to sync your Left data across iPhone, iPad, and Mac.',
  },
  accountability_with_friends: {
    title: 'How to Stay Accountable With Friends | Left',
    description: 'Invite a friend to watch a specific habit or streak in Left for lightweight, friendly accountability that keeps you consistent.',
    og_title: 'How to be accountable to friends in Left',
    og_description: 'Invite a friend to watch a habit or streak in Left for gentle accountability.',
  },
  add_friends: {
    title: 'How to Add Friends on Left | Left',
    description: 'Sign in, share your invite link or search by username, and accept friend requests to connect with friends on Left.',
    og_title: 'How to add friends on Left',
    og_description: 'Share your invite link or search by username to add friends on Left.',
  },
  choose_your_tools: {
    title: 'How to Choose Your Tools in Left | Left',
    description: 'Pick which Left tools appear in the bottom menu, set their order, choose a default, and hide names to customize Left your way.',
    og_title: 'How to choose your tools in Left',
    og_description: 'Pick which tools show in the menu, set their order, and choose a default.',
  },
  edit_or_remove_widget_iphone: {
    title: 'How to Edit, Resize, or Remove an iPhone Widget | Left',
    description: 'Step-by-step guide to editing, resizing, or removing any widget on your iPhone Home Screen or Lock Screen, including Left widgets.',
    og_title: 'How to edit, resize, or remove an iPhone widget',
    og_description: 'Edit, resize, or remove any widget on your iPhone Home or Lock Screen.',
  },
  focus_modes_with_left: {
    title: 'How to Show Different Widgets per Focus Mode | Left',
    description: 'Show a work deadline during Work Focus and a personal event during Personal Focus. Step-by-step guide to using Left widgets with iPhone Focus modes.',
    og_title: 'How to show different Left widgets per Focus mode',
    og_description: 'Show different Left widgets for Work Focus, Personal Focus, and more.',
  },
  iphone_action_button_left: {
    title: 'How to Open Left With the iPhone Action Button | Left',
    description: 'Set up the iPhone Action Button to open a Left event instantly via Shortcuts. One press to see your countdown, no unlocking required.',
    og_title: 'How to open Left with the iPhone Action Button',
    og_description: 'Use the iPhone Action Button to open a Left countdown in one press.',
  },
  joint_ahead_dates: {
    title: 'How to Share a Countdown With Friends in Left | Left',
    description: 'Create an Ahead date in Left and invite friends so everyone counts down to the same plan, trip, or event together.',
    og_title: 'How joint Ahead dates work in Left',
    og_description: 'Create an Ahead date and invite friends to count down to the same plan.',
  },
  left_shortcuts: {
    title: 'How to Use the Shortcuts App With Left | Left',
    description: 'Automate Left with the iOS Shortcuts app. Create events, open Left, and build automations around your countdowns and habits.',
    og_title: 'Using the Shortcuts app with Left',
    og_description: 'Automate Left with the iOS Shortcuts app: create events, open Left, and more.',
  },
  organise_ahead_since: {
    title: 'How to Reorder Your Ahead & Since Items | Left',
    description: 'Reorder your Ahead dates, streaks, and habits in Left with manual sort so your most important countdowns stay on top.',
    og_title: 'How to organise items in Ahead or Since',
    og_description: 'Reorder Ahead dates, streaks, and habits in Left with manual sort.',
  },
  restore_purchases: {
    title: 'How to Restore Purchases in Left | Left',
    description: 'Reconnect a previous Left purchase through the App Store, from the purchase screen or Settings, on a new device or after reinstalling.',
    og_title: 'How to restore purchases in Left',
    og_description: 'Reconnect a previous Left purchase via the App Store or Settings.',
  },
  set_up_your_lifespan: {
    title: 'How to Set Up Your Lifespan in Left | Left',
    description: 'Set your birthday, calculate or set a lifespan, and choose to see your life in years, months, or weeks with Left.',
    og_title: 'How to set up your Lifespan in Left',
    og_description: 'Set your birthday and lifespan, and see your life in years, months, or weeks.',
  },
  streaks_vs_habits: {
    title: "Streaks vs Habits in Left: What's the Difference | Left",
    description: 'How streaks and habits differ in Left, and when to choose each one to build consistency in the way that fits you.',
    og_title: 'Streaks vs habits in Left',
    og_description: 'How streaks and habits differ in Left, and when to use each one.',
  },
  wallpaper_shortcut: {
    title: 'How to Set Up the Left Wallpaper Shortcut | Left',
    description: 'Step-by-step guide to setting up the Left Wallpaper shortcut and daily automation, so your Lock Screen updates itself with live time data.',
    og_title: 'How to set up the Left Wallpaper shortcut',
    og_description: 'Set up the Left Wallpaper shortcut so your Lock Screen updates itself daily.',
  },
  widget_ipad_home_screen: {
    title: 'How to Add a Widget to Your iPad Home Screen | Left',
    description: 'Step-by-step guide to adding a widget to your iPad Home Screen. Display Left countdowns and progress widgets on your iPad in minutes.',
    og_title: 'How to add a Left widget on your iPad Home Screen',
    og_description: 'Add a Left widget to your iPad Home Screen to see countdowns and progress.',
  },
  widget_ipad_lock_screen: {
    title: 'How to Add a Widget to Your iPad Lock Screen | Left',
    description: 'Step-by-step guide to adding a widget to your iPad Lock Screen. See Left countdowns and progress at a glance without unlocking your iPad.',
    og_title: 'How to add a Left widget on your iPad Lock Screen',
    og_description: 'Add a Left widget to your iPad Lock Screen to see countdowns at a glance.',
  },
  widget_iphone_home_screen: {
    title: 'How to Add a Widget to Your iPhone Home Screen | Left',
    description: 'Step-by-step guide to adding a widget to your iPhone Home Screen. See Left countdowns, habits, and time remaining at a glance.',
    og_title: 'How to add a Left widget on your iPhone Home Screen',
    og_description: 'Add a Left widget to your iPhone Home Screen to see countdowns and habits.',
  },
  widget_iphone_lock_screen: {
    title: 'How to Add a Widget to Your iPhone Lock Screen | Left',
    description: 'Step-by-step guide to adding a widget to your iPhone Lock Screen. See your Left countdown or progress without unlocking your phone.',
    og_title: 'How to add a Left widget on your iPhone Lock Screen',
    og_description: 'Add a Left widget to your iPhone Lock Screen to see countdowns without unlocking.',
  },
  widget_iphone_standby: {
    title: 'How to Use Widgets in iPhone StandBy Mode | Left',
    description: 'Step-by-step guide to showing Left countdowns in iPhone StandBy mode. Turn your charging iPhone into a bedside countdown display.',
    og_title: 'How to use Left widgets in iPhone StandBy mode',
    og_description: 'Show Left countdowns in iPhone StandBy mode for a bedside display.',
  },
  widget_mac_desktop: {
    title: 'How to Add a Widget to Your Mac Desktop | Left',
    description: 'Step-by-step guide to adding a Left widget directly on your Mac desktop. Available in macOS Sonoma and later, no Notification Center needed.',
    og_title: 'How to add a Left widget on your Mac desktop',
    og_description: 'Add a Left widget directly to your Mac desktop in macOS Sonoma and later.',
  },
  widget_mac_notification_center: {
    title: 'How to Add a Widget to Mac Notification Center | Left',
    description: 'Step-by-step guide to adding a Left widget to your Mac Notification Center. See countdowns and time remaining in macOS with a single swipe.',
    og_title: 'How to add a Left widget in Mac Notification Center',
    og_description: 'Add a Left widget to Mac Notification Center to see countdowns with a swipe.',
  },
  widget_transparent_iphone: {
    title: 'How to Make iPhone Widgets Transparent | Left',
    description: 'Use the iOS Clear icon and widget style to make Left widgets blend into your wallpaper for a clean, transparent Home Screen.',
    og_title: 'How to make Left widgets transparent',
    og_description: 'Use the iOS Clear style to make Left widgets blend with your wallpaper.',
  },
};

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function escText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Replace the content="" of whichever <meta> tag carries the given data-i18n key.
function setMetaContentByKey(html, i18nKey, value) {
  const keyEsc = i18nKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(<meta\\b[^>]*\\b(?:data-i18n-attr)="[^"]*${keyEsc}[^"]*"[^>]*>)`, 'i');
  return html.replace(re, (tag) =>
    tag.replace(/\scontent="[^"]*"/i, ` content="${escAttr(value)}"`)
  );
}

async function patchHtml() {
  const dir = path.join(ROOT, 'support');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.html'));
  let changed = 0;
  for (const file of files) {
    const key = path.basename(file, '.html').replace(/-/g, '_');
    const m = META[key];
    if (!m) { console.warn(`[support-seo] no META for ${key}, skipping`); continue; }
    const full = path.join(dir, file);
    let html = await fs.readFile(full, 'utf8');

    // <title data-i18n="support_articles.KEY.meta.title">...</title>
    html = html.replace(
      new RegExp(`(<title\\b[^>]*data-i18n="support_articles\\.${key}\\.meta\\.title"[^>]*>)([\\s\\S]*?)(</title>)`, 'i'),
      (_, a, _old, c) => `${a}${escText(m.title)}${c}`
    );
    // description / og:title / og:description by their data-i18n keys
    html = setMetaContentByKey(html, `support_articles.${key}.meta.description`, m.description);
    html = setMetaContentByKey(html, `support_articles.${key}.og_title`, m.og_title);
    html = setMetaContentByKey(html, `support_articles.${key}.og_description`, m.og_description);

    await fs.writeFile(full, html);
    changed++;
  }
  console.log(`[support-seo] patched ${changed} support HTML files`);
}

async function patchEnJson() {
  const file = path.join(ROOT, 'i18n', 'locales', 'en.json');
  const data = JSON.parse(await fs.readFile(file, 'utf8'));
  const sa = data.support_articles || {};
  let changed = 0;
  for (const [key, m] of Object.entries(META)) {
    if (!sa[key]) { console.warn(`[support-seo] en.json missing ${key}`); continue; }
    sa[key].meta = sa[key].meta || {};
    sa[key].meta.title = m.title;
    sa[key].meta.description = m.description;
    sa[key].og_title = m.og_title;
    sa[key].og_description = m.og_description;
    changed++;
  }
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`[support-seo] patched ${changed} entries in en.json`);
}

await patchHtml();
await patchEnJson();
