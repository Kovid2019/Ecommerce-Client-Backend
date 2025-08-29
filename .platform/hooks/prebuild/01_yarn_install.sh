#!/bin/bash
set -e
echo "Running yarn install instead of npm..."
yarn install --frozen-lockfile --production

