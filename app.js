document.getElementById("news").innerHTML = "Loading RSS feed...";

fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.freemalaysiatoday.com/feed/")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("news");
    container.innerHTML = "";

    if (!data.items || data.items.length === 0) {
      container.innerHTML = "RSS loaded but no items found.";
      return;
    }

    data.items.slice(0, 10).forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>
          <strong>${item.title}</strong><br>
          <small>${new Date(item.pubDate).toLocaleString()}</small>
        </p>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById("news").innerHTML = "RSS fetch failed.";
    console.error(err);
  });
