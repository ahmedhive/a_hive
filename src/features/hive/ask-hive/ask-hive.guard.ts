import { NextResponse } from "next/server";
import { SITE_URL } from "@/data/site";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const MAX_TRACKED_CLIENTS = 5000;

// Best effort per server instance: enough to stop a casual loop from eating
// the free quota, not a hard guarantee on serverless. Oldest clients first,
// so a flood of new addresses can only push out the least recent ones.
const hits = new Map<string, number[]>();

function limited(client: string) {
  const now = Date.now();
  const recent = (hits.get(client) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  recent.push(now);
  hits.delete(client);
  hits.set(client, recent);
  for (const [key, times] of hits) {
    const expired = now - times[times.length - 1] >= RATE_WINDOW_MS;
    if (!expired && hits.size <= MAX_TRACKED_CLIENTS) break;
    hits.delete(key);
  }
  return recent.length > RATE_LIMIT;
}

// One visitor usually controls a whole IPv6 /64, so that is what's counted.
function clientKey(forwardedFor: string | null) {
  const ip = forwardedFor?.split(",")[0].trim().split("%")[0];
  if (!ip) return "unknown";
  if (!ip.includes(":")) return ip;
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return mapped[1];
  const [head, tail] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const gap = tail === undefined ? 0 : 8 - left.length - right.length;
  const groups = [...left, ...Array(Math.max(gap, 0)).fill("0"), ...right];
  const prefix = groups
    .slice(0, 4)
    .map((g) => g.toLowerCase().replace(/^0+(?=.)/, ""));
  return `${prefix.join(":")}::/64`;
}

const hostOf = (url: string) => {
  try {
    return new URL(url).host.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
};

// Stops other websites spending the quota through their visitors' browsers.
// Requests without these headers aren't from a browser page, so they pass
// and meet the rate limit instead.
function isCrossSite(headers: Headers) {
  if (headers.get("sec-fetch-site") === "cross-site") return true;
  const origin = headers.get("origin");
  if (!origin) return false;
  const from = hostOf(origin);
  if (!from) return true;
  const own = [headers.get("x-forwarded-host"), headers.get("host")]
    .flatMap((h) => h?.split(",") ?? [])
    .map((h) => hostOf(`http://${h.trim()}`));
  return from !== hostOf(SITE_URL) && !own.includes(from);
}

// The checks every Hive route runs before it can spend any quota. Each bucket
// has its own limit, so one spoken question doesn't count twice.
export function guardRequest(
  request: Request,
  mediaType: string,
  bucket: string,
): { key: string } | { rejected: NextResponse } {
  const received = request.headers.get("content-type")?.split(";")[0];
  if (received?.trim().toLowerCase() !== mediaType) {
    return {
      rejected: NextResponse.json({ error: "bad_request" }, { status: 415 }),
    };
  }
  if (isCrossSite(request.headers)) {
    return {
      rejected: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      rejected: NextResponse.json({ error: "not_configured" }, { status: 503 }),
    };
  }
  const client = clientKey(request.headers.get("x-forwarded-for"));
  if (limited(`${bucket}:${client}`)) {
    return {
      rejected: NextResponse.json({ error: "rate_limited" }, { status: 429 }),
    };
  }
  return { key };
}
