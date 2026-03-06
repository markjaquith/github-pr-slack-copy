import { describe, expect, it } from "bun:test"

import {
	findPrTitleElement,
	findPrTitleInHtml,
	isDraftPullRequest,
	looksLikePullRequestPage,
} from "./github-pr-page"

function createRoot(matches: Record<string, { textContent?: string } | null>) {
	return {
		querySelector(selector: string) {
			return matches[selector] ?? null
		},
	} as unknown as ParentNode
}

describe("github-pr-page helpers", () => {
	it("finds the pull request title from the current GitHub selector", () => {
		const document = createRoot({
			'h1[data-component="PH_Title"]': { textContent: "Ship the thing #123" },
		})

		expect(findPrTitleElement(document)?.textContent).toBe("Ship the thing #123")
	})

	it("finds the pull request title from the legacy selector", () => {
		const document = createRoot({
			"h1.gh-header-title": { textContent: "Ship the thing #123" },
		})

		expect(findPrTitleElement(document)?.textContent).toBe("Ship the thing #123")
	})

	it("detects draft pull requests from issue state text", () => {
		const document = createRoot({
			'[data-testid="issue-state"]': { textContent: "Draft" },
		})

		expect(isDraftPullRequest(document)).toBe(true)
	})

	it("finds the pull request title in raw HTML", () => {
		const titleMatch = findPrTitleInHtml(
			'<main><h1 data-component="PH_Title"><span>Ship the thing #123</span></h1></main>',
		)

		expect(titleMatch).toEqual({
			selector: 'h1[data-component="PH_Title"]',
			text: "Ship the thing #123",
		})
	})

	it("recognizes pull request URLs", () => {
		expect(looksLikePullRequestPage("https://github.com/owner/repo/pull/123")).toBe(true)
		expect(looksLikePullRequestPage("https://github.com/owner/repo/issues/123")).toBe(false)
	})
})
