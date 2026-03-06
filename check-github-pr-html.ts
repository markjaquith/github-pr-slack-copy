#!/usr/bin/env bun

import {
	findPrTitleInHtml,
	getPrPageDiagnosticsFromHtml,
	looksLikePullRequestPage,
} from "./github-pr-page"
import { normalizePrTitle } from "./title"

const monitorOwner = process.env.MONITOR_OWNER ?? "cli"
const monitorRepo = process.env.MONITOR_REPO ?? "cli"

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url, {
		headers: {
			Accept: "application/vnd.github+json",
			"User-Agent": "github-pr-slack-copy-monitor",
		},
	})

	if (!response.ok) {
		throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)
	}

	return (await response.json()) as T
}

async function fetchText(url: string): Promise<string> {
	const response = await fetch(url, {
		headers: {
			"User-Agent": "github-pr-slack-copy-monitor",
		},
	})

	if (!response.ok) {
		throw new Error(`HTML request failed: ${response.status} ${response.statusText}`)
	}

	return response.text()
}

type PullRequestSummary = {
	html_url: string
	number: number
	title: string
}

const pulls = await fetchJson<PullRequestSummary[]>(
	`https://api.github.com/repos/${monitorOwner}/${monitorRepo}/pulls?state=open&per_page=1`,
)

if (pulls.length === 0) {
	throw new Error(`No open pull requests found for ${monitorOwner}/${monitorRepo}`)
}

const pull = pulls[0]

if (!looksLikePullRequestPage(pull.html_url)) {
	throw new Error(`Selected URL does not look like a pull request page: ${pull.html_url}`)
}

const html = await fetchText(pull.html_url)
const titleMatch = findPrTitleInHtml(html)

if (!titleMatch) {
	const diagnostics = getPrPageDiagnosticsFromHtml(html)
	throw new Error(
		[
			`Could not find a PR title on ${pull.html_url}`,
			`Title selector matches: ${diagnostics.titleSelectorMatches.join(", ") || "none"}`,
			`Draft selector matches: ${diagnostics.draftSelectorMatches.join(", ") || "none"}`,
		].join("\n"),
	)
}

const normalizedTitle = normalizePrTitle(titleMatch.text)

if (!normalizedTitle) {
	throw new Error(`Matched title element was empty on ${pull.html_url}`)
}

console.log(
	`Verified PR HTML selectors against ${monitorOwner}/${monitorRepo}#${pull.number}: ${normalizedTitle}`,
)
