# GitHub Wiki Setup Instructions

This folder contains pre-written content for your GitHub Wiki. Here's how to set it up:

## Quick Setup Steps

### 1. Enable GitHub Wiki
1. Go to your repository: `https://github.com/yourusername/collectr`
2. Click **Settings** tab
3. Scroll to **Features** section  
4. Check the **Wikis** checkbox
5. Click the **Wiki** tab (should now appear)

### 2. Create Wiki Pages
Click **Create the first page** and copy/paste content from these files:

| File | GitHub Wiki Page Name | Purpose |
|------|----------------------|---------|
| `Home.md` | **Home** | Main navigation and overview |
| `Session-Template.md` | **Session-Template** | Template for future dev sessions |
| `2025-08-03-Initial-Setup.md` | **2025-08-03-Initial-Setup** | Today's session record |
| `Tech-Stack.md` | **Tech-Stack** | Complete technology overview |
| `Local-Development.md` | **Local-Development** | Development environment guide |

### 3. Recommended Page Creation Order
1. **Home** (from `Home.md`) - Start here
2. **Session-Template** (from `Session-Template.md`) - Template first
3. **2025-08-03-Initial-Setup** (from `2025-08-03-Initial-Setup.md`) - Today's work
4. **Tech-Stack** (from `Tech-Stack.md`) - Architecture documentation
5. **Local-Development** (from `Local-Development.md`) - Setup guide

### 4. Additional Pages to Create Later
These don't have content yet but should be created as empty pages:

- **Database-Schema** - Firestore collections and fields
- **API-Endpoints** - Complete API documentation  
- **Security-Rules** - Firebase rules explanation
- **Firebase-Hosting** - Deployment process
- **Production-Setup** - Production environment config
- **ADR-001-Firebase-Choice** - Architecture decision record
- **ADR-002-Monorepo-Structure** - Code organization decision
- **Common-Issues** - Troubleshooting guide
- **Environment-Setup** - Environment troubleshooting

## Tips for Wiki Management

### Naming Convention
- Use **kebab-case** for page names: `2025-08-03-Initial-Setup`
- Date format: `YYYY-MM-DD` for session records
- Prefix ADRs: `ADR-001-Topic-Name`

### Linking Between Pages
```markdown
[Link Text](./Page-Name)
[Development Sessions](./Session-Template)
```

### Session Record Workflow
1. Copy **Session-Template** for each new development session
2. Fill in the template as you work
3. Create new wiki page with date: `YYYY-MM-DD-Session-Name`
4. Update **Home** page to link to the new session

### Maintenance
- Update **Home** page with latest session link
- Keep **Tech-Stack** current as architecture evolves
- Add new issues to **Common-Issues** as you encounter them
- Document major decisions as **ADR-XXX** pages

## Automation Ideas (Future)
- GitHub Action to auto-create session template
- Script to update Home page with latest session
- Auto-link creation between related pages

---

**Start with the Home page and Session-Template, then document each development session moving forward!**