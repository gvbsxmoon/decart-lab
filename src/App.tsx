import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useDecart } from "@/hooks/useDecart";
import { VideoPanel } from "@/components/VideoPanel";
import { PromptBar } from "@/components/PromptBar";
import { SessionStatus } from "@/components/SessionStatus";
import { ApiKeyPrompt } from "@/components/ApiKeyPrompt";

import {
  getStoredApiKey,
  storeApiKey,
  clearApiKey,
  createClient,
  DEFAULT_PROMPT,
} from "@/lib/decart";
import css from "./App.module.css";

function App() {
  const [apiKey, setApiKey] = useState<string | null>(getStoredApiKey);

  // Lazy client — only created when we have a key
  const client = useMemo(
    () => (apiKey ? createClient(apiKey) : null),
    [apiKey]
  );

  const camera = useCamera();
  const decart = useDecart(client);
  const [image, setImage] = useState<File | null>(null);

  // Stable ref for sessionState to avoid recreating handleSubmit
  const sessionStateRef = useRef(decart.sessionState);
  sessionStateRef.current = decart.sessionState;

  // Derived
  const promptDisabled = decart.sessionState === "connecting";
  const promptLoading = decart.isSending;

  const handleApiKey = useCallback((key: string) => {
    storeApiKey(key);
    setApiKey(key);
  }, []);

  const handleSubmit = useCallback(
    async (prompt: string, img: File | null) => {
      const state = sessionStateRef.current;

      if (state === "idle") {
        const stream = await camera.start();
        if (!stream) return;
        await decart.connect(stream, {
          prompt: prompt || undefined,
          image: img || undefined,
        });
      } else if (state === "connected") {
        await decart.send({
          prompt: prompt || undefined,
          image: img || undefined,
        });
      }
    },
    [camera.start, decart.connect, decart.send]
  );

  const handleStop = useCallback(() => {
    decart.disconnect();
    camera.stop();
    setImage(null);
  }, [decart.disconnect, camera.stop]);

  // Derive placeholder text for camera panel
  const cameraPlaceholder =
    camera.state === "requesting" ? "requesting camera..." : "camera off";

  // Derive error display
  const displayError = decart.error || camera.error;

  // If auth error, reset key so user can re-enter
  useEffect(() => {
    if (
      decart.error &&
      apiKey &&
      /unauthorized|invalid.*key|forbidden/i.test(decart.error)
    ) {
      clearApiKey();
      setApiKey(null);
    }
  }, [decart.error, apiKey]);

  // Gate: show API key prompt if no key
  if (!apiKey) {
    return <ApiKeyPrompt onSubmit={handleApiKey} />;
  }

  return (
    <div className={css.layout}>
      <div className={css.header}>
        <span className={css.logo}>decart</span>
        <span className={css.model}>lucy_2_rt</span>
      </div>

      <div className={css.panels}>
        <VideoPanel
          stream={camera.stream}
          label="you"
          muted
          mirror
          placeholderText={cameraPlaceholder}
          errorText={camera.error || undefined}
          className={css.panelLocal}
        />
        <VideoPanel
          stream={decart.remoteStream}
          label="ai"
          status={decart.sessionState}
          placeholderText="send a prompt to begin"
          errorText={
            decart.sessionState === "error"
              ? decart.error || undefined
              : undefined
          }
          className={css.panelRemote}
        />
      </div>

      <div className={css.promptArea}>
        <PromptBar
          disabled={promptDisabled}
          loading={promptLoading}
          image={image}
          defaultPrompt={DEFAULT_PROMPT}
          onSubmit={handleSubmit}
          onImageChange={setImage}
        />
      </div>

      <div className={css.statusArea}>
        <SessionStatus
          sessionState={decart.sessionState}
          seconds={decart.seconds}
          cost={decart.cost}
          error={displayError}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}

export default App;
