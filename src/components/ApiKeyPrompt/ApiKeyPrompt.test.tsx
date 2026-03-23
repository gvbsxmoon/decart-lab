import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ApiKeyPrompt } from "./ApiKeyPrompt";

describe("ApiKeyPrompt", () => {
  it("renders title and input", () => {
    render(<ApiKeyPrompt onSubmit={vi.fn()} />);
    expect(screen.getByText("decart lab")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sk-...")).toBeInTheDocument();
  });

  it("disables Connect button when input is empty", () => {
    render(<ApiKeyPrompt onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Connect" })).toBeDisabled();
  });

  it("enables Connect button when key is entered", async () => {
    const user = userEvent.setup();
    render(<ApiKeyPrompt onSubmit={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("sk-..."), "sk-test123");
    expect(screen.getByRole("button", { name: "Connect" })).toBeEnabled();
  });

  it("shows error for invalid key prefix", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ApiKeyPrompt onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("sk-..."), "bad-key");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    expect(screen.getByText(/Key should start with/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with valid sk- key", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ApiKeyPrompt onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("sk-..."), "sk-mykey123");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    expect(onSubmit).toHaveBeenCalledWith("sk-mykey123");
  });

  it("calls onSubmit with valid ek_ key", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ApiKeyPrompt onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("sk-..."), "ek_token456");
    await user.click(screen.getByRole("button", { name: "Connect" }));

    expect(onSubmit).toHaveBeenCalledWith("ek_token456");
  });

  it("submits on Enter key", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ApiKeyPrompt onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("sk-...");
    await user.type(input, "sk-enterkey{Enter}");

    expect(onSubmit).toHaveBeenCalledWith("sk-enterkey");
  });

  it("clears error when user types again", async () => {
    const user = userEvent.setup();
    render(<ApiKeyPrompt onSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText("sk-...");
    await user.type(input, "bad");
    await user.click(screen.getByRole("button", { name: "Connect" }));
    expect(screen.getByText(/Key should start with/)).toBeInTheDocument();

    await user.type(input, "x");
    expect(screen.queryByText(/Key should start with/)).not.toBeInTheDocument();
  });

  it("links to platform.decart.ai", () => {
    render(<ApiKeyPrompt onSubmit={vi.fn()} />);
    const link = screen.getByText("platform.decart.ai");
    expect(link).toHaveAttribute("href", "https://platform.decart.ai");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
