"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createClient } from "@/utils/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculator" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/methodology", label: "Methodology" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/70 bg-background/80 shadow-nav backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sun className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-xl font-extrabold text-foreground">
            Solar<span className="text-fresh">Scope</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary hover:text-foreground",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              My Workspace
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
          )}
          <Button asChild variant="hero">
            <Link href="/calculator">
              Calculate Now <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Button
          aria-label={open ? "Close menu" : "Open menu"}
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-line bg-background/95 transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-5" aria-label="Mobile navigation">
          {links.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 font-semibold transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              My Workspace
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          )}
          <Button asChild variant="hero" className="mt-3">
            <Link href="/calculator" onClick={() => setOpen(false)}>
              Calculate Now <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
