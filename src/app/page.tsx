'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
	const [leftText, setLeftText] = useState('')
	const [rightText, setRightText] = useState('')

	const handlePaste = (e: React.ClipboardEvent) => {
		const pastedText = e.clipboardData.getData('text')
		try {
			// Try to parse as JSON first
			const jsonObj = JSON.parse(pastedText)
			// If successful, it's JSON, so pretty print it
			setLeftText(JSON.stringify(jsonObj, null, 2))
			e.preventDefault() // Prevent default paste
		} catch {
			// If not valid JSON, let default paste happen
			return
		}
	}

	const handleEscape = () => {
		try {
			const escaped = JSON.stringify(leftText).slice(1, -1)
			setRightText(escaped)
		} catch (error) {
			console.log(error)
			setRightText('Invalid input')
		}
	}

	const handleUnescape = () => {
		try {
			const unescaped = JSON.parse(`"${leftText}"`)
			// Try to parse the unescaped string as JSON for pretty printing
			try {
				const jsonObj = JSON.parse(unescaped)
				setRightText(JSON.stringify(jsonObj, null, 2))
			} catch {
				// If not valid JSON, just show the unescaped string
				setRightText(unescaped)
			}
		} catch (error) {
			console.log(error)
			setRightText('Invalid input')
		}
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(rightText);
	}

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Escape-or-Unescape JSON</h1>
			</header>

			<main className={styles.main}>
				<textarea
					value={leftText}
					onChange={(e) => setLeftText(e.target.value)}
					onPaste={handlePaste}
					className={styles.textbox}
					placeholder="Enter text here..."
				/>
				<div className={styles.buttons}>
					<button onClick={handleEscape}>Escape</button>
					<button onClick={handleUnescape}>Unescape</button>
				</div>
				<div className={styles.resultContainer}>
					<textarea
						value={rightText}
						readOnly
						className={styles.textbox}
						placeholder="Result will appear here..."
					/>
					<button
						onClick={handleCopy}
						className={styles.copyButton}
						title="Copy to clipboard"
					>
						📋
					</button>
				</div>
			</main>

			<footer className={styles.footer}>
				<a href="https://github.com/Ayanjit/escapejson" target="_blank" rel="noopener noreferrer">code</a>
			</footer>
		</div>
	)
}
