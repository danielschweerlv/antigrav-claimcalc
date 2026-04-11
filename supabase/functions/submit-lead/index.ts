import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { submitLeadSchema } from "../_shared/schema.ts";
import { calcSettlement } from "../_shared/calc-settlement.ts";
import { mapCaseType, mapFault, isNonNvZip } from "../_shared/mappers.ts";
import { checkAndRecord, hashIp } from "../_shared/rate-limit.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const parsed = submitLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ error: "invalid submission" }, 400);
  }
  const body = parsed.data;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";
  const pepper = Deno.env.get("IP_HASH_PEPPER") ?? "dev-pepper";
  const ipHash = await hashIp(ip, pepper);
  const rl = await checkAndRecord(supabase, ipHash);
  if (!rl.ok) {
    return json({ error: "rate limited", reason: rl.reason }, 429);
  }

  const estimate = calcSettlement({
    caseType: body.caseType,
    injuries: body.injuries,
    fault: body.fault,
    faultAtFault: body.faultAtFault,
    evInvolved: body.evInvolved,
    commercialVehicle: body.commercialVehicle,
    when: body.when,
    otherInsurer: body.otherInsurer,
    cameras: body.cameras,
    witnesses: body.witnesses,
    surface: body.surface,
    lighting: body.lighting,
    onTheJob: body.onTheJob,
  });

  const withAvg = Math.round((estimate.withLow + estimate.withHigh) / 2);
  const withoutAvg = Math.round((estimate.withoutLow + estimate.withoutHigh) / 2);

  const row = {
    case_type: mapCaseType(body.caseType),
    accident_type: body.accidentType ?? null,
    injury_types: body.injuries,
    fault_status: mapFault(body.fault),
    ev_involved: body.evInvolved === "Yes",
    commercial_vehicle: body.commercialVehicle === "Yes",
    rideshare_involved: body.rideshareInvolved === "Yes",
    accident_timeframe: body.when ?? null,
    report_filed: body.reportedTo ?? [],
    cameras_witnesses: body.cameras === "Yes" || body.witnesses === "Yes",
    surface_conditions: body.surface ?? null,
    lighting_conditions: body.lighting ?? null,
    has_own_insurance: body.hasOwnInsurance === "Yes",
    own_insurance_company: body.myInsurer ?? null,
    other_party_insurance: body.otherInsurer ?? null,
    adjuster_contacted: body.adjusterContacted === "Yes",
    has_lawyer: body.hasLawyer === "Yes",
    case_description: body.caseDescription ?? null,
    zip_code: body.zipCode ?? null,
    contact_name: `${body.firstName} ${body.lastName}`,
    contact_email: body.email,
    contact_phone: body.phone,
    estimated_value_low: withoutAvg,
    estimated_value_high: withAvg,
    utm_source: body.utm.source ?? null,
    utm_medium: body.utm.medium ?? null,
    utm_campaign: body.utm.campaign ?? null,
    referrer: body.referrer ?? null,
    notes: isNonNvZip(body.zipCode) ? "non-NV zip" : null,
  };

  const { data: leadRow, error: insertErr } = await supabase
    .from("leads")
    .insert(row)
    .select("id")
    .single();

  if (insertErr || !leadRow) {
    console.error("lead insert failed", insertErr);
    return json({ error: "insert failed" }, 500);
  }

  await supabase.from("lead_activity").insert({
    lead_id: leadRow.id,
    action: "created",
    details: { utm: body.utm, referrer: body.referrer, ip_hash: ipHash },
  });

  // Fire-and-forget email notification — never blocks lead response
  try {
    const notifyUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-new-lead`;
    fetch(notifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        lead_id: leadRow.id,
        contact_name: row.contact_name,
        contact_email: row.contact_email,
        contact_phone: row.contact_phone,
        case_type: row.case_type,
        estimated_value_low: row.estimated_value_low,
        estimated_value_high: row.estimated_value_high,
        zip_code: row.zip_code,
      }),
    }).catch((err) => console.error("notify-new-lead fire-and-forget error:", err));
  } catch (err) {
    console.error("notify-new-lead setup error:", err);
  }

  return json({
    leadId: leadRow.id,
    estimate: {
      withLow: estimate.withLow,
      withHigh: estimate.withHigh,
      withoutLow: estimate.withoutLow,
      withoutHigh: estimate.withoutHigh,
    },
  });
});
