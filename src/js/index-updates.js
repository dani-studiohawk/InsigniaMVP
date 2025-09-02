// /js/updates.js
(function () {
  const grid = document.getElementById("update-grid");
  if (!grid) return;

  const cfg = window.YT_CONFIG || {};
  const API_KEY = cfg.API_KEY;
  const PLAYLIST_ID = grid.dataset.playlistId;
  const MAX_RESULTS = Number(grid.dataset.max || 6);

  if (!API_KEY || !PLAYLIST_ID) {
    grid.innerHTML = `<p style="color: var(--white); opacity:.8">
      Missing YouTube API key or playlist id.
    </p>`;
    return;
  }

  const fmtUK = iso =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const thumbUrl = vid => `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;

  async function loadPlaylist() {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.search = new URLSearchParams({
      part: "snippet,contentDetails",
      maxResults: String(MAX_RESULTS),
      playlistId: PLAYLIST_ID,
      key: API_KEY
    });

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const items = (data.items || [])
        .map(it => {
          const vId = it.contentDetails && it.contentDetails.videoId;
          const sn = it.snippet || {};
          const title = sn.title || "Untitled video";
          const date = sn.publishedAt || (it.contentDetails && it.contentDetails.videoPublishedAt) || "";
          return vId ? { vId, title, date } : null;
        })
        .filter(Boolean);

      if (!items.length) {
        grid.innerHTML = `<p style="color: var(--white); opacity:.8">No videos found.</p>`;
        return;
      }

      grid.innerHTML = items.map(({ vId, title, date }) => `
        <article class="update-card">
          <a class="card-media" href="https://www.youtube.com/watch?v=${vId}" target="_blank" rel="noopener">
            <img src="${thumbUrl(vId)}" alt="${esc(title)}">
            <span class="yt-badge" aria-hidden="true">▶</span>
          </a>
          <div class="card-body">
            <p class="card-meta">${date ? fmtUK(date) : ""} · Video</p>
            <h3 class="card-title">${esc(title)}</h3>
          </div>
        </article>
      `).join("");

    } catch (err) {
      console.error("YouTube fetch failed:", err);
      const msg = /403|forbidden/i.test(String(err))
        ? "Blocked by referrer rules. Add your dev or live origin in Google Cloud."
        : "Could not load videos.";
      grid.innerHTML = `<p style="color: var(--white); opacity:.8">${esc(msg)}</p>`;
    }
  }

  // `defer` ensures DOM is ready. Run immediately.
  loadPlaylist();
})();