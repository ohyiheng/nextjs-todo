#!/bin/sh
set -e
node /app/scripts/seed.ts
exec $@