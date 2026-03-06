const PR_TITLE_SELECTORS = [
	'h1[data-component="PH_Title"]',
	"h1.gh-header-title",
	".js-issue-title",
] as const

const PR_DRAFT_SELECTORS = [
	'span[data-status="draft"]',
	'[data-testid="issue-state"]',
] as const

const TITLE_HTML_PATTERNS: Record<(typeof PR_TITLE_SELECTORS)[number], RegExp> = {
	'h1[data-component="PH_Title"]': /<h1[^>]*data-component=["']PH_Title["'][^>]*>([\s\S]*?)<\/h1>/i,
	"h1.gh-header-title": /<h1[^>]*class=["'][^"']*\bgh-header-title\b[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i,
	".js-issue-title": /<[^>]*class=["'][^"']*\bjs-issue-title\b[^"']*["'][^>]*>([\s\S]*?)<\//i,
}

const DRAFT_HTML_PATTERNS: Record<(typeof PR_DRAFT_SELECTORS)[number], RegExp> = {
	'span[data-status="draft"]': /<span[^>]*data-status=["']draft["'][^>]*>/i,
	'[data-testid="issue-state"]': /<[^>]*data-testid=["']issue-state["'][^>]*>[\s\S]*?draft[\s\S]*?<\//i,
}

function getTextContent(node: Element | null): string {
	return node?.textContent?.replace(/\s+/g, " ").trim() ?? ""
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

export function looksLikePullRequestPage(url: string | URL): boolean {
	const parsedUrl = typeof url === "string" ? new URL(url) : url
	return /^\/[^/]+\/[^/]+\/pull\/\d+(?:\/.*)?$/.test(parsedUrl.pathname)
}

export function findPrTitleElement(root: ParentNode): Element | null {
	for (const selector of PR_TITLE_SELECTORS) {
		const match = root.querySelector(selector)
		if (match && getTextContent(match)) {
			return match
		}
	}

	return null
}

export function isDraftPullRequest(root: ParentNode): boolean {
	const explicitDraft = root.querySelector(PR_DRAFT_SELECTORS[0])
	if (explicitDraft) {
		return true
	}

	const issueState = root.querySelector(PR_DRAFT_SELECTORS[1])
	return /\bdraft\b/i.test(getTextContent(issueState))
}

export function getPrPageDiagnostics(root: ParentNode): {
	titleSelectorMatches: string[]
	draftSelectorMatches: string[]
} {
	return {
		titleSelectorMatches: PR_TITLE_SELECTORS.filter((selector) =>
			Boolean(root.querySelector(selector)),
		),
		draftSelectorMatches: PR_DRAFT_SELECTORS.filter((selector) =>
			Boolean(root.querySelector(selector)),
		),
	}
}

export function findPrTitleInHtml(html: string): { selector: string; text: string } | null {
	for (const selector of PR_TITLE_SELECTORS) {
		const match = html.match(TITLE_HTML_PATTERNS[selector])
		const text = stripHtml(match?.[1] ?? "")
		if (text) {
			return { selector, text }
		}
	}

	return null
}

export function getPrPageDiagnosticsFromHtml(html: string): {
	titleSelectorMatches: string[]
	draftSelectorMatches: string[]
} {
	return {
		titleSelectorMatches: PR_TITLE_SELECTORS.filter((selector) =>
			TITLE_HTML_PATTERNS[selector].test(html),
		),
		draftSelectorMatches: PR_DRAFT_SELECTORS.filter((selector) =>
			DRAFT_HTML_PATTERNS[selector].test(html),
		),
	}
}

export { PR_DRAFT_SELECTORS, PR_TITLE_SELECTORS }
