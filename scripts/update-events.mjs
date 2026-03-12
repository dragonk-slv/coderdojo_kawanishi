import fs from "node:fs/promises";

const API_KEY = process.env.CONNPASS_API_KEY;

// connpass グループ
const GROUP = "coderdojo-takaraduka";

const API_URL = `https://connpass.com/api/v2/events?nickname=${GROUP}&count=20&order=2`;

if (!API_KEY) {
  console.error("CONNPASS_API_KEY が設定されていません。");
  process.exit(1);
}

async function main() {

  const res = await fetch(API_URL, {
    headers: {
      "X-API-Key": API_KEY,
      "User-Agent": "coderdojo-kawanishi-site-updater"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`connpass API error: ${res.status}\n${text}`);
  }

  const json = await res.json();
  const now = new Date();

  const futureEvents = (json.events || [])
    .filter(ev => new Date(ev.started_at) >= now)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .map(ev => ({
      title: ev.title,
      start: ev.started_at,
      end: ev.ended_at,
      place: ev.place || ev.address || "",
      url: ev.event_url
    }));

  await fs.mkdir("./data", { recursive: true });

  await fs.writeFile(
    "./data/events.json",
    JSON.stringify(futureEvents, null, 2),
    "utf-8"
  );

  console.log(`Saved ${futureEvents.length} events`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
