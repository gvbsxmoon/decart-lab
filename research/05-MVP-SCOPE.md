# MVP Scope Definition

> Date: 2026-03-23

## Goal

Build a web-based (React) MVP that demonstrates Decart AI's real-time video capabilities, focusing on virtual try-on / character transformation and style transfer.

## MVP Features

### P0 - Must Have
1. **Live camera feed** with WebRTC via `@decartai/sdk`
2. **Style transfer** using Mirage V2 ($0.01/sec) - select from preset styles
3. **Character transform** using Lucy 2 RT ($0.02/sec) - upload reference image
4. **Session timer** - visible countdown, auto-disconnect at limit
5. **Basic UI** - camera view, transformed view, style/image selector

### P1 - Should Have
6. **Cost tracking display** - show running cost per session
7. **Preset reference images** - curated gallery for try-on demos
8. **Prompt input** - custom text prompts for video editing

### P2 - Nice to Have
10. **Avatar Live demo** - talking avatar from portrait + audio
11. **Before/after toggle** - switch between original and transformed
12. **Screenshot capture** - save transformed frame
13. **Session history** - log of experiments with costs

## Architecture

```
React App (Vite)
├── Camera capture (getUserMedia)
├── Decart SDK (@decartai/sdk)
│   ├── Realtime API (WebRTC)
│   │   ├── mirage_v2 (style transfer)
│   │   └── lucy_2_rt (character transform)
│   └── Client token fetch (from backend or direct for MVP)
├── UI Components
│   ├── VideoPlayer (local + remote streams)
│   ├── StyleSelector (preset prompts)
│   ├── ImageUploader (reference images)
│   └── SessionControls (start/stop/timer)
└── Cost tracker (client-side estimate)
```

## Security for MVP

- **Phase 1 (dev/demo)**: API key in `.env` via `VITE_DECART_API_KEY`
- **Phase 2 (production)**: Backend endpoint for client token generation

## Estimated MVP Cost (Development & Testing)

| Activity | Sessions | Avg Duration | Model | Est. Cost |
|----------|----------|--------------|-------|-----------|
| Dev testing | 50 | 15s | Mixed | ~$10 |
| Style presets | 20 | 30s | Mirage V2 | ~$6 |
| Try-on testing | 20 | 30s | Lucy 2 RT | ~$12 |
| Demo sessions | 10 | 60s | Mixed | ~$9 |
| **Total** | | | | **~$37** |

Plus free credits from signup.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- `@decartai/sdk` (npm)
- No additional backend for MVP (direct API key)

## Next Steps

1. Install `@decartai/sdk`
2. Set up `.env` with API key
3. Build camera capture component
4. Integrate Mirage V2 (cheapest realtime model) first
5. Add Lucy 2 RT character transform
6. Test on mobile browsers
7. Log all experiments in `06-EXPERIMENTS-LOG.md`
