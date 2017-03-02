#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="travis-ci"
TARGET_BRANCH="gh-pages"

function doCompile {
  chmod +x ./compile.sh
  ./compile.sh
}

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    doCompile
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into out/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO build
cd build
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

rm -rf out/**/* || exit 0

doCompile

echo "Files in root"
ls .
echo "Files in /build"
ls ./build
# Now let's go have some fun with the cloned repo
cd build
echo "Files in /build"
ls ./
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"


# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add .
git commit -m "Deploy to GitHub Pages: ${SHA}"

if [ $(git status --porcelain | wc -l) -lt 1 ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

chmod 600 ../deploy_key
cp ../deploy_key ~/.ssh/id_rsa

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH