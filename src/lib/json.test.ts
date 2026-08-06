import { describe, expect, it } from 'vitest'
import { escapeInput, unescapeInput } from './json'

describe('escapeInput', () => {
	it('escapes quotes, backslashes, and line breaks', () => {
		expect(escapeInput('line\n"quote"\\')).toBe('line\\n\\"quote\\"\\\\')
	})
})

describe('unescapeInput', () => {
	it('formats valid JSON with arbitrary surrounding whitespace', () => {
		expect(unescapeInput('\uFEFF  { "name": "Ada", "items": [1, 2] }  ')).toBe(
			'{\n  "name": "Ada",\n  "items": [\n    1,\n    2\n  ]\n}',
		)
	})

	it('unwraps multiple JSON-string layers', () => {
		const json = JSON.stringify({ user: { name: 'Ada' }, enabled: true })
		expect(unescapeInput(JSON.stringify(JSON.stringify(json)))).toBe(
			'{\n  "user": {\n    "name": "Ada"\n  },\n  "enabled": true\n}',
		)
	})

	it('decodes escaped JSON fragments that are not valid JSON by themselves', () => {
		expect(unescapeInput(String.raw`{\"name\":\"Ada\",\"count\":2}`)).toBe(
			'{\n  "name": "Ada",\n  "count": 2\n}',
		)
	})

	it('decodes JSON slashes and Unicode escape sequences', () => {
		expect(unescapeInput(String.raw`https:\/\/example.com\/\uD83D\uDE03`)).toBe('https://example.com/😃')
	})

	it('preserves unknown and incomplete escapes instead of failing', () => {
		expect(unescapeInput(String.raw`C:\Users\alex\logs\q\u12ZZ`)).toBe(String.raw`C:\Users\alex\logs\q\u12ZZ`)
	})

	it('returns a partially broken JSON fragment after decoding what is valid', () => {
		expect(unescapeInput(String.raw`{\"name\":\"Ada\"`)).toBe('{"name":"Ada"')
	})
})
