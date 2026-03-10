import fs from "node:fs/promises";

const CONNPASS_API_URL =
  "https://connpass.com/api/v1/event/?series_id=3920&count=20&order=2";
// ↑ series_id は実際のグループIDに置き換えてください

async function main() {
  const res = await fetch(CONNPASS_API_URL, {
    headers: {
      "User-Agent": "CoderDojo-Kawanishi-Website/1.0"
    }
  });

  if (!res.ok) {
    throw new Error(`connpass API request failed: ${res.status}`);
  }

  const data = await res.json();
  const now = new Date();

  const futureEvents = (data.events || [])
    .filter(ev => new Date(ev.started_at) >= now)
    .sort((a, b) => new Date(a.started_at) - new Date(b.started_at))
    .map(ev => ({
      title: ev.title,
      start: ev.started_at,
      place: ev.place || ev.address || "",
      url: ev.event_url
    }));

  await fs.mkdir("./data", { recursive: true });
  await fs.writeFile(
    "./data/events.json",
    JSON.stringify(futureEvents, null, 2),
    "utf-8"
  );

  console.log(`Saved ${futureEvents.length} future events.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
