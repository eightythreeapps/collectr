#!/bin/bash

# Mark a development session as completed and sync to wiki
# Usage: ./scripts/complete-session.sh "2025-08-03-session-name"

if [ -z "$1" ]; then
    echo "Usage: ./scripts/complete-session.sh \"session-filename\""
    echo "Example: ./scripts/complete-session.sh \"2025-08-03-authentication-ui\""
    echo ""
    echo "Available sessions:"
    ls docs/wiki/2*.md 2>/dev/null | sed 's/docs\/wiki\///g' | sed 's/\.md//g' || echo "No sessions found"
    exit 1
fi

SESSION_FILE="$1"
if [[ ! "$SESSION_FILE" == *.md ]]; then
    SESSION_FILE="${SESSION_FILE}.md"
fi

FULL_PATH="docs/wiki/${SESSION_FILE}"

if [ ! -f "$FULL_PATH" ]; then
    echo "❌ Session file not found: $FULL_PATH"
    exit 1
fi

echo "🏁 Completing development session: $SESSION_FILE"

# Add completion timestamp
COMPLETION_TIME=$(date -u +'%Y-%m-%d %H:%M')
echo "" >> "$FULL_PATH"
echo "*Session completed: $COMPLETION_TIME UTC*" >> "$FULL_PATH"

# Update Home.md to mark as completed
echo "📋 Updating Home.md status..."
sed -i "" "s/- \[.*${SESSION_FILE%.*}.*\] - In progress/- [${SESSION_FILE%.*}](./${SESSION_FILE%.*}) - ✅ Completed/g" docs/wiki/Home.md

# Get session title for commit message
SESSION_TITLE=$(grep -m1 "^# " "$FULL_PATH" | sed 's/^# //')

echo "✅ Session marked as completed"
echo "🔄 Syncing to wiki..."

# Sync to wiki
./scripts/sync-wiki.sh "Complete development session: $SESSION_TITLE"

echo ""
echo "🎉 Development session completed and synced!"
echo "📖 View at: https://github.com/yourusername/collectr/wiki"