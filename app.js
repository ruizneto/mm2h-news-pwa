const sources = [
  "https://www.freemalaysiatoday.com/feed/",
  "https://www.malaymail.com/rss",
  "https://www.bernama.com/en/rss.php"
];

const keywords = ["mm2h", "my second home", "malaysia my second home"];

document.getElementById("news").innerHTML = "Scanning Malaysian news for MM2H...";

async function loadAll() {
  const container = document.getElementById("news");
  container.innerHTML = "";

  let found = false;

  for (const rss of sources) {
    try {
      const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;
      const res = await fetch(api);
      const data = await res.json();

      data.items.forEach(item => {
        const text = (item.title + " " + item.description).toLowerCase();
        if (keywords.some(k => text.includes(k))) {
          found = true;
          const div = document.createElement("div");
          div.innerHTML = `
            <p>
              <a href="${item.link}" target="_blank">
                <strong>${item.title}</strong>
              </a><br>
              <small>${new Date(item.pubDate).toLocaleString()}</small>
            </p>
          `;
          container.appendChild(div);
        }
      });
    } catch (e) {
      console.error("RSS failed:", rss, e);
    }
  }

  if (!found) {
    container.innerHTML = "No MM2H-related news found yet. The app will update automatically.";
  }
}

loadAll();
