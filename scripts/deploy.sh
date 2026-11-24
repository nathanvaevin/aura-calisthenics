#!/bin/sh
# Builds Aura for its public address and publishes the result to the gh-pages
# branch, which GitHub Pages serves. Run: npm run deploy
#
# The build bakes in the two values from .env.local (project URL and
# publishable key). Both are meant to be public; the database is protected by
# its access rules. Nothing secret is read or published by this script.
set -e
cd "$(dirname "$0")/.."

# Aura's own address, served from a repository of its own. The old address
# (nathanvaevin.github.io/aura-calisthenics) is a separate thing: it holds the
# page that brings people here with their sign-in (npm run deploy:forward).
# Never write a CNAME there: GitHub would then forward by itself, before that
# page can run, and guests would lose their profile.
DOMAIN="aurathletics.nl"
BASE="/"
REMOTE="https://github.com/nathanvaevin/aurathletics.git"
if ! git ls-remote "$REMOTE" >/dev/null 2>&1; then
  echo "The repository that serves $DOMAIN does not exist yet: $REMOTE. Stopping." >&2
  exit 1
fi

if ! grep -q '^VITE_SUPABASE_URL=https://' .env.local 2>/dev/null || ! grep -q '^VITE_SUPABASE_ANON_KEY=.\+' .env.local 2>/dev/null; then
  echo "No Supabase project in .env.local: this would publish a demo-only build. Stopping." >&2
  exit 1
fi
if grep -v '^[[:space:]]*#' .env.local | grep -q 'sb_secret_\|service_role'; then
  echo ".env.local contains what looks like a secret key. It must hold the publishable key only. Stopping." >&2
  exit 1
fi

npm test
VITE_BASE="$BASE" npm run build

# Any path GitHub Pages does not know is answered with the app itself, so a
# reload on /train or /coach opens the app instead of an error page.
cp dist/index.html dist/404.html
touch dist/.nojekyll
echo "$DOMAIN" > dist/CNAME

cd dist
rm -rf .git
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -qm "Deploy Aura"
git push -f "$REMOTE" gh-pages
rm -rf .git
echo "Published to https://$DOMAIN/. GitHub Pages takes about a minute to serve the new build."
