(function () {
  const cfg = window.YT_CONFIG || {};
  const API_KEY = cfg.API_KEY;
  if (!API_KEY) return;

  const fmtUK = iso => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  const thumbUrl = vid => `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;

  // ---------- PLAYLIST → CAROUSEL ----------
  async function loadPlaylistCarousel(track) {
    const PLAYLIST_ID = track.dataset.playlistId;
    const MAX_RESULTS = Number(track.dataset.max || 12);

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

      const items = (data.items || []).map(it => {
        const vId = it.contentDetails?.videoId;
        const sn = it.snippet || {};
        return vId ? { vId, title: sn.title || "Untitled video", date: sn.publishedAt || it.contentDetails.videoPublishedAt || "" } : null;
      }).filter(Boolean);

      if (!items.length) {
        track.innerHTML = `<p style="color:var(--white);opacity:.8">No videos found.</p>`;
        return;
      }

      track.innerHTML = items.map(({ vId, title, date }) => `
        <article class="update-card">
          <a class="card-media" href="https://www.youtube.com/watch?v=${vId}" target="_blank" rel="noopener">
            <img src="${thumbUrl(vId)}" alt="${esc(title)}">
          </a>
          <div class="card-body">
            <p class="card-meta">${date ? fmtUK(date) : ""} · Video</p>
            <h3 class="card-title">${esc(title)}</h3>
          </div>
        </article>
      `).join("");

      // Hook arrows
      const host = track.closest(".carousel");
      const prev = host.querySelector(".car-btn.prev");
      const next = host.querySelector(".car-btn.next");

      const step = () => {
        // one card width plus gap
        const card = track.querySelector(".update-card");
        if (!card) return 300;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || 0);
        return card.getBoundingClientRect().width + gap;
      };

      const sync = () => {
        const max = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= max;
      };

      prev.addEventListener("click", () => {
        track.scrollBy({ left: -step(), behavior: "smooth" });
      });
      next.addEventListener("click", () => {
        track.scrollBy({ left: step(), behavior: "smooth" });
      });
      track.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      sync();

    } catch (e) {
      console.error("Playlist carousel failed:", e);
      track.innerHTML = `<p style="color:var(--white);opacity:.8">Could not load videos.</p>`;
    }
  }

  // ---------- LATEST LIVE remains as you have ----------
  async function loadLatestLive(grid) {
    const handle = grid.dataset.channelHandle;
    const fallback = grid.dataset.fallback;

    try {
      const chanRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${API_KEY}`);
      const chanData = await chanRes.json();
      const channelId = chanData.items?.[0]?.id?.channelId;
      if (!channelId) throw new Error("Channel not found");

      let vidId = null, title = "", date = "", isLive = false;

      let res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&maxResults=1&key=${API_KEY}`);
      let data = await res.json();
      if (data.items?.length) {
        const v = data.items[0];
        vidId = v.id.videoId; title = v.snippet.title; date = v.snippet.publishedAt; isLive = true;
      }

      if (!vidId && fallback === "upload") {
        res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1&key=${API_KEY}`);
        data = await res.json();
        if (data.items?.length) {
          const v = data.items[0];
          vidId = v.id.videoId; title = v.snippet.title; date = v.snippet.publishedAt;
        }
      }

      if (!vidId) {
        grid.innerHTML = `<p style="color:var(--white);opacity:.8">No livestreams or uploads found.</p>`;
        return;
      }

      grid.innerHTML = `
        <article class="update-card ${isLive ? "is-live" : ""}">
          <a class="card-media" href="https://www.youtube.com/watch?v=${vidId}" target="_blank" rel="noopener">
            <img src="${thumbUrl(vidId)}" alt="${esc(title)}">
          </a>
          <div class="card-body">
            <p class="card-meta">${isLive ? "Live now · YouTube" : fmtUK(date) + " · YouTube"}</p>
            <h3 class="card-title">${esc(title)}</h3>
          </div>
        </article>`;
    } catch (err) {
      console.error("Live card failed:", err);
      grid.innerHTML = `<p style="color:var(--white);opacity:.8">Could not load livestream.</p>`;
    }
  }

  // Init
  const track = document.getElementById("playlist-track");
  if (track) loadPlaylistCarousel(track);

  const live = document.getElementById("latest-live");
  if (live) loadLatestLive(live);
})();
