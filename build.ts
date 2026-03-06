#!/usr/bin/env bun
import { mkdirSync, readFileSync, writeFileSync } from "fs"

const OUTPUT_FILE = "github-pr-slack-copy.bookmarklet"
const SITE_DIR = "docs"
const SITE_INDEX_FILE = SITE_DIR + "/index.html"
const SITE_NOJEKYLL_FILE = SITE_DIR + "/.nojekyll"
const SITE_SOURCE_DIR = "site"
const SITE_TEMPLATE_FILE = SITE_SOURCE_DIR + "/index.html"
const SITE_STYLES_FILE = SITE_SOURCE_DIR + "/styles.css"
const SITE_SCRIPT_FILE = SITE_SOURCE_DIR + "/site.js"

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;")
}

function renderTemplate(template: string, replacements: Record<string, string>): string {
	let result = template

	for (const [token, value] of Object.entries(replacements)) {
		result = result.replaceAll(token, value)
	}

	return result
}

function buildSiteHtml(bookmarklet: string): string {
	const bookmarkletHref = escapeHtml(bookmarklet)
	const currentYear = new Date().getFullYear()
	const copyrightYears = currentYear > 2026 ? `2026&ndash;${currentYear}` : "2026"
	const htmlTemplate = readFileSync(SITE_TEMPLATE_FILE, "utf8")
	const css = readFileSync(SITE_STYLES_FILE, "utf8").trim()
	const scriptTemplate = readFileSync(SITE_SCRIPT_FILE, "utf8")
	const script = renderTemplate(scriptTemplate, {
		"{{BOOKMARKLET_JSON}}": JSON.stringify(bookmarklet),
	}).trim()

	return renderTemplate(htmlTemplate, {
		"{{BOOKMARKLET_HREF}}": bookmarkletHref,
		"{{COPYRIGHT_YEARS}}": copyrightYears,
		"{{SITE_CSS}}": css,
		"{{SITE_JS}}": script,
	})
}

const result = await Bun.build({
	entrypoints: ["bookmarklet.ts"],
	minify: true,
})

if (!result.success) {
	console.error("Build failed:")
	for (const log of result.logs) {
		console.error(log)
	}
	process.exit(1)
}

const code = await result.outputs[0].text()
const bookmarklet = "javascript:" + code.trim()

writeFileSync(OUTPUT_FILE, bookmarklet)
mkdirSync(SITE_DIR, { recursive: true })
writeFileSync(SITE_INDEX_FILE, buildSiteHtml(bookmarklet))
writeFileSync(SITE_NOJEKYLL_FILE, "")

console.log("Built bookmarklet:", bookmarklet.length, "bytes ->", OUTPUT_FILE)
console.log("Built site:", SITE_INDEX_FILE)
