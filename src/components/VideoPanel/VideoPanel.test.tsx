import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VideoPanel } from "./VideoPanel";

describe("VideoPanel", () => {
  it("renders label text", () => {
    render(<VideoPanel stream={null} label="you" />);
    expect(screen.getByText("you")).toBeInTheDocument();
  });

  it("shows placeholder text when no stream", () => {
    render(<VideoPanel stream={null} label="ai" placeholderText="waiting" />);
    expect(screen.getByText("waiting")).toBeInTheDocument();
  });

  it("shows default placeholder when no stream and no custom text", () => {
    render(<VideoPanel stream={null} label="ai" />);
    expect(screen.getByText("offline")).toBeInTheDocument();
  });

  it("shows error text when provided", () => {
    render(
      <VideoPanel stream={null} label="you" errorText="Camera denied" />
    );
    expect(screen.getByText("Camera denied")).toBeInTheDocument();
  });

  it("shows 'connecting...' when status is connecting and no stream", () => {
    render(<VideoPanel stream={null} label="ai" status="connecting" />);
    expect(screen.getByText("connecting...")).toBeInTheDocument();
  });

  it("renders video element when stream is provided", () => {
    // jsdom doesn't have MediaStream — use a minimal mock
    const stream = { getTracks: () => [] } as unknown as MediaStream;
    render(<VideoPanel stream={stream} label="you" muted />);
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("autoplay");
  });

  it("renders status dot when status prop provided", () => {
    render(<VideoPanel stream={null} label="ai" status="connected" />);
    // Dot should exist (we check by the container structure)
    const dots = document.querySelectorAll("[class*='dot']");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("does not render status dot when no status prop", () => {
    render(<VideoPanel stream={null} label="you" />);
    const dotContainer = document.querySelector("[class*='statusDot']");
    expect(dotContainer).not.toBeInTheDocument();
  });

  it("applies className prop", () => {
    const { container } = render(
      <VideoPanel stream={null} label="you" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("prioritizes error text over placeholder", () => {
    render(
      <VideoPanel
        stream={null}
        label="you"
        placeholderText="camera off"
        errorText="No camera"
      />
    );
    expect(screen.getByText("No camera")).toBeInTheDocument();
    expect(screen.queryByText("camera off")).not.toBeInTheDocument();
  });
});
