# GitHub PR Slack Copy

A tiny Bun-powered bookmarklet that copies the current GitHub pull request as a Slack-friendly link.

It preserves the original Gist-compatible output file name while also generating a nicer repo-friendly file name.

## What it copies

- `:pr: [Title](https://github.com/org/repo/pull/123)`
- `:draft: [Title](https://github.com/org/repo/pull/123)` for draft pull requests

## Requirements

- [Bun](https://bun.sh)
- A browser with bookmarklets enabled

## Build

```sh
./build.ts
```

This writes the bookmarklet URL to:

- `0000 GitHub PR Slack Clipboard Bookmarklet`
- `github-pr-slack-copy.bookmarklet`

## Install

1. Run `./build.ts`.
2. Copy the contents of one of the generated bookmarklet files.
3. Create or edit a browser bookmark.
4. Paste the bookmarklet into the bookmark URL field.
5. Visit a GitHub pull request page and click the bookmark.

## Test

```sh
bun test
```

## Repo notes

- `origin` can continue pointing at the original Gist remote.
- A second remote can point at the full GitHub repository.
- GitHub Actions runs tests, verifies generated bookmarklet output stays in sync, and checks a public pull request page daily for markup changes that could break selector detection.
