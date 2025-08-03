#!/bin/bash

echo "🔧 Setting up automated wiki with version control..."

# 1. Clone the wiki as a submodule
echo "📂 Adding wiki as git submodule..."
git submodule add https://github.com/eightythreeapps/collectr.wiki.git wiki

# 2. Copy our documentation to the wiki
echo "📋 Copying documentation to wiki..."
cp docs/wiki/*.md wiki/

# 3. Set up the wiki repository
cd wiki

# 4. Commit initial content
git add .
git commit -m "Initial wiki setup with development documentation

- Add comprehensive Home page with navigation
- Add Session-Template for development tracking
- Add complete 2025-08-03 initial setup session
- Add Tech-Stack and Local-Development guides

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Push to GitHub wiki
git push origin master

cd ..

echo "✅ Wiki setup complete!"
echo "📖 Your wiki is now at: https://github.com/eightythreeapps/collectr/wiki"
echo "🔄 Wiki content is version controlled in ./wiki/ subdirectory"