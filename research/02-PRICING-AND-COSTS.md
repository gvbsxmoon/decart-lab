# Decart AI - Pricing & Cost Analysis

> Source: https://docs.platform.decart.ai/getting-started/pricing | Fetched: 2026-03-23

## Pricing Model

**Pay-as-you-go**. No subscriptions, no minimum spend. Free credits on signup (amount unspecified). Enterprise volume pricing via contact@decart.ai.

## Cost Table

### Realtime (per second of active generation)

| Model | Cost/sec | Resolution |
|-------|----------|------------|
| Lucy 2 (`lucy_2_rt`) | **$0.02** | 720p |
| Mirage V2 (`mirage_v2`) | $0.01 | 720p |
| LipSync (`lipsync`) | $0.01 | 720p |
| Avatar Live (`live_avatar`) | $0.01 | 720p |

### Video (per generated second)

| Model | Cost/sec | Resolution |
|-------|----------|------------|
| Lucy 2 V2V | $0.04 | 720p |
| Lucy Restyle V2V | $0.01 | 720p |
| Lucy Motion | $0.03 | 720p |
| Lucy Pro T2V | $0.04 / $0.08 | 480p / 720p |
| Lucy Pro I2V | $0.04 / $0.08 | 480p / 720p |
| Lucy Edit (legacy) | $0.15 | 720p |

### Image (per generation)

| Model | Cost | Resolution |
|-------|------|------------|
| Lucy Pro T2I | $0.02 | 720p |
| Lucy Pro I2I | $0.01 / $0.02 | 480p / 720p |

## Cost Scenarios for MVP

### Virtual Try-On (Realtime - Lucy 2)

| Session Length | Cost | Notes |
|---------------|------|-------|
| 10 seconds | $0.20 | Quick try-on preview |
| 30 seconds | $0.60 | Standard try-on session |
| 60 seconds | $1.20 | Extended browsing |
| 5 minutes | $6.00 | Long interactive session |

### Daily Cost Estimates (Lucy 2 RT at $0.02/sec)

| Daily Active Users | Avg Session | Daily Cost | Monthly Cost |
|--------------------|-------------|------------|--------------|
| 10 | 30s | $6 | $180 |
| 100 | 30s | $60 | $1,800 |
| 1,000 | 30s | $600 | $18,000 |
| 10,000 | 30s | $6,000 | $180,000 |

### Style Transfer Alternative (Mirage V2 at $0.01/sec - 50% cheaper)

| Daily Active Users | Avg Session | Daily Cost | Monthly Cost |
|--------------------|-------------|------------|--------------|
| 100 | 30s | $30 | $900 |
| 1,000 | 30s | $300 | $9,000 |

## Cost Optimization Strategies

1. **Use Mirage V2 ($0.01/sec) where possible** instead of Lucy 2 ($0.02/sec)
2. **Limit session duration** - auto-disconnect after N seconds
3. **Use batch API for non-realtime** - queue API is more cost-effective for offline processing
4. **Image-first approach** - use $0.02 image generation for previews before committing to video
5. **Client tokens with maxSessionDuration** - enforce server-side session limits
6. **Start stream on user action** - don't auto-start, wait for explicit trigger

## Rate Limits

Not documented. Need to test empirically and track in experiments log.

## Key Takeaway

At $0.02/sec for realtime virtual try-on, a 30-second session costs $0.60. This is viable for high-value use cases (fashion, e-commerce) but needs careful session management for consumer apps.
