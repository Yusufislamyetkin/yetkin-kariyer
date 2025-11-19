// Lightweight sanitization helpers without external dependencies.
// For rich-text, we apply a conservative whitelist; for plain text, we strip all tags.

const DEFAULT_ALLOWED_TAGS = new Set([
	"p",
	"b",
	"strong",
	"i",
	"em",
	"u",
	"a",
	"ul",
	"ol",
	"li",
	"code",
	"pre",
	"h1",
	"h2",
	"h3",
	"br"
]);

const DEFAULT_ALLOWED_ATTRS: Record<string, Set<string>> = {
	a: new Set(["href", "title", "rel", "target"])
};

function stripTags(input: string): string {
	// Remove all HTML tags
	return input.replace(/<[^>]*>/g, "");
}

export function sanitizePlainText(input: string | null | undefined, maxLen?: number): string {
	const value = typeof input === "string" ? input : "";
	const noTags = stripTags(value);
	const trimmed = noTags.trim();
	if (typeof maxLen === "number" && maxLen > 0 && trimmed.length > maxLen) {
		return trimmed.slice(0, maxLen);
	}
	return trimmed;
}

export function sanitizeRichText(input: string | null | undefined, options?: { allowedTags?: string[] }): string {
	const value = typeof input === "string" ? input : "";
	const allowedTags = new Set((options?.allowedTags ?? Array.from(DEFAULT_ALLOWED_TAGS)).map((t) => t.toLowerCase()));
	// Basic HTML tokenizer: remove disallowed tags and attributes.
	return value.replace(/<([^>\s/!]+)([^>]*)>|<\/([^>\s]+)>/gi, (match, openTag: string, attrs: string, closeTag: string) => {
		if (closeTag) {
			const tag = closeTag.toLowerCase();
			return allowedTags.has(tag) ? `</${tag}>` : "";
		}
		if (openTag) {
			const tag = openTag.toLowerCase();
			if (!allowedTags.has(tag)) {
				return "";
			}
			// Keep only allowed attributes
			let safeAttrs = "";
			if (attrs && attrs.trim().length > 0) {
				const attrAllowed = DEFAULT_ALLOWED_ATTRS[tag] ?? new Set<string>();
				const attrPairs = Array.from(attrs.matchAll(/([^\s=]+)(?:=("([^"]*)"|'([^']*)'|[^\s"'>]+))?/g));
				const kept: string[] = [];
				for (const m of attrPairs) {
					const rawName = (m[1] ?? "").toLowerCase();
					if (!attrAllowed.has(rawName)) continue;
					let value = m[3] ?? m[4] ?? (m[2] ? m[2].replace(/^=/, "") : "");
					// Prevent javascript: and data: urls
					if (rawName === "href") {
						const href = String(value).replace(/^['"]|['"]$/g, "");
						const lower = href.trim().toLowerCase();
						if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
							continue;
						}
					}
					kept.push(`${rawName}=${value}`);
				}
				if (tag === "a") {
					// enforce rel and target for links
					if (!kept.some((k) => k.startsWith("rel="))) {
						kept.push(`rel="noopener noreferrer"`);
					}
					if (!kept.some((k) => k.startsWith("target="))) {
						kept.push(`target="_blank"`);
					}
				}
				safeAttrs = kept.length ? " " + kept.join(" ") : "";
			}
			return `<${tag}${safeAttrs}>`;
		}
		return "";
	});
}

export function truncate(input: string, maxLen: number): string {
	if (input.length <= maxLen) return input;
	return input.slice(0, maxLen);
}


