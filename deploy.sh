#!/bin/bash
# Build and deploy script for documentation

echo "Building documentation..."
bun run docs:build

echo "Committing changes..."
git add .
git commit -m "Update documentation build"

echo "Deploying to CapRover..."
caprover deploy -d

echo "Deployment process complete!"
