const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface LeadPayload {
  lead_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  case_type: string;
  estimated_value_low: number | null;
  estimated_value_high: number | null;
  zip_code: string | null;
}

function formatCaseType(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCurrency(val: number | null): string {
  if (val == null) return "N/A";
  return "$" + val.toLocaleString("en-US");
}

function buildHtml(lead: LeadPayload): string {
  const adminUrl = `https://www.claimcalculator.ai/admin/leads/${lead.lead_id}`;
  const caseType = formatCaseType(lead.case_type);
  const estimate =
    lead.estimated_value_low != null && lead.estimated_value_high != null
      ? `${formatCurrency(lead.estimated_value_low)} – ${formatCurrency(lead.estimated_value_high)}`
      : "N/A";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#111318;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="background:#1e2024;border-radius:12px;padding:32px;border:1px solid #333539;">
      <h1 style="color:#a4e6ff;font-size:20px;margin:0 0 4px 0;">New Lead Submitted</h1>
      <p style="color:#bbc9cf;font-size:13px;margin:0 0 24px 0;">${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT</p>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#bbc9cf;font-size:13px;padding:8px 0;vertical-align:top;width:120px;">Name</td>
          <td style="color:#e2e2e8;font-size:14px;padding:8px 0;">${lead.contact_name}</td>
        </tr>
        <tr>
          <td style="color:#bbc9cf;font-size:13px;padding:8px 0;vertical-align:top;">Email</td>
          <td style="color:#e2e2e8;font-size:14px;padding:8px 0;">
            <a href="mailto:${lead.contact_email}" style="color:#a4e6ff;text-decoration:none;">${lead.contact_email}</a>
          </td>
        </tr>
        ${lead.contact_phone ? `
        <tr>
          <td style="color:#bbc9cf;font-size:13px;padding:8px 0;vertical-align:top;">Phone</td>
          <td style="color:#e2e2e8;font-size:14px;padding:8px 0;">
            <a href="tel:${lead.contact_phone}" style="color:#a4e6ff;text-decoration:none;">${lead.contact_phone}</a>
          </td>
        </tr>` : ""}
        <tr>
          <td style="color:#bbc9cf;font-size:13px;padding:8px 0;vertical-align:top;">Case Type</td>
          <td style="color:#e2e2e8;font-size:14px;padding:8px 0;">${caseType}</td>
        </tr>
        <tr>
          <td style="color:#bbc9cf;font-size:13px;padding:8px 0;vertical-align:top;">Estimate</td>
          <td style="color:#a4e6ff;font-size:16px;font-weight:bold;padding:8px 0;">${estimate}</td>
        </tr>
        ${lead.zip_code ? `
        <tr>
          <td style="color:#bbc9cf;font-size:13px;padding:8px 0;vertical-align:top;">ZIP</td>
          <td style="color:#e2e2e8;font-size:14px;padding:8px 0;">${lead.zip_code}</td>
        </tr>` : ""}
      </table>

      <div style="margin-top:24px;">
        <a href="${adminUrl}"
           style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#a4e6ff,#00d1ff);color:#111318;font-weight:bold;border-radius:8px;text-decoration:none;font-size:14px;">
          View Lead in Dashboard
        </a>
      </div>
    </div>
    <p style="color:#666;font-size:11px;text-align:center;margin-top:16px;">ClaimCalculator.ai Admin Notification</p>
  </div>
</body>
</html>`.trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return new Response(JSON.stringify({ error: "config error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }

  let lead: LeadPayload;
  try {
    lead = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }

  const caseType = formatCaseType(lead.case_type);
  const subject = `New Lead: ${lead.contact_name} — ${caseType}`;
  const html = buildHtml(lead);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ClaimCalculator <onboarding@resend.dev>",
        to: ["danielschweer@gmail.com"],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend API error:", res.status, body);
      return new Response(JSON.stringify({ error: "email send failed" }), {
        status: 502,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    const result = await res.json();
    console.log("Email sent:", result.id);

    return new Response(JSON.stringify({ ok: true, email_id: result.id }), {
      status: 200,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(JSON.stringify({ error: "email send failed" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }
});
