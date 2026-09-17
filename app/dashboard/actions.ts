'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveCalculation(data: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to save.' }
  }

  const { error } = await supabase.from('saved_calculations').insert([
    {
      user_id: user.id,
      name: `Calculation - ${data.city} (${data.systemSizeKw}kW)`,
      ...data,
    },
  ])

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
