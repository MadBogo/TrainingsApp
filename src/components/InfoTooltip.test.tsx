import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InfoTooltip } from "./InfoTooltip";

function mockPointer(coarse: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("coarse") ? coarse : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  cleanup();
});

describe("InfoTooltip", () => {
  it("has no accessibility violations at rest (fine pointer)", async () => {
    mockPointer(false);
    const { container } = render(
      <TooltipProvider>
        <InfoTooltip term="RPE" definition="Rate of Perceived Exertion, a 1-10 effort scale." />
      </TooltipProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("reveals the definition on keyboard focus (desktop)", async () => {
    mockPointer(false);
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <InfoTooltip term="RPE" definition="Rate of Perceived Exertion, a 1-10 effort scale." />
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: /what does rpe mean/i });
    await user.tab();
    expect(trigger).toHaveFocus();
    expect(await screen.findByText(/rate of perceived exertion/i)).toBeInTheDocument();
  });

  it("dismisses on Escape", async () => {
    mockPointer(false);
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <InfoTooltip term="RPE" definition="Rate of Perceived Exertion, a 1-10 effort scale." />
      </TooltipProvider>
    );

    await user.tab();
    expect(await screen.findByText(/rate of perceived exertion/i)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByText(/rate of perceived exertion/i)).not.toBeInTheDocument();
  });

  it("opens a bottom sheet on tap for touch devices", async () => {
    mockPointer(true);
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <InfoTooltip term="RPE" definition="Rate of Perceived Exertion, a 1-10 effort scale." />
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: /what does rpe mean/i });
    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/rate of perceived exertion/i)).toBeInTheDocument();
  });
});
