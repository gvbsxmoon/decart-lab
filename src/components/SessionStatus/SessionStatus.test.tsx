import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SessionStatus } from "./SessionStatus";

describe("SessionStatus", () => {
  const defaultProps = {
    sessionState: "idle" as const,
    seconds: 0,
    cost: 0,
    error: null,
    onStop: vi.fn(),
  };

  it("renders nothing when idle", () => {
    const { container } = render(<SessionStatus {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows 'connecting' text when connecting", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connecting" />
    );
    expect(screen.getByText("connecting")).toBeInTheDocument();
  });

  it("shows formatted time when connected", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connected" seconds={45} cost={0.9} />
    );
    expect(screen.getByText("45s")).toBeInTheDocument();
  });

  it("formats time with minutes", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connected" seconds={125} cost={2.5} />
    );
    expect(screen.getByText("2m 5s")).toBeInTheDocument();
  });

  it("shows formatted cost", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connected" seconds={30} cost={0.6} />
    );
    expect(screen.getByText("$0.60")).toBeInTheDocument();
  });

  it("shows stop button when connected", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connected" />
    );
    expect(screen.getByRole("button", { name: "stop" })).toBeInTheDocument();
  });

  it("shows stop button when connecting", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connecting" />
    );
    expect(screen.getByRole("button", { name: "stop" })).toBeInTheDocument();
  });

  it("calls onStop when stop button clicked", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(
      <SessionStatus {...defaultProps} sessionState="connected" onStop={onStop} />
    );

    await user.click(screen.getByRole("button", { name: "stop" }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("shows error message in error state", () => {
    render(
      <SessionStatus
        {...defaultProps}
        sessionState="error"
        error="Connection failed"
      />
    );
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });

  it("does not show stop button in error state", () => {
    render(
      <SessionStatus
        {...defaultProps}
        sessionState="error"
        error="Connection failed"
      />
    );
    expect(screen.queryByRole("button", { name: "stop" })).not.toBeInTheDocument();
  });

  it("shows $0.00 when cost is zero", () => {
    render(
      <SessionStatus {...defaultProps} sessionState="connected" cost={0} />
    );
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
