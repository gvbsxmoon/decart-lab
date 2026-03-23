# Decart AI - Platform Overview

> Source: https://docs.platform.decart.ai/ | Fetched: 2026-03-23

## Company

Decart AI Lab - "World-leading AI lab building the fastest generative video and multimodal models." Valued at $3.1B. Profitable within 3 months. Partners: Comcast, NVIDIA.

## Authentication

- API keys from platform.decart.ai
- Secret keys (`sk-...`) for backend only
- Client tokens (`ek_...`) for frontend/mobile - short-lived, scoped
  - TTL: 1-3600 seconds (default 60s)
  - Can restrict to specific models
  - Can limit session duration
  - Active sessions survive token expiry

## SDKs

| Platform | Package | Install |
|----------|---------|---------|
| JavaScript/TS | `@decartai/sdk` | `npm install @decartai/sdk` |
| Python | decart SDK | See /sdks/python |
| Swift (iOS) | DecartSDK | SPM: `github.com/decartai/decart-ios` |
| Android | decart-android | JitPack: `com.github.DecartAI:decart-android:0.2.0` |

## Three API Types

### 1. Realtime API (WebRTC)
- Live camera/video stream transformation
- Sub-35ms latency
- `client.realtime.connect(stream, options)`
- Dynamic prompt updates mid-session
- Connection state monitoring

### 2. Queue API (Batch)
- Async video generation/editing
- `client.queue.submitAndPoll(config)`
- Returns video Blob on completion

### 3. Process API (Sync)
- Single image generation/editing
- `client.process(config)`
- Returns image Blob directly

## Models

### Realtime Models (live stream)

| Model | ID | Use Case | FPS | Resolution | Cost/sec |
|-------|----|----------|-----|------------|----------|
| Lucy 2 | `lucy_2_rt` | Character transform, video editing | 25 | 1280x704 | $0.02 |
| Mirage V2 | `mirage_v2` | Style transfer (anime, cyberpunk, etc.) | 25 | 1280x704 | $0.01 |
| LipSync | `lipsync` | Lip movement sync | 25 | 1280x720 | $0.01 |
| Avatar Live | `live_avatar` | Talking avatar from portrait + audio | 25 | 1280x720 | $0.01 |

### Video Models (batch)

| Model | ID | Use Case | Resolution | Cost/sec |
|-------|----|----------|------------|----------|
| Lucy 2 V2V | `lucy-2-v2v` | Video-to-video editing | 720p | $0.04 |
| Lucy Restyle V2V | `lucy-restyle-v2v` | Video restyling | 720p | $0.01 |
| Lucy Motion | `lucy-motion` | Trajectory-guided motion | 720p | $0.03 |
| Lucy Pro T2V | `lucy-pro-t2v` | Text-to-video | 480p/720p | $0.04/$0.08 |
| Lucy Pro I2V | `lucy-pro-i2v` | Image-to-video | 480p/720p | $0.04/$0.08 |

### Image Models (sync)

| Model | ID | Use Case | Resolution | Cost |
|-------|----|----------|------------|------|
| Lucy Pro T2I | `lucy-pro-t2i` | Text-to-image | 720p | $0.02/img |
| Lucy Pro I2I | `lucy-pro-i2i` | Image-to-image | 480p/720p | $0.01/$0.02 |

## Key Technical Details

- **Realtime** uses WebRTC - requires camera access (getUserMedia)
- Each model exposes `.fps`, `.width`, `.height` for camera config
- `set()` method replaces entire state atomically - omitted fields are cleared
- Connection states: `connecting` → `connected` → `disconnected`
- Reference images: JPEG, PNG, WebP via File, Blob, or URL
