import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AppointmentPayload {
  owner_id: string
  pet_id: string
  service_id: string
  department_id: 'estetica' | 'saude' | 'educacao' | 'estadia' | 'logistica'
  scheduled_at: string // ISO 8601 format: "2024-01-20T10:00:00"
  employee_id?: string
  notes?: string
  price?: number
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload: AppointmentPayload = await req.json()
    console.log('Received payload:', payload)

    // Validate required fields
    const requiredFields = ['owner_id', 'pet_id', 'service_id', 'department_id', 'scheduled_at']
    const missingFields = requiredFields.filter(field => !payload[field as keyof AppointmentPayload])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields', 
          missing: missingFields,
          expected_payload: {
            owner_id: 'uuid (required)',
            pet_id: 'uuid (required)',
            service_id: 'uuid (required)',
            department_id: 'estetica | saude | educacao | estadia | logistica (required)',
            scheduled_at: 'ISO 8601 datetime, e.g. 2024-01-20T10:00:00 (required)',
            employee_id: 'uuid (optional)',
            notes: 'string (optional)',
            price: 'number (optional, defaults to service price)'
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate department_id
    const validDepartments = ['estetica', 'saude', 'educacao', 'estadia', 'logistica']
    if (!validDepartments.includes(payload.department_id)) {
      console.error('Invalid department_id:', payload.department_id)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid department_id', 
          valid_values: validDepartments 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // If price not provided, get from service
    let price = payload.price
    if (price === undefined) {
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('price')
        .eq('id', payload.service_id)
        .single()

      if (serviceError) {
        console.error('Error fetching service:', serviceError)
        return new Response(
          JSON.stringify({ error: 'Service not found', details: serviceError.message }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      price = service.price
    }

    // Create the appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        owner_id: payload.owner_id,
        pet_id: payload.pet_id,
        service_id: payload.service_id,
        department_id: payload.department_id,
        scheduled_at: payload.scheduled_at,
        employee_id: payload.employee_id || null,
        notes: payload.notes || null,
        price: price,
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create appointment', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Appointment created successfully:', appointment.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Appointment created successfully',
        appointment 
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
