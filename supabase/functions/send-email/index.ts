import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from "npm:nodemailer"

// ============================================================
//  SECURITY CONFIGURATION
//  V-05 FIX: Restrict CORS to the production domain only.
//  Set ALLOWED_ORIGIN as a Supabase secret:
//    supabase secrets set ALLOWED_ORIGIN=https://tu-dominio.com
// ============================================================
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://gbdhgmwisaejrprmxvie.supabase.co'

const SMTP_HOST = Deno.env.get('SMTP_HOST')
const SMTP_PORT = Deno.env.get('SMTP_PORT')
const SMTP_USER = Deno.env.get('SMTP_USER')
const SMTP_PASS = Deno.env.get('SMTP_PASS')
const SMTP_FROM = Deno.env.get('SMTP_FROM') || SMTP_USER

// Allowed recipient domains / addresses (admin whitelist)
const ADMIN_SMTP_FROM = SMTP_FROM || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,  // No more wildcard '*'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS Preflight request handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ============================================================
    //  AUTHENTICATION CHECK — V-05 FIX
    //  Only authenticated Supabase users can trigger email sends.
    //  This prevents the function from being used as an open mail relay.
    // ============================================================
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing Authorization header.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid session token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ============================================================
    //  REQUEST PARSING & VALIDATION
    // ============================================================
    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Bad Request: Missing required fields (to, subject, html).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate recipient: only allow the authenticated user's own email or the admin email
    const recipient = Array.isArray(to) ? to.join(', ') : to
    const allowedRecipients = [user.email, ADMIN_SMTP_FROM].filter(Boolean)
    const recipientList = Array.isArray(to) ? to : [to]

    const allAllowed = recipientList.every(r =>
      allowedRecipients.includes(r) ||
      r === Deno.env.get('SMTP_FROM')  // Admin address is always allowed
    )

    if (!allAllowed) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Recipient not authorized.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP configuration is missing on the server secrets.")
    }

    // ============================================================
    //  EMAIL SENDING
    // ============================================================
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_PORT === '465',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"Katherine Store" <${SMTP_FROM}>`,
      to: recipient,
      subject: subject,
      html: html,
    })

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
