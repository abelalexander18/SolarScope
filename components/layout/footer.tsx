import Link from "next/link";
import { Sun, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/80 backdrop-blur-xs py-12">
      <div className="section-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sun className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-extrabold text-foreground">
              Solar<span className="text-fresh">Scope</span>
            </span>
          </Link>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            Solar Rooftop Potential & ROI Estimator. Empowering clean energy decisions through clear, accessible rooftop analytics.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-xs font-semibold text-muted-foreground" aria-label="Footer navigation">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/calculator" className="hover:text-foreground transition-colors">
            Calculator
          </Link>
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="/methodology" className="hover:text-foreground transition-colors">
            Methodology
          </Link>
        </nav>
      </div>

      <div className="section-shell mt-8 border-t border-line/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-fresh" />
          Planning estimates only. Not a certified solar installation audit.
        </p>
        <p>© {new Date().getFullYear()} SolarScope. All rights reserved.</p>
      </div>
    </footer>
  );
}
