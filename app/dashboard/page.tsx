import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '../login/actions'
import { ArrowLeft, LogOut, Sun, MapPin, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch saved calculations
  const { data: calculations, error } = await supabase
    .from('saved_calculations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-surface p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="h-4 w-px bg-line" />
          <h1 className="font-display font-extrabold text-foreground">My Workspace</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">{user.email}</span>
          <form action={logout}>
            <button className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <h2 className="font-display text-3xl font-extrabold text-foreground mb-8">Saved Calculations</h2>

        {!calculations || calculations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line p-12 text-center bg-secondary/35">
            <Sun className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-foreground mb-2">No calculations yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Run a solar estimate and save it to see it here.</p>
            <Link href="/" className="inline-block bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
              New Calculation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calc) => (
              <div key={calc.id} className="rounded-3xl border border-line bg-surface p-6 shadow-xs hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-xl font-extrabold text-foreground truncate pr-4">{calc.name}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase bg-secondary px-2 py-1 rounded-full whitespace-nowrap">
                    {new Date(calc.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{calc.city}{calc.state ? `, ${calc.state}` : ''}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary/50 rounded-2xl p-4 border border-line/50">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">System Size</span>
                    <span className="font-display font-extrabold text-foreground flex items-baseline gap-1">
                      {calc.system_size_kw} <span className="text-xs text-muted-foreground">kW</span>
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded-2xl p-4 border border-line/50">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Annual Yield</span>
                    <span className="font-display font-extrabold text-fresh flex items-baseline gap-1">
                      {calc.annual_generation_kwh.toLocaleString()} <span className="text-xs text-muted-foreground">kWh</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line/50">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Est. Savings / Yr</span>
                    <span className="font-bold text-foreground">₹{calc.annual_savings_rs.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payback</span>
                    <span className="font-bold text-foreground">{calc.payback_period_years} yrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
