import fs from "node:fs/promises";

const API_KEY = process.env.CONNPASS_API_KEY;
const GROUP = "coderdojo-takaraduka";

const API_URL = `https://connpass.com/api/v1/event/?series_id=&count=20&order=2&keyword=${GROUP}`;

async function main() {

  const res = await fetch(API_URL, {
    headers: {
      "User-Agent": "coderdojo-kawanishi-site-updater/1.0"
    }
  });

  if (!res.ok) {
    throw new Error(`connpass API error: ${res.status}`);
  }

  const json = await res.json();
  const now = new Date();

  const futureEvents = (json.events || [])
    .filter(ev => ev.event_url.includes("coderdojo-takaraduka.connpass.com"))
    .filter(ev => new Date(ev.started_at) >= now)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .map(ev => ({
      title: ev.title,
      start: ev.started_at,
      end: ev.ended_at,
      place: ev.place || "",
      url: ev.event_url
    }));

  await fs.mkdir("./data", { recursive: true });

  await fs.writeFile(
    "./data/events.json",
    JSON.stringify(futureEvents, null, 2)
  );

  console.log(`Saved ${futureEvents.length} future events.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
