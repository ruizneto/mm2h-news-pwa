const apiKey = "1af2f182631aa7a07198b80b60938673";
const query = "MM2H";
const fromDate = new Date();
fromDate.setFullYear(fromDate.getFullYear() - 1);
const from = fromDate.toISOString().split("T")[0]; // YYYY-MM-DD

const container = document.getElementById("news");
container.innerHTML = "Fetching past 1 year of MM2H news...";

async function loadNews() {
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&from=${from}&lang=en&max=100&token=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "No MM2H news found for the past year.";
      return;
    }

    data.articles.forEach(item => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `
        <a href="${item.url}" target="_blank">${item.title}</a><br>
        <small>${new Date(item.publishedAt).toLocaleString()} | ${item.source.name}</small>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "Failed to fetch news. Please check your API key and internet connection.";
  }
}

loadNews();
