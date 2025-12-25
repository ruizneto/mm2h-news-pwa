const apiKey = "YOUR_GNEWS_API_KEY";
const query = "MM2H";

// Date 1 year ago
const fromDate = new Date();
fromDate.setFullYear(fromDate.getFullYear() - 1);
const from = fromDate.toISOString().split("T")[0];

const container = document.getElementById("news");

// List of official RSS feeds
const rssSources = [
  "https://www.freemalaysiatoday.com/feed/",
  "https://www.malaymail.com/rss",
  "https://www.bernama.com/en/rss.php",
  "https://www.mm2h.gov.my/feed", // example gov feed
  "https://www.imi.gov.my/rss"    // example immigration feed
];

// Fetch GNews articles
async function fetchGNews() {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&from=${from}&lang=en&max=100&token=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.articles) return [];
    return data.articles.map(item => ({
      title: item.title,
      link: item.url,
      date: item.publishedAt,
      source: item.source.name
    }));
  } catch (e) {
    console.error("GNews fetch failed:", e);
    return [];
  }
}

// Fetch RSS articles
async function fetchRSS() {
  const allItems = [];
  for (const rss of rssSources) {
    try {
      const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;
      const res = await fetch(api);
      const data = await res.json();
      if (!data.items) continue;

      data.items.forEach(item => {
        const text = (item.title + " " + item.description).toLowerCase();
        if (text.includes("mm2h") || text.includes("my second home")) {
          allItems.push({
            title: item.title,
            link: item.link,
            date: item.pubDate,
            source: rss
          });
        }
      });
    } catch (e) {
      console.error("RSS fetch failed:", rss, e);
    }
  }
  return allItems;
}

// Group articles by month
function groupByMonth(news) {
  const grouped = {};
  news.forEach(item => {
    const date = new Date(item.date);
    const month = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(item);
  });
  return grouped;
}

// Display news
function displayNews(news) {
  container.innerHTML = "";
  if (news.length === 0) {
    container.innerHTML = "No MM2H news found in the past year.";
    return;
  }

  const grouped = groupByMonth(news);

  for (const month of Object.keys(grouped)) {
    const monthDiv = document.createElement("div");
    monthDiv.className = "month-group";
    monthDiv.innerHTML = `<h2>${month}</h2>`;
    grouped[month].forEach(item => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `
        <a href="${item.link}" target="_blank">${item.title}</a><br>
        <small>${new Date(item.date).toLocaleString()} | ${item.source}</small>
      `;
      monthDiv.appendChild(div);
    });
    container.appendChild(monthDiv);
  }
}

// Load news and store in localStorage
async function loadNews() {
  container.innerHTML = "Fetching latest MM2H news...";

  const gnewsArticles = await fetchGNews();
  const rssArticles = await fetchRSS();
  let news = gnewsArticles.concat(rssArticles);

  // Sort by newest first
  news.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Store in localStorage for offline use
  localStorage.setItem("mm2hNews", JSON.stringify(news));

  displayNews(news);
}

// Load from localStorage first (offline support)
const cached = localStorage.getItem("mm2hNews");
if (cached) {
  displayNews(JSON.parse(cached));
}

// Initial load and auto-refresh every 24 hours
loadNews();
setInterval(loadNews, 24 * 60 * 60 * 1000);
