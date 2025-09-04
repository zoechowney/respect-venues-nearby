import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const MAPBOX_ACCESS_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('MAPBOX_ACCESS_TOKEN environment variable is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox access token not configured',
          popularCities: getPopularCities() 
        }),
        { 
          status: 200, // Return popular cities as fallback
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const { query } = await req.json()
    
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ results: getPopularCities() }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // For short queries, return filtered popular cities
    if (query.length < 4) {
      const filtered = getPopularCities().filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      )
      return new Response(
        JSON.stringify({ results: filtered }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Use Mapbox geocoding for longer queries
    const encodedQuery = encodeURIComponent(query)
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?country=GB&access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`
    
    const response = await fetch(geocodeUrl)
    
    if (!response.ok) {
      console.error('Mapbox API error:', response.status, response.statusText)
      // Return popular cities as fallback
      return new Response(
        JSON.stringify({ 
          results: getPopularCities(),
          fallback: true 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
    
    const data = await response.json()
    
    const results = data.features.map((feature: any) => ({
      name: feature.place_name,
      coordinates: {
        latitude: feature.center[1],
        longitude: feature.center[0],
      },
      address: feature.place_name,
      postcode: feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text,
      city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
      region: feature.context?.find((c: any) => c.id.startsWith('region'))?.text,
    }))
    
    return new Response(
      JSON.stringify({ results }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Geocoding error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to geocode location',
        results: getPopularCities() // Fallback to popular cities
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

function getPopularCities() {
  return [
    {
      name: 'London',
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
      address: 'London, England, United Kingdom',
      city: 'London',
      region: 'England'
    },
    {
      name: 'Manchester', 
      coordinates: { latitude: 53.4808, longitude: -2.2426 },
      address: 'Manchester, England, United Kingdom',
      city: 'Manchester',
      region: 'England'
    },
    {
      name: 'Birmingham',
      coordinates: { latitude: 52.4862, longitude: -1.8904 },
      address: 'Birmingham, England, United Kingdom', 
      city: 'Birmingham',
      region: 'England'
    },
    {
      name: 'Leeds',
      coordinates: { latitude: 53.8008, longitude: -1.5491 },
      address: 'Leeds, England, United Kingdom',
      city: 'Leeds', 
      region: 'England'
    },
    {
      name: 'Glasgow',
      coordinates: { latitude: 55.8642, longitude: -4.2518 },
      address: 'Glasgow, Scotland, United Kingdom',
      city: 'Glasgow',
      region: 'Scotland'
    },
    {
      name: 'Edinburgh',
      coordinates: { latitude: 55.9533, longitude: -3.1883 },
      address: 'Edinburgh, Scotland, United Kingdom',
      city: 'Edinburgh',
      region: 'Scotland'
    },
    {
      name: 'Cardiff',
      coordinates: { latitude: 51.4816, longitude: -3.1791 },
      address: 'Cardiff, Wales, United Kingdom',
      city: 'Cardiff',
      region: 'Wales'
    },
    {
      name: 'Belfast',
      coordinates: { latitude: 54.5973, longitude: -5.9301 },
      address: 'Belfast, Northern Ireland, United Kingdom',
      city: 'Belfast',
      region: 'Northern Ireland'
    },
    {
      name: 'Liverpool',
      coordinates: { latitude: 53.4084, longitude: -2.9916 },
      address: 'Liverpool, England, United Kingdom',
      city: 'Liverpool',
      region: 'England'
    },
    {
      name: 'Sheffield',
      coordinates: { latitude: 53.3811, longitude: -1.4701 },
      address: 'Sheffield, England, United Kingdom',
      city: 'Sheffield',
      region: 'England'
    }
  ]
}