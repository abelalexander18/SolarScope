import Link from 'next/link';
import { Sun } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sun className="h-6 w-6 text-green-600" />
            <span className="hidden font-bold sm:inline-block">SolarScope</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
            <Link href="/calculator" className="transition-colors hover:text-foreground/80 text-foreground/60">Calculator</Link>
            <Link href="/results" className="transition-colors hover:text-foreground/80 text-foreground/60">Results</Link>
            <Link href="/methodology" className="transition-colors hover:text-foreground/80 text-foreground/60">Methodology</Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu could go here */}
          </div>
          <nav className="flex items-center">
            <Link href="/calculator">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Calculate Potential</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
