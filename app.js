const container = document.getElementById("news");

// Load preloaded news first (offline-ready)
async function loadNews() {
  container.innerHTML = "Loading MM2H news...";

  try {
    const res = await fetch("news.json");
    const news = await res.json();

    // Sort by newest first
    news.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display grouped by month
    displayNews(news);
  } catch (err) {
    console.error("Failed to load news.json", err);
    container.innerHTML = "Failed to load news.";
  }
}

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

// Initial load
loadNews();
