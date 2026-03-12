import fs from "node:fs/promises";

const API_KEY = process.env.CONNPASS_API_KEY;
const SERIES_ID = process.env.CONNPASS_SERIES_ID;

if (!API_KEY) {
  console.error("CONNPASS_API_KEY が設定されていません。");
  process.exit(1);
}

if (!SERIES_ID) {
  console.error("CONNPASS_SERIES_ID が設定されていません。");
  process.exit(1);
}

// v1 APIに変更
const API_URL = `https://connpass.com/api/v1/event/?series_id=${SERIES_ID}&count=20&order=2`;

async function main() {
  const res = await fetch(API_URL, {
    headers: {
      "X-API-Key": API_KEY,
      "User-Agent": "coderdojo-kawanishi-site-updater/1.0"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`connpass API error: ${res.status}\n${text}`);
  }

  const json = await res.json();

  console.log("SERIES_ID:", SERIES_ID);
  console.log("API_URL:", API_URL);
  console.log("raw events count:", (json.events || []).length);
  console.log("first raw event:", JSON.stringify(json.events?.[0] || {}, null, 2));

  const now = new Date();

  const futureEvents = (json.events || [])
    .filter(ev => ev.started_at && new Date(ev.started_at) >= now)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .map(ev => ({
      title: ev.title,
      start: ev.started_at,
      end: ev.ended_at,
      place: ev.place || ev.address || "",
      url: ev.event_url
    }));

  console.log("future events count:", futureEvents.length);

  await fs.mkdir("./data", { recursive: true });
  await fs.writeFile(
    "./data/events.json",
    JSON.stringify(futureEvents, null, 2),
    "utf-8"
  );

  console.log(`Saved ${futureEvents.length} future event(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
