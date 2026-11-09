#!/usr/bin/env bash
# Vercel "Ignored Build Step" (wired up in vercel.json → ignoreCommand).
# Exit 1 = build and deploy, exit 0 = skip this build.
#
# master and staging are protected on GitHub (changes land only by merging a PR with green CI),
# so building only these two branches means Vercel deploys only after a PR is merged.
# Feature branches and PRs are not deployed.

branch="${VERCEL_GIT_COMMIT_REF:-}"

case "$branch" in
  master | staging)
    echo "Deploying '$branch'."
    exit 1
    ;;
  *)
    echo "Skipping deploy for '$branch': only master and staging are deployed."
    exit 0
    ;;
esac
