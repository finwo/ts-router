#!/usr/bin/env bash

cd $(dirname $0)

# Fetch the current version
VERSION=$(jq -r .version < ../package.json)

# Echo only mode
if [ -z "$1" ]; then
  echo ${VERSION}
  exit 0
fi

# Deconstruct the version number
MAJOR=$(echo ${VERSION} | cut -d. -f1)
MINOR=$(echo ${VERSION} | cut -d. -f2)
PATCH=$(echo ${VERSION} | cut -d. -f3)

# Bump the version accordingly
case "$1" in
  major)
    VERSION="$((MAJOR+1)).0.0"
    ;;
  minor)
    VERSION="$((MAJOR)).$((MINOR+1)).0"
    ;;
  patch)
    VERSION="$((MAJOR)).$((MINOR)).$((PATCH+1))"
    ;;
  *)
    echo "Unknown type: $1" >&1
    exit 1
    ;;
esac

# And save again
jq ".version = \"${VERSION}\"" < ../package.json | sponge ../package.json
npm run version:sync

# Bump core version in adapters
jq ".dependencies[\"@finwo/router\"] = \"${VERSION}\"" ../packages/router-fastify/package.json | sponge ../packages/router-fastify/package.json

echo ${VERSION}
