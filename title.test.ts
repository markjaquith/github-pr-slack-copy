import { describe, expect, it } from "bun:test"

import { normalizePrTitle } from "./title"

describe("normalizePrTitle", () => {
	it("removes trailing PR number", () => {
		expect(normalizePrTitle("Fix bug #1234")).toBe("Fix bug")
	})

	it("removes trailing PR number and edit-title text", () => {
		expect(
			normalizePrTitle(
				"[CAN-1146] fix Canada payroll detail table overflow on wide screens#10174Edit title",
			),
		).toBe("[CAN-1146] fix Canada payroll detail table overflow on wide screens")
	})

	it("normalizes whitespace", () => {
		expect(normalizePrTitle("  Fix\n\n bug   #42   ")).toBe("Fix bug")
	})
})
