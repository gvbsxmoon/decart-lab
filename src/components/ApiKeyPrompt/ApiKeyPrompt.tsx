import { useState, useCallback } from 'react';
import css from './ApiKeyPrompt.module.css';

interface ApiKeyPromptProps {
	onSubmit: (apiKey: string) => void;
}

export function ApiKeyPrompt({ onSubmit }: ApiKeyPromptProps) {
	const [key, setKey] = useState('');

	// Derived
	const canSubmit = key.trim().length > 0;

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const trimmed = key.trim();
			if (!trimmed) return;

			onSubmit(trimmed);
		},
		[key, onSubmit],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (canSubmit) {
					handleSubmit(e as unknown as React.FormEvent);
				}
			}
		},
		[canSubmit, handleSubmit],
	);

	return (
		<div className={css.overlay}>
			<div className={css.card}>
				<div className={css.heading}>
					<h1 className={css.title}>decart lab</h1>
					<p className={css.subtitle}>
						Real-time AI video transformation.
						<br />
						Enter your Decart API key to begin.
					</p>
				</div>

				<form className={css.form} onSubmit={handleSubmit}>
					<div className={css.inputRow}>
						<input
							type='password'
							value={key}
							onChange={e => {
								setKey(e.target.value);
							}}
							onKeyDown={handleKeyDown}
							placeholder='your-key-...'
							className={css.input}
							autoFocus
							autoComplete='off'
							spellCheck={false}
						/>
						<button type='submit' className={css.submitBtn} disabled={!canSubmit}>
							Connect
						</button>
					</div>
				</form>

				<span className={css.hint}>
					Get your key at{' '}
					<a href='https://platform.decart.ai' target='_blank' rel='noopener noreferrer' className={css.hintLink}>
						platform.decart.ai
					</a>{' '}
					&middot; stored in session only
				</span>
			</div>
		</div>
	);
}
