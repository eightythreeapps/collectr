#!/bin/bash

# Sync local documentation to GitHub wiki
# Usage: ./scripts/sync-wiki.sh ["commit message"]

COMMIT_MSG="${1:-Update wiki documentation}"
DATE=$(date -u +'%Y-%m-%d %H:%M:%S UTC')

echo "🔄 Syncing documentation to GitHub wiki..."

# Check if wiki submodule exists
if [ ! -d "wiki" ]; then
    echo "❌ Wiki submodule not found. Run ./scripts/setup-wiki.sh first."
    exit 1
fi

# Copy all documentation to wiki
echo "📋 Copying documentation files..."
cp docs/wiki/*.md wiki/

# Change to wiki directory
cd wiki

# Check for changes
if git diff --quiet; then
    echo "ℹ️ No changes to sync"
    exit 0
fi

echo "📝 Changes detected, committing..."

# Stage all changes
git add .

# Commit with provided message or default
git commit -m "$COMMIT_MSG

Updated: $DATE

🤖 Synced via automation script"

# Push to GitHub wiki
echo "🚀 Pushing to GitHub wiki..."
git push origin master 2>/dev/null || git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Wiki successfully synced!"
    echo "📖 View at: https://github.com/$(git remote get-url origin | sed 's/.*github.com\///g' | sed 's/\.wiki\.git//g')/wiki"
else
    echo "❌ Failed to push to wiki. Check your permissions."
    exit 1
fi

# Return to main directory
cd ..

# Update submodule reference in main repo
echo "🔗 Updating submodule reference..."
git add wiki

if ! git diff --cached --quiet; then
    git commit -m "Update wiki submodule reference

    $COMMIT_MSG
    
    🤖 Generated with automation script"
    
    echo "✅ Main repository updated with new wiki reference"
    echo "💡 Don't forget to push main repo: git push origin main"
else
    echo "ℹ️ No submodule reference update needed"
fi