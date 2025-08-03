#!/bin/bash

echo "🔧 Fixing GitHub Wiki setup..."

# Step 1: Check if wiki exists
REPO_URL="https://github.com/eightythreeapps/collectr"
WIKI_URL="https://github.com/eightythreeapps/collectr.wiki.git"

echo "📋 GitHub Wiki Setup Instructions:"
echo ""
echo "The GitHub Wiki repository doesn't exist yet. Here's how to fix it:"
echo ""
echo "1. 🌐 Go to: ${REPO_URL}"
echo "2. ✅ Click the 'Wiki' tab (if not visible, enable in Settings → Features → Wikis)"
echo "3. 📝 Click 'Create the first page'"
echo "4. 📄 Set title to: 'Home'"
echo "5. 📋 Copy content from: docs/wiki/Home.md"
echo "6. 💾 Click 'Save Page'"
echo ""
echo "After creating the first page, run this script again!"

# Check if user has created the wiki
echo ""
read -p "🤔 Have you created the first wiki page? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📂 Attempting to add wiki as git submodule..."
    
    # Remove any existing failed submodule
    if [ -d "wiki" ]; then
        echo "🧹 Cleaning up failed submodule attempt..."
        rm -rf wiki
        git submodule deinit -f wiki 2>/dev/null || true
        git rm -f wiki 2>/dev/null || true
    fi
    
    # Add wiki as submodule
    if git submodule add ${WIKI_URL} wiki; then
        echo "✅ Wiki submodule added successfully!"
        
        # Copy our documentation to the wiki
        echo "📋 Copying documentation to wiki..."
        cp docs/wiki/*.md wiki/
        
        # Setup wiki repository
        cd wiki
        
        # Add and commit all files
        git add .
        git commit -m "Initial wiki setup with comprehensive development documentation

- Add Home page with navigation and project overview
- Add Session-Template for development session tracking
- Add complete 2025-08-03 initial setup session documentation
- Add Tech-Stack overview and Local-Development guide
- Add Wiki-Automation guide for documentation system

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
        
        # Push to GitHub wiki
        if git push origin master 2>/dev/null || git push origin main; then
            echo "✅ Wiki content pushed successfully!"
            cd ..
            
            # Update submodule reference in main repo
            git add wiki
            git commit -m "Add wiki submodule with initial documentation

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
            
            echo ""
            echo "🎉 Wiki setup complete!"
            echo "📖 Your wiki is now at: ${REPO_URL}/wiki"
            echo "🔄 Wiki content is version controlled in ./wiki/ subdirectory"
            echo ""
            echo "🚀 Next steps:"
            echo "- Visit ${REPO_URL}/wiki to see your documentation"
            echo "- Use ./scripts/new-session.sh to start tracking development sessions"
            echo "- Use ./scripts/sync-wiki.sh to sync changes anytime"
        else
            echo "❌ Failed to push to wiki. Check your permissions."
        fi
    else
        echo "❌ Failed to add wiki submodule. Please check:"
        echo "   - Repository permissions"
        echo "   - Wiki is enabled in repository settings"
        echo "   - First wiki page has been created"
    fi
else
    echo ""
    echo "💡 Please create the first wiki page manually, then run this script again."
    echo ""
    echo "📋 Quick steps:"
    echo "1. Go to: ${REPO_URL}/wiki"
    echo "2. Click 'Create the first page'"
    echo "3. Title: 'Home'"
    echo "4. Content: Copy from docs/wiki/Home.md"
    echo "5. Save, then run: ./scripts/fix-wiki-setup.sh"
fi