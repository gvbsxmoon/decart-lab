# Decart AI - Research & Discovery Index

> Project Goal: Evaluate Decart AI for real-time AI video, virtual try-on, and mobile performance. Build toward an MVP.

## Research Documents

| File | Topic | Status |
|------|-------|--------|
| [01-PLATFORM-OVERVIEW.md](./01-PLATFORM-OVERVIEW.md) | Platform capabilities, models, APIs | Complete |
| [02-PRICING-AND-COSTS.md](./02-PRICING-AND-COSTS.md) | Pricing breakdown and cost modeling | Complete |
| [03-MOBILE-SDK.md](./03-MOBILE-SDK.md) | iOS/Android SDK notes (FYI only - web focus) | Complete |
| [04-VIRTUAL-TRYON.md](./04-VIRTUAL-TRYON.md) | Virtual try-on feasibility analysis | Complete |
| [05-MVP-SCOPE.md](./05-MVP-SCOPE.md) | MVP definition and architecture | Complete |
| [06-EXPERIMENTS-LOG.md](./06-EXPERIMENTS-LOG.md) | Running log of all experiments | Active |

## Key Findings (Summary)

- Decart offers 3 API types: Realtime (WebRTC), Queue (batch video), Process (sync image)
- **Virtual try-on** is achievable via `lucy_2_rt` model with reference images at $0.02/sec
- Web SDK via `@decartai/sdk` npm package (our focus)
- Native SDKs exist for iOS/Android if needed later
- Pay-as-you-go pricing, no subscriptions
- Client tokens solve frontend API key security

## API Key

Stored securely - not committed to repo. Use `.env` file:
```
VITE_DECART_API_KEY=your-key-here
```
