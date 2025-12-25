alert("JS loaded successfully");
async function loadNews() {
  const container = document.getElementById("news");

  // Example: Use a simple free news API call
  const apiKey = "YOUR_FREE_KEY"; // if using API
  const query = "MM2H Malaysia";
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.articles) {
      data.articles.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
        container.appendChild(div);
      });
    }
  } catch (e) {
    container.innerText = "Error loading news";
  }
}

loadNews();
