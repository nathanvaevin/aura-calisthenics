#!/bin/sh
# Puts forward/index.html at the old address, so that it sends everyone to
# aurathletics.nl with their sign-in. Run: npm run deploy:forward
#
# Only when the new address answers over HTTPS with an app that can take people
# in. The old build's other files stay: a tab that is still open keeps working.
set -e
cd "$(dirname "$0")/.."

SITE="https://aurathletics.nl"
PAGE="$(curl -sf --max-time 20 "$SITE/")" || { echo "$SITE does not answer over HTTPS yet. Stopping." >&2; exit 1; }
SCRIPT="$(printf '%s' "$PAGE" | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1)"
if [ -z "$SCRIPT" ] || ! curl -sf --max-time 30 "$SITE/$SCRIPT" | grep -q 'aura:moved'; then
  echo "The app at $SITE cannot take people in yet. Stopping." >&2
  exit 1
fi

REMOTE="$(git remote get-url origin)"
DIR="$(mktemp -d)"
git clone -q --depth 1 --branch gh-pages "$REMOTE" "$DIR"
if [ -e "$DIR/CNAME" ]; then echo "The old address has a CNAME file; it must not. Stopping." >&2; exit 1; fi
cp forward/index.html "$DIR/index.html"
cp forward/index.html "$DIR/404.html"
NAME="$(git config user.name)"; EMAIL="$(git config user.email)"
cd "$DIR"
git add -A
git -c user.name="$NAME" -c user.email="$EMAIL" commit -qm "Aura has moved to aurathletics.nl"
git push -q origin gh-pages
rm -rf "$DIR"
echo "The old address now sends people to $SITE. GitHub Pages takes about a minute, and browsers up to ten."
