import { NavLink, Outlet } from "react-router-dom";
import { Dumbbell, Calendar, Library, LineChart, Home, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/build", label: "Train", icon: Dumbbell, end: false },
  { to: "/plan", label: "Plan", icon: Calendar, end: false },
  { to: "/library", label: "Library", icon: Library, end: false },
  { to: "/progression", label: "Progress", icon: LineChart, end: false }
];

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="safe-top sticky top-0 z-40 border-b border-border-subtle bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
            </span>
            Training Engine
          </NavLink>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink",
                    isActive && "bg-bg-elevated text-ink"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <NavLink
              to="/glossary"
              aria-label="Glossary"
              className={({ isActive }) =>
                cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-elevated hover:text-ink",
                  isActive && "bg-bg-elevated text-ink"
                )
              }
            >
              <BookOpen className="h-5 w-5" />
            </NavLink>
            <NavLink
              to="/profile"
              aria-label="Profile and settings"
              className={({ isActive }) =>
                cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-bg-elevated hover:text-ink",
                  isActive && "bg-bg-elevated text-ink"
                )
              }
            >
              <Settings className="h-5 w-5" />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-4 md:pb-10">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-5xl items-stretch justify-between px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink-faint",
                  isActive && "text-accent"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
