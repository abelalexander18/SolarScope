-- Create a table for Saved Calculations
create table public.saved_calculations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  
  -- Inputs
  roof_area numeric not null,
  usable_roof_percent numeric not null,
  city text not null,
  state text,
  latitude numeric,
  longitude numeric,
  fetched_irradiance numeric,
  orientation text not null,
  shading text not null,
  electricity_tariff numeric not null,
  installation_cost_per_kw numeric not null,
  panel_efficiency numeric not null,
  performance_ratio numeric not null,
  emission_factor numeric not null,
  
  -- Results (cached for fast dashboard rendering)
  system_size_kw numeric not null,
  annual_generation_kwh numeric not null,
  annual_savings_rs numeric not null,
  payback_period_years numeric not null,
  co2_mitigation_tonnes numeric not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.saved_calculations enable row level security;

create policy "Users can insert their own calculations."
  on public.saved_calculations for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own calculations."
  on public.saved_calculations for select
  using (auth.uid() = user_id);

create policy "Users can delete their own calculations."
  on public.saved_calculations for delete
  using (auth.uid() = user_id);
