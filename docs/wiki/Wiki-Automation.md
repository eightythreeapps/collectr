# Wiki Automation & Version Control

Complete guide to automated, version-controlled development documentation.

## 🏆 **Automated Wiki System Overview**

Your wiki is now:
- ✅ **Version Controlled**: Full Git history of all documentation changes
- ✅ **Automated**: Scripts handle session creation, completion, and syncing
- ✅ **CI/CD Integrated**: GitHub Actions auto-sync changes
- ✅ **Searchable**: All content indexed and searchable on GitHub

## 🔧 **Setup Process**

### 1. Initial Setup (One-time)
```bash
# Enable GitHub Wiki first (in repo Settings → Features → Wikis)
# Then run:
./scripts/setup-wiki.sh
```

This will:
- Add GitHub wiki as a git submodule
- Copy all documentation to the wiki
- Commit and push initial content
- Set up version control integration

### 2. Verify Setup
After running setup, you should see:
- `wiki/` directory in your project (git submodule)
- GitHub wiki populated at `https://github.com/yourusername/collectr/wiki`
- All current documentation pages available

## 🚀 **Daily Workflow**

### Starting a New Development Session
```bash
./scripts/new-session.sh "Authentication UI Implementation"
```

**What it does:**
- Creates new session file: `docs/wiki/2025-08-03-authentication-ui-implementation.md`
- Pre-fills template with current date/time
- Updates Home.md with new session link
- Copies to wiki submodule automatically

### During Development
1. **Update your session file** as you work:
   - Add goals and starting state
   - Log work with timestamps
   - Document issues and solutions
   - Record learnings and decisions

2. **Sync periodically** (optional):
   ```bash
   ./scripts/sync-wiki.sh "Work in progress update"
   ```

### Completing a Session
```bash
./scripts/complete-session.sh "2025-08-03-authentication-ui-implementation"
```

**What it does:**
- Adds completion timestamp to session
- Marks session as "✅ Completed" in Home.md
- Syncs everything to GitHub wiki
- Updates git submodule reference

## 🤖 **Automation Features**

### GitHub Actions (Automatic)
**File**: `.github/workflows/wiki-sync.yml`

**Triggers:**
- Push to `main` branch with changes in `docs/wiki/` or `wiki/`
- Manual workflow dispatch

**Actions:**
- Syncs `docs/wiki/` content to GitHub wiki
- Updates submodule references
- Handles both `master` and `main` branch wikis

### Script Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `setup-wiki.sh` | Initial setup | `./scripts/setup-wiki.sh` |
| `new-session.sh` | Start new session | `./scripts/new-session.sh "Session Name"` |
| `sync-wiki.sh` | Manual sync | `./scripts/sync-wiki.sh ["message"]` |
| `complete-session.sh` | Finish session | `./scripts/complete-session.sh "session-name"` |

## 📁 **File Structure**

```
collectr/
├── docs/wiki/           # Source documentation
│   ├── Home.md
│   ├── Session-Template.md
│   ├── 2025-08-03-*.md
│   └── ...
├── wiki/                # Git submodule (GitHub wiki repo)
│   ├── Home.md          # Synced from docs/wiki/
│   ├── Session-Template.md
│   └── ...
├── scripts/
│   ├── setup-wiki.sh    # One-time setup
│   ├── new-session.sh   # Create new session
│   ├── sync-wiki.sh     # Manual sync
│   └── complete-session.sh
└── .github/workflows/
    └── wiki-sync.yml    # Auto-sync GitHub Action
```

## 🔄 **Version Control Benefits**

### Git History
Every wiki change is tracked:
```bash
cd wiki
git log --oneline
# Shows full history of documentation changes
```

### Branching & Merging
You can:
- Create feature branches for major documentation updates
- Review documentation changes via pull requests
- Rollback to previous versions if needed

### Collaboration
Multiple developers can:
- Work on documentation simultaneously
- Review each other's session notes
- Maintain consistent documentation standards

## 🛠️ **Advanced Usage**

### Manual Wiki Operations
```bash
# Enter wiki submodule
cd wiki

# Make direct changes
vim Home.md

# Commit and push
git add .
git commit -m "Update navigation"
git push origin master

# Return to main repo and update reference
cd ..
git add wiki
git commit -m "Update wiki submodule"
git push origin main
```

### Bulk Updates
```bash
# Update multiple files
cp docs/wiki/*.md wiki/
cd wiki
git add .
git commit -m "Bulk documentation update"
git push origin master
```

### Recovery
```bash
# If wiki gets out of sync
git submodule update --remote wiki
./scripts/sync-wiki.sh "Resync documentation"
```

## 📊 **Best Practices**

### Session Documentation
1. **Start Early**: Run `new-session.sh` at the beginning of each work session
2. **Update Frequently**: Add to work log every 30-60 minutes
3. **Be Specific**: Include exact commands, error messages, solutions
4. **Complete Properly**: Always run `complete-session.sh` when done

### Commit Messages
Use descriptive messages:
```bash
./scripts/sync-wiki.sh "Add API authentication documentation"
./scripts/sync-wiki.sh "Document deployment issues and solutions"
```

### Organization
- Keep session files focused on single development goals
- Use consistent naming: `YYYY-MM-DD-descriptive-name`
- Update Home.md navigation regularly
- Archive old sessions to yearly folders if needed

## 🔍 **Troubleshooting**

### Wiki Submodule Issues
```bash
# Reinitialize submodule
git submodule deinit wiki
git submodule init wiki
git submodule update --remote wiki
```

### Permission Issues
```bash
# Ensure you have wiki write permissions
# Check GitHub repo Settings → Manage access
```

### Sync Failures
```bash
# Check git status in wiki directory
cd wiki
git status
git pull origin master

# Force sync if needed
./scripts/sync-wiki.sh "Force sync after conflict resolution"
```

### GitHub Actions Failures
- Check Actions tab in GitHub repository
- Ensure `GITHUB_TOKEN` has wiki permissions
- Verify workflow file syntax

## 🎯 **Migration from Manual Wiki**

If you already have a manual GitHub wiki:

1. **Backup existing content**:
   ```bash
   git clone https://github.com/yourusername/collectr.wiki.git wiki-backup
   ```

2. **Run setup script**:
   ```bash
   ./scripts/setup-wiki.sh
   ```

3. **Merge existing content**:
   ```bash
   # Copy any existing pages from wiki-backup to docs/wiki/
   # Then sync
   ./scripts/sync-wiki.sh "Merge existing wiki content"
   ```

---

## 📈 **Future Enhancements**

Potential improvements:
- **Auto-screenshots**: Capture development screenshots
- **Metrics integration**: Auto-add Git stats, build times
- **Template variations**: Different templates for different work types
- **Search indexing**: Enhanced search across all sessions
- **Report generation**: Weekly/monthly development summaries

---

*This automation system ensures your development knowledge is never lost and always accessible!*

*Last Updated: 2025-08-03*