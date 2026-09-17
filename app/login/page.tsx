import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/calculator" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface/50 p-8 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground mb-8">
          <Sparkles className="h-5 w-5 text-primary" />
          SolarScope
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Email Address
            </label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Password
            </label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>

          {resolvedParams?.error && (
            <p className="mt-2 text-xs text-red-500 font-bold">{resolvedParams.error}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button formAction={login} className="w-full" variant="hero">
              Sign In
            </Button>
            <Button formAction={signup} className="w-full" variant="secondary">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
