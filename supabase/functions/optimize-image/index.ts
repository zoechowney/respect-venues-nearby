import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const TINYPNG_API_KEY = Deno.env.get('TINYPNG_API_KEY')
    if (!TINYPNG_API_KEY) {
      throw new Error('TINYPNG_API_KEY is not set')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucketName = formData.get('bucket') as string || 'sponsor-logos'
    const fileName = formData.get('fileName') as string || file.name

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log(`Processing image: ${fileName}, size: ${file.size} bytes`)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Only JPEG, PNG, and WebP are allowed.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Convert file to ArrayBuffer for TinyPNG
    const fileBuffer = await file.arrayBuffer()

    // Compress image using TinyPNG
    console.log('Compressing image with TinyPNG...')
    const compressResponse = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
        'Content-Type': 'application/octet-stream',
      },
      body: fileBuffer,
    })

    if (!compressResponse.ok) {
      const errorText = await compressResponse.text()
      console.error('TinyPNG compression failed:', errorText)
      
      // If compression fails, upload original file
      console.log('Uploading original file as fallback...')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      return new Response(
        JSON.stringify({ 
          url: publicUrl,
          compressed: false,
          originalSize: file.size,
          finalSize: file.size,
          message: 'Compression failed, uploaded original file'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the compressed image URL from TinyPNG response
    const compressResult = await compressResponse.json()
    const compressedImageUrl = compressResult.output.url

    // Download the compressed image
    const compressedResponse = await fetch(compressedImageUrl, {
      headers: {
        'Authorization': `Basic ${btoa(`api:${TINYPNG_API_KEY}`)}`,
      },
    })

    if (!compressedResponse.ok) {
      throw new Error('Failed to download compressed image')
    }

    const compressedBuffer = await compressedResponse.arrayBuffer()
    const compressionRatio = ((file.size - compressedBuffer.byteLength) / file.size * 100).toFixed(1)
    
    console.log(`Compression successful: ${file.size} bytes -> ${compressedBuffer.byteLength} bytes (${compressionRatio}% reduction)`)

    // Upload compressed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, compressedBuffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    console.log(`Image uploaded successfully: ${publicUrl}`)

    return new Response(
      JSON.stringify({
        url: publicUrl,
        compressed: true,
        originalSize: file.size,
        finalSize: compressedBuffer.byteLength,
        compressionRatio: `${compressionRatio}%`,
        savings: `${(file.size - compressedBuffer.byteLength / 1024).toFixed(1)} KB`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in optimize-image function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Image optimization failed',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})