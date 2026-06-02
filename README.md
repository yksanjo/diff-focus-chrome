# Diff-Focus

A Chrome extension (Manifest V3) that adds a code-review context card to GitHub
Pull Request pages. Click the toolbar button on any PR and it scrapes the diff
from the page, runs a set of heuristics over it, and renders an inline analysis
card summarizing what changed and where the risk is.

## What it flags

- **Risk level** (Low / Medium / High) derived from the patterns below.
- **Destructive DB operations** — `DROP TABLE`, `ALTER TABLE`, `DELETE FROM`, `TRUNCATE`.
- **Auth / privacy / config changes** — `Auth::`, `PrivacyCheck`, `ViewerContext`, `.env`, `secrets`.
- **PyTorch model changes** — `torch.nn`, `torch.optim`, `torch.load/save`.
- **Debug artifacts left in** — `console.log`, `var_dump`, `print_r`, `pdb.set_trace`.
- **File types touched** — React, Hack/PHP, Python, SQL migrations, styling.
- **TODO comments** and React hook changes.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this directory.
4. Open any `https://github.com/*/pull/*` page, click the **Diff-Focus**
   toolbar icon, then **Analyze Current PR**.

## Files

```text
manifest.json   # MV3 manifest (content script + popup, github.com host perms)
content.js      # diff extraction, heuristic analysis, inline card rendering
content.css     # styling for the analysis card
popup.html/js   # toolbar popup; triggers analysis on the active PR tab
icons/          # extension icons
```

## Stack

Vanilla JavaScript, Chrome Extension Manifest V3. No build step or dependencies.
