import { useCallback, useRef, useState } from 'react';
import { LUCY_2_RT } from '@/lib/decart';

export type CameraState = 'idle' | 'requesting' | 'active' | 'error';

export function useCamera() {
	const streamRef = useRef<MediaStream | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [state, setState] = useState<CameraState>('idle');
	const [error, setError] = useState<string | null>(null);

	const start = useCallback(async () => {
		if (streamRef.current) return streamRef.current;

		setState('requesting');
		setError(null);

		try {
			const s = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: LUCY_2_RT.width },
					height: { ideal: LUCY_2_RT.height },
					frameRate: { ideal: LUCY_2_RT.fps },
					facingMode: 'user',
				},
				audio: false,
			});
			streamRef.current = s;
			setStream(s);
			setState('active');
			return s;
		} catch (err) {
			const message =
				err instanceof DOMException && err.name === 'NotAllowedError'
					? 'Camera access was denied'
					: err instanceof DOMException && err.name === 'NotFoundError'
						? 'No camera found'
						: 'Camera unavailable';
			setError(message);
			setState('error');
			return null;
		}
	}, []);

	const stop = useCallback(() => {
		streamRef.current?.getTracks().forEach(t => t.stop());
		streamRef.current = null;
		setStream(null);
		setState('idle');
		setError(null);
	}, []);

	return { stream, state, error, start, stop } as const;
}
