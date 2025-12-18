# Diff-Focus Chrome Extension

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/) [![GitHub stars](https://img.shields.io/github/stars/yksanjo/diff-focus-chrome?style=social)](https://github.com/yksanjo/diff-focus-chrome/stargazers) [![GitHub forks](https://img.shields.io/github/forks/yksanjo/diff-focus-chrome.svg)](https://github.com/yksanjo/diff-focus-chrome/network/members) [![GitHub issues](https://img.shields.io/github/issues/yksanjo/diff-focus-chrome.svg)](https://github.com/yksanjo/diff-focus-chrome/issues)
[![Last commit](https://img.shields.io/github/last-commit/yksanjo/diff-focus-chrome.svg)](https://github.com/yksanjo/diff-focus-chrome/commits/main)


Chrome extension for GitHub PR context. Analyze code diffs directly on GitHub Pull Request pages and get instant context cards with risk assessment.

## Features

- 🔍 **GitHub Integration**: Works directly on GitHub PR pages
- 🎯 **Risk Assessment**: Instant risk level categorization
- 📋 **Context Cards**: Beautiful inline cards showing analysis results
- 🚩 **Smart Flags**: Automatic detection of dangerous operations and patterns

## Installation

### From Source

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `diff-focus-chrome` directory

## Usage

1. Navigate to any GitHub Pull Request page
2. Click the Diff-Focus extension icon in your toolbar
3. Click "Analyze Current PR"
4. View the analysis card that appears on the PR page

## Building Icons

You'll need to create icon files:
- `icons/icon16.png` (16x16)
- `icons/icon48.png` (48x48)
- `icons/icon128.png` (128x128)

Or use a placeholder icon generator tool.

## Development

The extension uses:
- **Manifest V3**: Modern Chrome extension format
- **Content Scripts**: Injected into GitHub PR pages
- **Popup UI**: Extension popup for triggering analysis

## License

MIT

