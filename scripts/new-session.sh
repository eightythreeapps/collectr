#!/bin/bash

# Create a new development session from template
# Usage: ./scripts/new-session.sh "Session Name"

if [ -z "$1" ]; then
    echo "Usage: ./scripts/new-session.sh \"Session Name\""
    echo "Example: ./scripts/new-session.sh \"Authentication UI Implementation\""
    exit 1
fi

SESSION_NAME="$1"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
FILENAME="${DATE}-$(echo "$SESSION_NAME" | sed 's/ /-/g' | tr '[:upper:]' '[:lower:]')"

echo "🚀 Creating new development session: $SESSION_NAME"
echo "📅 Date: $DATE"
echo "📝 Filename: $FILENAME.md"

# Create session file from template
cp docs/wiki/Session-Template.md "docs/wiki/${FILENAME}.md"

# Replace template placeholders
sed -i "" "s/\[YYYY-MM-DD\]: \[Session Name\/Goal\]/${DATE}: ${SESSION_NAME}/g" "docs/wiki/${FILENAME}.md"
sed -i "" "s/Date\*\*: YYYY-MM-DD/Date**: ${DATE}/g" "docs/wiki/${FILENAME}.md"
sed -i "" "s/Duration\*\*: X hours/Duration**: Started at ${TIME}/g" "docs/wiki/${FILENAME}.md"
sed -i "" "s/Session Type\*\*: \[.*\]/Session Type**: Development/g" "docs/wiki/${FILENAME}.md"

# Add to Home.md navigation
echo "📋 Updating Home.md with new session link..."

# Create backup of Home.md
cp docs/wiki/Home.md docs/wiki/Home.md.bak

# Add new session to the development sessions section
sed -i "" "/- \[Session Template\]/a\\
- [${DATE}: ${SESSION_NAME}](./${FILENAME}) - In progress" docs/wiki/Home.md

echo "✅ New session created: docs/wiki/${FILENAME}.md"
echo "✅ Home.md updated with session link"
echo ""
echo "📖 Next steps:"
echo "1. Open docs/wiki/${FILENAME}.md"
echo "2. Fill in your goals and starting state"
echo "3. Update the work log as you develop"
echo "4. Run ./scripts/sync-wiki.sh when done"

# If wiki submodule exists, copy there too
if [ -d "wiki" ]; then
    cp "docs/wiki/${FILENAME}.md" "wiki/"
    cp "docs/wiki/Home.md" "wiki/"
    echo "✅ Session copied to wiki submodule"
fi