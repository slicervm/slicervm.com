#!/bin/bash

# Local gh-pages deployment script using gh-pages npm package
# This is much safer than manual git operations

set -e  # Exit on any error

echo "🚀 Starting local deployment to gh-pages..."

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Consider committing them first."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Build the site
echo "🔨 Building the site..."
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Build failed - 'out' directory not found"
    exit 1
fi

# Deploy using gh-pages package (much safer!)
echo "📦 Deploying to gh-pages branch..."
npx gh-pages -d out --dotfiles

echo "✅ Local deployment complete!"
echo "🌐 Your site should be available at: https://slicervm.github.io/slicervm.com"
echo "⏱️  GitHub Pages may take a few minutes to update"
