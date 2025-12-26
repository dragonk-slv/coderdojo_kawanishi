// 簡易的な開催データ例
const events = [
  { month: "10月", date: "2025-10-12", title: "Scratchであそぼう！" },
  { month: "11月", date: "2025-11-09", title: "Minecraftでプログラミング" },
  { month: "12月", date: "2025-12-07", title: "Webサイトを作ってみよう" }
];

let currentIndex = 0;

const eventInfo = document.getElementById("eventInfo");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const centerBtn = document.getElementById("centerEvent");

function renderEvent() {
  const today = new Date();
  const event = events[currentIndex];

  // ボタンテキスト更新
  centerBtn.textContent = `${event.month}のDojo`;

  const eventDate = new Date(event.date);
  if (eventDate < today) {
    eventInfo.innerHTML = "次回の開催は準備中です。";
    return;
  }

  eventInfo.innerHTML = `
    <strong>${event.title}</strong><br>
    開催日：${eventDate.toLocaleDateString("ja-JP")}
  `;
}

prevBtn.addEventListener("click", () => {
  currentIndex = Math.max(0, currentIndex - 1);
  renderEvent();
});

nextBtn.addEventListener("click", () => {
  currentIndex = Math.min(events.length - 1, currentIndex + 1);
  renderEvent();
});

centerBtn.addEventListener("click", () => {
  window.scrollTo({
    top: document.getElementById("eventInfo").offsetTop - 100,
    behavior: "smooth"
  });
});

renderEvent();
