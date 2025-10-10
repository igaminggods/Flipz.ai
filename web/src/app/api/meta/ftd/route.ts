import { NextRequest } from "next/server";

type FtdParams = {
  afp1?: string | null; // click id used as event_id
  value?: string | null;
  currency?: string | null;
  ts?: string | null; // unix seconds
  event_name?: string | null; // default FTD
  fbp?: string | null;
  fbc?: string | null;
  test_event_code?: string | null;
};

function getParam(req: NextRequest, name: keyof FtdParams): string | undefined {
  const v = req.nextUrl.searchParams.get(name as string);
  if (v !== null) return v;
  try {
    if (req.headers.get("content-type")?.includes("application/json")) {
      // Body may have been parsed by Next; we will re-read via clone in handlers
    }
  } catch {}
  return undefined;
}

async function handle(req: NextRequest) {
  // Read credentials from env by default
  let PIXEL_ID: string | undefined = process.env.META_PIXEL_ID;
  let CAPI_TOKEN: string | undefined = process.env.META_CAPI_TOKEN;

  // Accept both query string and JSON body
  let body: Partial<FtdParams> = {};
  try {
    if (req.headers.get("content-type")?.includes("application/json")) {
      body = await req.json();
    }
  } catch {}

  const qp = (name: keyof FtdParams) => getParam(req, name) ?? (body[name] as string | undefined);

  // Local testing convenience: allow pid/token via query ONLY on localhost and ONLY with a test_event_code
  try {
    const host = req.headers.get('host') || '';
    const isLocalHost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
    const pidFromQuery = req.nextUrl.searchParams.get('pid') || undefined;
    const tokenFromQuery = req.nextUrl.searchParams.get('token') || undefined;
    const testEventCodePresent = Boolean(req.nextUrl.searchParams.get('test_event_code'));
    if ((!PIXEL_ID || !CAPI_TOKEN) && isLocalHost && testEventCodePresent && pidFromQuery && tokenFromQuery) {
      PIXEL_ID = pidFromQuery;
      CAPI_TOKEN = tokenFromQuery;
    }
  } catch {}

  if (!PIXEL_ID || !CAPI_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Server not configured: set META_PIXEL_ID and META_CAPI_TOKEN" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const afp1 = qp("afp1");
  const valueRaw = qp("value");
  const currency = (qp("currency") || "EUR").toUpperCase();
  const tsRaw = qp("ts");
  const eventName = qp("event_name") || "FTD"; // or Purchase
  const fbp = qp("fbp");
  const fbc = qp("fbc");
  const testEventCode = qp("test_event_code");

  if (!afp1) {
    return new Response(JSON.stringify({ error: "Missing required 'afp1' (event_id)" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const eventTime = tsRaw ? Number(tsRaw) : Math.floor(Date.now() / 1000);
  const value = valueRaw !== undefined ? Number(valueRaw) : undefined;

  const userData: Record<string, unknown> = {
    client_user_agent: req.headers.get("user-agent") || undefined,
    client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
  };
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: afp1,
        action_source: "website",
        event_source_url: req.headers.get("referer") || undefined,
        user_data: userData,
        custom_data: {
          currency,
          value,
        },
      },
    ],
  };
  if (testEventCode) payload.test_event_code = testEventCode;

  const url = `https://graph.facebook.com/v18.0/${encodeURIComponent(PIXEL_ID)}/events?access_token=${encodeURIComponent(
    CAPI_TOKEN
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    // Ensure we do not cache on any proxy
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: res.ok, status: res.status, fb: json }), {
    status: res.ok ? 200 : 502,
    headers: { "content-type": "application/json" },
  });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}


