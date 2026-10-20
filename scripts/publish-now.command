#!/bin/bash
# Publish getleft.app now: double-click in Finder, or run from Terminal.
# Releases every page and translation in i18n/publish-schedule.json dated today or earlier
# (New Zealand date), commits, pushes to main (Cloudflare Pages deploys it) and tells IndexNow.
# Does the same as the "Daily publish" GitHub Action, so it's safe to run any time, as often as you like:
# when nothing new is due it publishes nothing.
#   DRY_RUN=1 ./publish-now.command   builds and shows what would change, without committing or pushing.

REPO="$HOME/Developer/Webs/getleft-web"
WORK="$HOME/.getleft-publish"   # private copy, so your own checkouts are never touched

finish() {
  echo
  [ -t 0 ] && read -r -p "Press Return to close." _
  exit "$1"
}

cd "$REPO" || { echo "Can't find $REPO"; finish 1; }
if [ ! -d "$WORK/.git" ] && [ ! -f "$WORK/.git" ]; then
  git fetch -q origin main && git worktree add -q --detach "$WORK" origin/main || { echo "Couldn't create $WORK"; finish 1; }
fi
cd "$WORK" || finish 1

# The translation engine gate already ran when each translation was pushed, as in the GitHub Action.
export LEFT_SKIP_I18N_GATE=1

echo "Publishing getleft.app for $(TZ=Pacific/Auckland date '+%A %-d %B %Y') (NZ)..."
for attempt in 1 2 3; do
  git fetch -q origin main || { echo "Couldn't reach GitHub. Check your internet connection."; finish 1; }
  git reset -q --hard origin/main
  git clean -fdq
  base=$(git rev-parse HEAD)
  if ! node scripts/build.mjs > /tmp/getleft-publish-build.log 2>&1; then
    echo "The build failed, so nothing was published. Last lines of the log:"
    tail -15 /tmp/getleft-publish-build.log
    finish 1
  fi
  node scripts/check-publish.mjs 2>/dev/null | tail -1
  git add -A
  if git diff --cached --quiet; then
    echo "Nothing new is due. getleft.app is already up to date."
    finish 0
  fi
  msg=$(node scripts/lib/publish.mjs --commit-message)
  if [ -n "$DRY_RUN" ]; then
    echo "DRY RUN, would publish: $msg"
    git diff --cached --stat | tail -5
    git reset -q --hard origin/main
    finish 0
  fi
  git commit -q -m "$msg"
  if git push -q origin HEAD:main; then
    echo "Published: $msg"
    node scripts/indexnow.mjs --since "$base" 2>&1 | tail -1
    echo "Cloudflare deploys it in about a minute."
    finish 0
  fi
  echo "main changed while publishing (attempt $attempt); trying again from the new version..."
done
echo "Couldn't push after 3 attempts. Try again in a minute."
finish 1
