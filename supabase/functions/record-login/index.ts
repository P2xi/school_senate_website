import { withSupabase } from 'npm:@supabase/server@1'

const classifyDevice = (userAgent: string) => {
  if (/bot|crawler|spider|headless/i.test(userAgent)) return 'bot'
  if (/ipad|tablet/i.test(userAgent)) return 'tablet'
  if (/mobile|iphone|android/i.test(userAgent)) return 'mobile'
  if (userAgent) return 'desktop'
  return 'unknown'
}

const detectBrowser = (userAgent: string) => {
  if (/Edg\//i.test(userAgent)) return 'Edge'
  if (/Firefox\//i.test(userAgent)) return 'Firefox'
  if (/CriOS|Chrome\//i.test(userAgent)) return 'Chrome'
  if (/Safari\//i.test(userAgent) && !/Chrome|Chromium/i.test(userAgent)) return 'Safari'
  return 'Other'
}

const detectOperatingSystem = (userAgent: string) => {
  if (/Windows/i.test(userAgent)) return 'Windows'
  if (/Android/i.test(userAgent)) return 'Android'
  if (/iPhone|iPad|iOS/i.test(userAgent)) return 'iOS'
  if (/Mac OS|Macintosh/i.test(userAgent)) return 'macOS'
  if (/Linux/i.test(userAgent)) return 'Linux'
  return 'Other'
}

const getClientIp = (req: Request) =>
  req.headers.get('cf-connecting-ip')
  ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  ?? req.headers.get('x-real-ip')
  ?? null

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method !== 'POST' || !ctx.userClaims?.sub || !ctx.userClaims.email) {
      return Response.json({ error: 'Unauthorized' }, {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 1024)
    const ipAddress = getClientIp(req)
    const countryCode = req.headers.get('cf-ipcountry')?.toUpperCase() ?? null
    const sessionId = String(ctx.jwtClaims?.session_id ?? '')

    if (!sessionId) {
      return Response.json({ error: 'Session identifier missing' }, {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const { data: previousEvent } = await ctx.supabaseAdmin
      .from('login_events')
      .select('ip_address, country_code')
      .eq('user_id', ctx.userClaims.sub)
      .neq('session_id', sessionId)
      .order('last_seen_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const riskFlags: string[] = []
    if (previousEvent?.ip_address && ipAddress && previousEvent.ip_address !== ipAddress) riskFlags.push('new_ip')
    if (previousEvent?.country_code && countryCode && previousEvent.country_code !== countryCode) riskFlags.push('country_changed')

    const { error } = await ctx.supabaseAdmin
      .from('login_events')
      .upsert({
        user_id: ctx.userClaims.sub,
        email: String(ctx.userClaims.email).toLowerCase(),
        session_id: sessionId,
        ip_address: ipAddress,
        country_code: countryCode,
        user_agent: userAgent || null,
        device_type: classifyDevice(userAgent),
        browser_name: detectBrowser(userAgent),
        operating_system: detectOperatingSystem(userAgent),
        auth_provider: String(ctx.jwtClaims?.app_metadata?.provider ?? 'email'),
        assurance_level: String(ctx.jwtClaims?.aal ?? 'aal1'),
        risk_flags: riskFlags,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: 'user_id,session_id' })

    if (error) {
      console.error('login_event_write_failed', { code: error.code })
      return Response.json({ error: 'Audit event could not be stored' }, {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    return Response.json({ ok: true }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    })
  }),
}
