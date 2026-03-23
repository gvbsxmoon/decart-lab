# Experiments Log

> Track every experiment, test, and finding here.

## Format

Each experiment entry should include:
- **Date**
- **Objective**: What we're testing
- **Model used**: Which Decart model
- **Setup**: How we ran it
- **Result**: What happened
- **Cost**: Estimated cost of the experiment
- **Takeaway**: What we learned

---

## Experiments

### EXP-001: [Pending] SDK Installation & Basic Connection
- **Date**: TBD
- **Objective**: Install `@decartai/sdk`, verify API key, establish first connection
- **Model**: N/A (auth only)
- **Setup**: `npm install @decartai/sdk`, create client, test auth
- **Result**: TBD
- **Cost**: $0 (no generation)
- **Takeaway**: TBD

### EXP-002: [Pending] First Realtime Style Transfer
- **Date**: TBD
- **Objective**: Stream camera through Mirage V2, verify real-time transformation
- **Model**: `mirage_v2` ($0.01/sec)
- **Setup**: Camera capture → Decart Realtime API → display transformed stream
- **Result**: TBD
- **Cost**: Est. ~$0.30 (30s test)
- **Takeaway**: TBD

### EXP-003: [Pending] Character Transform with Reference Image
- **Date**: TBD
- **Objective**: Test Lucy 2 RT with reference image for virtual try-on
- **Model**: `lucy_2_rt` ($0.02/sec)
- **Setup**: Camera + reference image → character transformation
- **Result**: TBD
- **Cost**: Est. ~$0.60 (30s test)
- **Takeaway**: TBD

### EXP-004: [Pending] Latency Measurement
- **Date**: TBD
- **Objective**: Measure actual round-trip latency for realtime transformation
- **Model**: `mirage_v2` and `lucy_2_rt`
- **Setup**: Visual latency test (wave hand, measure delay)
- **Result**: TBD
- **Cost**: Est. ~$0.30
- **Takeaway**: TBD
