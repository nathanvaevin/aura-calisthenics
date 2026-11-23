#!/bin/sh
# Builds Aura for its public address and publishes the result to the gh-pages
# branch, which GitHub Pages serves. Run: npm run deploy
#
# The build bakes in the two values from .env.local (project URL and
# publishable key). Both are meant to be public; the database is protected by
# its access rules. Nothing secret is read or published by this script.
set -e
cd "$(dirname "$0")/.."

# Aura's own address. It is used as soon as it points at GitHub Pages; until then
# the build keeps going to the old one, so a publish can never send athletes to
# an address that does not answer yet. (Its DNS: four A records to GitHub's
# 185.199.108–111.153, and www as a CNAME to nathanvaevin.github.io.)
DOMAIN="${AURA_DOMAIN:-aurathletics.nl}"
GITHUB_IPS="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
ready=0
if [ -n "$DOMAIN" ]; then
  for ip in $(dig +short A "$DOMAIN" 2>/dev/null); do
    case " $GITHUB_IPS " in *" $ip "*) ready=1 ;; esac
  done
fi
if [ "$ready" = 1 ]; then
  BASE="/"
  echo "Publishing to https://$DOMAIN/"
else
  BASE="${AURA_BASE:-/aura-calisthenics/}"
  DOMAIN=""
  echo "Publishing to https://nathanvaevin.github.io/aura-calisthenics/ (aurathletics.nl does not point at GitHub Pages yet)"
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
# With its own domain, this one file tells GitHub Pages to serve the site there; the old address then forwards to it.
if [ -n "$DOMAIN" ]; then echo "$DOMAIN" > dist/CNAME; fi

REMOTE="$(git remote get-url origin)"
cd dist
rm -rf .git
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -qm "Deploy Aura"
git push -f "$REMOTE" gh-pages
rm -rf .git
echo "Published. GitHub Pages takes about a minute to serve the new build."
