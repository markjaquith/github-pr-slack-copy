import { normalizePrTitle } from "./title"
import { findPrTitleElement, isDraftPullRequest, looksLikePullRequestPage } from "./github-pr-page"

;(function () {
	const h1 = findPrTitleElement(document)

	function showToast(message: string, isError?: boolean): void {
		const existingToast = document.getElementById("__bookmarklet_toast__")
		if (existingToast) {
			existingToast.remove()
		}

		const toast = document.createElement("div")
		toast.id = "__bookmarklet_toast__"
		toast.textContent = message

		Object.assign(toast.style, {
			position: "fixed",
			top: "12px",
			left: "50%",
			transform: "translateX(-50%)",
			maxWidth: "720px",
			padding: "10px 14px",
			background: isError ? "#d1242f" : "#24292f",
			color: "#fff",
			fontSize: "13px",
			lineHeight: "1.35",
			fontFamily:
				"system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
			borderRadius: "6px",
			boxShadow: "0 6px 20px rgba(0,0,0,.25)",
			whiteSpace: "pre-wrap",
			zIndex: 999999,
			opacity: "0",
			transition: "opacity .15s ease",
		})

		document.body.appendChild(toast)

		requestAnimationFrame(() => (toast.style.opacity = "1"))

		setTimeout(() => {
			toast.style.opacity = "0"
			setTimeout(() => toast.remove(), 150)
		}, 2200)
	}

	function fallbackCopy(text: string): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				const textarea = document.createElement("textarea")
				textarea.value = text
				textarea.setAttribute("readonly", "")

				Object.assign(textarea.style, {
					position: "fixed",
					top: "0",
					left: "0",
					width: "1px",
					height: "1px",
					opacity: "0",
					pointerEvents: "none",
				})

				document.body.appendChild(textarea)
				textarea.select()
				textarea.setSelectionRange(0, textarea.value.length)

				const success = document.execCommand("copy")
				textarea.remove()

				if (success) {
					resolve()
				} else {
					reject(new Error('execCommand("copy") returned false'))
				}
			} catch (error) {
				reject(error)
			}
		})
	}

	function copyPlain(text: string): Promise<void> {
		if (
			navigator.clipboard &&
			typeof navigator.clipboard.writeText === "function"
		) {
			return navigator.clipboard.writeText(text)
		}
		return fallbackCopy(text)
	}

	function escapeHtml(str: string): string {
		const escapeMap: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		}
		return str.replace(/[&<>"']/g, (char) => escapeMap[char])
	}

	if (!looksLikePullRequestPage(location.href)) {
		showToast("Open a GitHub pull request page first", true)
		return
	}

	if (!h1) {
		showToast("Could not find the pull request title on this page", true)
		return
	}

	const isDraft = isDraftPullRequest(document)
	const emoji = isDraft ? ":draft:" : ":pr:"

	const title = normalizePrTitle(h1.textContent ?? "")

	const markdown = emoji + " [" + title + "](" + location.href + ")"
	const html =
		emoji + ' <a href="' + location.href + '">' + escapeHtml(title) + "</a>"

	async function go(): Promise<void> {
		try {
			if (navigator.clipboard && window.ClipboardItem) {
				const clipboardItem = new ClipboardItem({
					"text/html": new Blob([html], { type: "text/html" }),
					"text/plain": new Blob([markdown], { type: "text/plain" }),
				})
				await navigator.clipboard.write([clipboardItem])
				showToast("Copied to clipboard")
				return
			}

			await copyPlain(markdown)
			showToast("Copied to clipboard")
		} catch (error) {
			try {
				await copyPlain(markdown)
				showToast("Copied to clipboard")
			} catch (fallbackError) {
				showToast("Failed to copy to clipboard", true)
				console.error(fallbackError)
			}
		}
	}

	go()
})()
