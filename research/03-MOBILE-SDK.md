# Decart AI - Mobile SDK Analysis

> Sources: docs.platform.decart.ai/sdks/swift, /sdks/android | Fetched: 2026-03-23

## iOS (Swift SDK)

### Requirements
- iOS 15.0+ / macOS 12.0+
- Swift 5.9+, Xcode 15.0+
- **Physical device required** (no simulator for camera)

### Installation
```swift
// Package.swift
.package(url: "https://github.com/decartai/decart-ios.git", from: "0.0.2")
```

### Key Features
- WebRTC-based realtime streaming
- Actor-based `RealtimeClient` (thread-safe)
- Combine publishers for state/errors
- SwiftUI support via `UIViewRepresentable` wrapping `RTCMTLVideoView`
- Async/await throughout

### Available Models (iOS)
- `Models.realtime(.mirage_v2)` - Style transfer (25fps, 1280x704)
- `Models.realtime(.lucy_v2v_720p_rt)` - Video editing (legacy)
- Video and Image models also accessible

### Permissions Required
```xml
NSCameraUsageDescription
NSMicrophoneUsageDescription
```

### Reference App
`decart-ios/Examples/RealtimeExample` - camera capture, transformation, prompt updates

---

## Android (Kotlin SDK)

### Requirements
- Android API 24+ (Android 7.0 Nougat)
- Kotlin 2.1+, Java 17
- **Physical device required** (no emulator for camera/WebRTC)

### Installation
```kotlin
// settings.gradle.kts - add JitPack repo
// build.gradle.kts
implementation("com.github.DecartAI:decart-android:0.2.0")
```

### Key Features
- WebRTC-based realtime streaming
- Kotlin Coroutines (async/await)
- StateFlow for connection state, SharedFlow for errors
- Jetpack Compose support via `AndroidView` + `SurfaceViewRenderer`
- EGL context management for video rendering

### Available Models (Android)
- `LUCY_2_RT` - Character transform (25fps, 1280x704)
- `MIRAGE_V2` - Style transfer
- `LIVE_AVATAR` - Avatar animation
- Full batch video model support

### Permissions Required
```xml
INTERNET, CAMERA, RECORD_AUDIO
```

### Security
- Recommends **client tokens** over embedded API keys
- Fetch ephemeral tokens from backend to prevent key exposure in APK

### Reference Apps
- Basic sample in SDK repo (Realtime + Video tabs, Compose)
- Advanced example with 90+ style presets, swipe navigation

---

## Mobile Performance Considerations

| Aspect | iOS | Android |
|--------|-----|---------|
| Min OS | iOS 15 | API 24 (Android 7) |
| Protocol | WebRTC | WebRTC |
| Rendering | Metal (RTCMTLVideoView) | EGL (SurfaceViewRenderer) |
| Concurrency | Swift Actors + async/await | Kotlin Coroutines + Flow |
| UI Framework | SwiftUI compatible | Jetpack Compose compatible |

### Key Observations

1. **Processing is server-side** - phone only handles camera capture + WebRTC stream display
2. **Network dependency** - quality depends on connection speed, not device power
3. **Battery impact** - WebRTC + camera is battery-intensive; needs testing
4. **Latency** - sub-35ms claimed, but mobile network adds variable latency
5. **No offline mode** - all processing requires active connection

### Open Questions (Need Testing)

- [ ] Actual latency on mobile networks (4G vs WiFi)
- [ ] Battery consumption during extended sessions
- [ ] Memory usage during WebRTC streaming
- [ ] Behavior on poor/intermittent connections
- [ ] Camera switching (front/back) during active session
- [ ] Background/foreground transition handling

## Web (React) as Mobile Alternative

Since this project uses React + Vite, a **mobile web app** is also viable:
- `@decartai/sdk` npm package works in mobile browsers
- WebRTC supported in Safari iOS 15+ and Chrome Android
- No app store deployment needed for MVP
- Trade-off: less native camera control, no background processing

**Recommendation for MVP**: Start with web (React) for fastest iteration, then evaluate native SDK if needed.
