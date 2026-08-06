const MAX_UNESCAPE_LAYERS = 12

function formatJson(value: unknown) {
	return JSON.stringify(value, null, 2)
}

function tryParseJson(value: string): { parsed: true; value: unknown } | { parsed: false } {
	try {
		return { parsed: true, value: JSON.parse(value) }
	} catch {
		return { parsed: false }
	}
}

/**
 * Decodes only valid JSON escape sequences. Invalid escapes are deliberately
 * kept as-is so pasting paths such as C:\Users or incomplete data is safe.
 */
function decodeJsonEscapes(value: string) {
	let decoded = ''
	let changed = false

	for (let index = 0; index < value.length; index += 1) {
		const character = value[index]
		if (character !== '\\' || index === value.length - 1) {
			decoded += character
			continue
		}

		const escapedCharacter = value[index + 1]
		const simpleEscapes: Record<string, string> = {
			'"': '"',
			'\\': '\\',
			'/': '/',
			b: '\b',
			f: '\f',
			n: '\n',
			r: '\r',
			t: '\t',
		}

		if (escapedCharacter in simpleEscapes) {
			decoded += simpleEscapes[escapedCharacter]
			index += 1
			changed = true
			continue
		}

		if (escapedCharacter === 'u') {
			const hex = value.slice(index + 2, index + 6)
			if (/^[0-9a-fA-F]{4}$/.test(hex)) {
				decoded += String.fromCharCode(Number.parseInt(hex, 16))
				index += 5
				changed = true
				continue
			}
		}

		decoded += character
	}

	return { decoded, changed }
}

export function escapeInput(input: string) {
	return JSON.stringify(input).slice(1, -1)
}

export function unescapeInput(input: string) {
	let value = input.replace(/^\uFEFF/, '')

	for (let layer = 0; layer < MAX_UNESCAPE_LAYERS; layer += 1) {
		const parsed = tryParseJson(value.trim())
		if (parsed.parsed) {
			if (typeof parsed.value !== 'string') {
				return formatJson(parsed.value)
			}

			value = parsed.value
			continue
		}

		const { decoded, changed } = decodeJsonEscapes(value)
		if (!changed) {
			break
		}
		value = decoded
	}

	const parsed = tryParseJson(value.trim())
	return parsed.parsed && typeof parsed.value !== 'string'
		? formatJson(parsed.value)
		: value
}
