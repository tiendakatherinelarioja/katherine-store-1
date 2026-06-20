import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer"

const SMTP_HOST = Deno.env.get('SMTP_HOST')
const SMTP_PORT = Deno.env.get('SMTP_PORT')
const SMTP_USER = Deno.env.get('SMTP_USER')
const SMTP_PASS = Deno.env.get('SMTP_PASS')
const SMTP_FROM = Deno.env.get('SMTP_FROM') || SMTP_USER

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS Preflight request handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json()

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP configuration is missing on the server secrets.")
    }

    // Nodemailer SMTP Transport
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_PORT === '465', // true for 465, false for 587 or other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `"Katherine Store" <${SMTP_FROM}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
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
