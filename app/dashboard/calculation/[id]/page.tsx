import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ResultsDashboard } from '@/components/solar/ResultsDashboard'
import { computeSolarPotential } from '@/data/mockSolarResult'
import type { SolarCalculatorInput } from '@/data/mockSolarResult'

export default async function DetailedCalculationPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: calc, error } = await supabase
    .from('saved_calculations')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !calc) {
    return redirect('/dashboard')
  }

  // Reconstruct input to feed back into the calculation engine
  const input: SolarCalculatorInput = {
    roofArea: calc.roof_area,
    usableRoofPercent: calc.usable_roof_percent,
    country: "India",
    state: calc.state || "",
    city: calc.city,
    orientation: calc.orientation as any,
    shading: calc.shading as any,
    electricityTariff: calc.electricity_tariff,
    installationCostPerKw: calc.installation_cost_per_kw,
    panelEfficiency: calc.panel_efficiency,
    performanceRatio: calc.performance_ratio,
    emissionFactor: calc.emission_factor,
    latitude: calc.latitude,
    longitude: calc.longitude,
    fetchedIrradiance: calc.fetched_irradiance,
  }

  const result = computeSolarPotential(input)

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Workspace
        </Link>
        <h1 className="font-display text-3xl font-extrabold text-foreground mb-2">{calc.name}</h1>
        <p className="text-sm text-muted-foreground">Saved on {new Date(calc.created_at).toLocaleString()}</p>
      </div>

      <div className="mt-[-2rem]">
        <ResultsDashboard result={result} />
      </div>
    </div>
  )
}
