## Bookmarklet Installation

1. Build the bookmarklet with `./build.ts`
2. Copy the bookmarklet code from either output file:
   - `0000 GitHub PR Slack Clipboard Bookmarklet` for Gist backwards compatibility
   - `github-pr-slack-copy.bookmarklet` for the nicer repo-friendly name
2. Right-click your bookmarks bar → **Add bookmark** (or **Add page**)
3. Name it descriptively
4. Paste the code into the **URL** field
5. Save

**Alternative:** Create any bookmark, then edit it and replace the URL with the bookmarklet code.

> Bookmarks bar not visible? Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac).

## Editing the Bookmarklet

The bookmarklet source code is in `bookmarklet.ts`. To make changes:

1. Edit `bookmarklet.ts`
2. Run `./build.ts` (requires [Bun](https://bun.sh))
3. The minified bookmarklet will be written to both `0000 GitHub PR Slack Clipboard Bookmarklet` and `github-pr-slack-copy.bookmarklet`
