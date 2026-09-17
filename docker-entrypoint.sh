#!/bin/sh
set -eu

bun run build
exec bun x playwright test "$@"