# Virtual Try-On - Feasibility Analysis

> Fetched: 2026-03-23

## How It Works with Decart

Decart doesn't have a dedicated "virtual try-on" model, but **Lucy 2 RT (`lucy_2_rt`)** enables it through **character transformation with reference images**.

### Mechanism
1. User opens camera stream (WebRTC)
2. App provides a **reference image** (e.g., person wearing target outfit/look)
3. Lucy 2 RT transforms the live video to match the reference
4. User sees themselves "wearing" the look in real-time

### API Flow
```typescript
const client = createDecartClient({ apiKey });
const model = models.realtime("lucy_2_rt"); // 25fps, 1280x704

const session = await client.realtime.connect(cameraStream, {
  model,
  onRemoteStream: (stream) => { videoElement.srcObject = stream; },
  initialState: {
    prompt: { text: "Transform into this character", enhance: true },
    image: referenceImage // File, Blob, or URL
  }
});

// Switch outfit/look
await session.set({
  prompt: { text: "Transform into this character", enhance: true },
  image: newReferenceImage
});
```

### Important: `set()` replaces entire state
When changing reference images, you must include ALL fields (prompt + image + enhance) or they get cleared.

## What "Virtual Try-On" Means Here

This is **character/appearance transformation**, not garment-specific try-on. It works best for:

### Strong Use Cases
- **Full look transformation** - hair, makeup, overall style
- **Character cosplay** - transform into a specific character look
- **Style preview** - "what would I look like with this aesthetic"
- **Avatar/filter effects** - artistic transformations of appearance

### Weaker Use Cases (Limitations)
- **Specific garment fitting** - not designed for precise clothing overlay
- **Size/fit visualization** - no body measurement or garment physics
- **Color-accurate product representation** - artistic interpretation, not catalog accuracy
- **Accessory-only changes** - may transform more than intended

## Alternative Approach: Mirage V2 for Style Transfer

For broader style changes (not character-specific):
- **Model**: `mirage_v2` at $0.01/sec (half the cost)
- **Use case**: "Show me in anime style" / "cyberpunk look" / "oil painting"
- **Prompt-only** - no reference image needed
- Better for artistic/entertainment use cases

## Cost per Try-On Session

| Scenario | Model | Duration | Cost |
|----------|-------|----------|------|
| Quick preview | Lucy 2 RT | 10s | $0.20 |
| Standard try-on | Lucy 2 RT | 30s | $0.60 |
| Style browse | Mirage V2 | 30s | $0.30 |
| Extended session | Lucy 2 RT | 60s | $1.20 |

## Feasibility Rating

| Criteria | Rating | Notes |
|----------|--------|-------|
| Technical feasibility | High | API supports it directly |
| Accuracy for fashion | Medium | Character transform, not garment-specific |
| Latency | High | Sub-35ms claimed, WebRTC |
| Mobile support | High | Native SDKs + web WebRTC |
| Cost efficiency | Medium | $0.02/sec adds up with scale |
| User experience | High | Real-time is compelling |

## Recommendation

**Viable for MVP** with these caveats:
1. Position as "style/look preview" not "exact garment try-on"
2. Use high-quality reference images for best results
3. Implement session time limits (30s default) to control costs
4. Start with web (React) MVP, mobile native later
5. Test with diverse reference images to understand transformation quality
