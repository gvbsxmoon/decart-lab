import { useCallback, useRef, useState } from 'react';
import type { RealTimeClient, ConnectionState } from '@decartai/sdk';
import { LUCY_2_RT, COST_PER_SECOND, DEFAULT_PROMPT } from '@/lib/decart';

export type SessionState = 'idle' | 'connecting' | 'connected' | 'error';

type DecartClient = ReturnType<typeof import('@decartai/sdk').createDecartClient>;

export function useDecart(client: DecartClient | null) {
	const rtcRef = useRef<RealTimeClient | null>(null);
	const [sessionState, setSessionState] = useState<SessionState>('idle');
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [seconds, setSeconds] = useState(0);
	const [isSending, setIsSending] = useState(false);

	// Derived
	const cost = seconds * COST_PER_SECOND;
	const isActive = sessionState === 'connected' || sessionState === 'connecting';

	// Keep client ref current for stable callbacks
	const clientRef = useRef(client);
	clientRef.current = client;

	const connect = useCallback(async (cameraStream: MediaStream, opts?: { prompt?: string; image?: File | Blob | null }) => {
		const c = clientRef.current;
		if (!c || rtcRef.current) return;

		setSessionState('connecting');
		setError(null);
		setSeconds(0);

		try {
			const initialState: {
				prompt?: { text: string; enhance: boolean };
				image?: File | Blob;
			} = {};

			const promptText = opts?.prompt || (opts?.image ? DEFAULT_PROMPT : undefined);
			if (promptText) {
				initialState.prompt = { text: promptText, enhance: true };
			}
			if (opts?.image) {
				initialState.image = opts.image;
			}

			const rtc = await c.realtime.connect(cameraStream, {
				model: LUCY_2_RT,
				onRemoteStream: setRemoteStream,
				initialState: Object.keys(initialState).length > 0 ? initialState : undefined,
			});

			rtc.on('connectionChange', (state: ConnectionState) => {
				if (state === 'connected') setSessionState('connected');
				else if (state === 'disconnected') {
					setSessionState('idle');
					setRemoteStream(null);
					rtcRef.current = null;
				}
			});

			rtc.on('generationTick', ({ seconds: s }) => setSeconds(s));

			rtc.on('error', err => {
				setError(err.message || 'Connection error');
				setSessionState('error');
			});

			rtcRef.current = rtc;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to connect');
			setSessionState('error');
		}
	}, []);

	const send = useCallback(async (opts: { prompt?: string; image?: File | Blob | null }) => {
		const rtc = rtcRef.current;
		if (!rtc || !rtc.isConnected()) return;

		setIsSending(true);
		try {
			await rtc.set({
				prompt: opts.prompt || undefined,
				image: opts.image || undefined,
				enhance: true,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update');
		} finally {
			setIsSending(false);
		}
	}, []);

	const disconnect = useCallback(() => {
		rtcRef.current?.disconnect();
		rtcRef.current = null;
		setSessionState('idle');
		setRemoteStream(null);
		setError(null);
		setSeconds(0);
	}, []);

	return {
		sessionState,
		remoteStream,
		error,
		seconds,
		cost,
		isActive,
		isSending,
		connect,
		send,
		disconnect,
	} as const;
}
