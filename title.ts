export function normalizePrTitle(rawTitle: string): string {
	return rawTitle
		.replace(/\n/g, " ")
		.replace(/\s*#\d+(?:\s*Edit title)?\s*$/, "")
		.replace(/\s+/g, " ")
		.trim()
}
