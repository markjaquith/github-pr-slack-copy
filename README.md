# GitHub PR Slack Copy

A tiny Bun-powered bookmarklet that copies the current GitHub pull request as a Slack-friendly link.

## What it copies

- `:pr: [Title](https://github.com/org/repo/pull/123)`
- `:draft: [Title](https://github.com/org/repo/pull/123)` for draft pull requests

## Development Requirements

- [Bun](https://bun.sh)
- A browser with bookmarklets enabled

## Build

```sh
./build.ts
```

This writes the bookmarklet URL to:

- `github-pr-slack-copy.bookmarklet`
- `docs/index.html` for the GitHub Pages install site

## Install

The easiest install flow is the GitHub Pages site: drag the generated `GitHub PR Slack Copy` link from `docs/index.html` to your bookmarks bar.

Manual install:

1. Run `./build.ts`.
2. Copy the contents of `github-pr-slack-copy.bookmarklet`.
3. Create or edit a browser bookmark.
4. Paste the bookmarklet into the bookmark URL field.
5. Visit a GitHub pull request page and click the bookmark.

Alternative: create any bookmark first, then edit it and replace the URL with the bookmarklet code.

Bookmarks bar not visible? Press `Ctrl+Shift+B` on Windows/Linux or `Cmd+Shift+B` on Mac.

## Editing

The source bookmarklet lives in `bookmarklet.ts`.

1. Edit `bookmarklet.ts`.
2. Run `./build.ts`.
3. The generated bookmarklet will be written to `github-pr-slack-copy.bookmarklet`.

## Test

```sh
bun test
```

## Automation

- CI runs tests on pushes and pull requests.
- CI rebuilds the bookmarklet and Pages output, and fails if generated files are out of sync.
- GitHub Pages deploys the `docs/` site from `main`.
- A daily workflow checks a live public GitHub pull request page and opens or updates an issue if GitHub's HTML changes in a way that breaks selector detection.

## Repo notes

- `origin` points at the full GitHub repository.
- `gist` points at the legacy Gist redirect.
