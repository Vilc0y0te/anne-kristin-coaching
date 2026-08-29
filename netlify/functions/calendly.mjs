// Bridge: Calendly API -> Operations Desk (ops.html)
// Requires two environment variables set in Netlify (Site configuration -> Environment variables):
//   CALENDLY_TOKEN  - a Calendly personal access token (calendly.com -> Integrations & apps -> API & webhooks)
//   OPS_KEY         - any passphrase you invent; the Desk sends the same one to authenticate
// After adding them, trigger a redeploy so the function picks them up.

export default async (req) => {
  const auth = req.headers.get('authorization') || '';
  if (!process.env.OPS_KEY || auth !== 'Bearer ' + process.env.OPS_KEY) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  const token = process.env.CALENDLY_TOKEN;
  if (!token) {
    return Response.json({ error: 'CALENDLY_TOKEN env var not set in Netlify' }, { status: 500 });
  }
  const h = { Authorization: 'Bearer ' + token };

  try {
    const meRes = await fetch('https://api.calendly.com/users/me', { headers: h });
    if (!meRes.ok) return Response.json({ error: 'Calendly auth failed (' + meRes.status + ')' }, { status: 502 });
    const me = await meRes.json();
    const userUri = me.resource.uri;

    const minStart = new Date(Date.now() - 30 * 864e5).toISOString();
    const evRes = await fetch(
      'https://api.calendly.com/scheduled_events?user=' + encodeURIComponent(userUri) +
      '&min_start_time=' + encodeURIComponent(minStart) + '&count=50&sort=start_time:desc',
      { headers: h }
    );
    const evJson = await evRes.json();
    const events = evJson.collection || [];

    const bookings = [];
    for (const ev of events) {
      const uuid = ev.uri.split('/').pop();
      const invRes = await fetch('https://api.calendly.com/scheduled_events/' + uuid + '/invitees?count=10', { headers: h });
      const invJson = await invRes.json();
      for (const inv of (invJson.collection || [])) {
        bookings.push({
          id: 'cal-' + inv.uri.split('/').pop(),
          name: inv.name || '',
          email: (inv.email || '').toLowerCase(),
          created_at: inv.created_at,
          start_time: ev.start_time,
          event_status: ev.status,          // 'active' | 'canceled'
          invitee_status: inv.status        // 'active' | 'canceled'
        });
      }
    }
    return Response.json({ bookings });
  } catch (e) {
    return Response.json({ error: String(e && e.message || e) }, { status: 500 });
  }
};
