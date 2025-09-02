(function () {
  const grid = document.getElementById("local-updates-grid");
  if (!grid) return;

  const src   = grid.dataset.src || "src/data/updates.json";
  const limit = Number(grid.dataset.limit || 0); // 0 = no limit

  const fmtUK = iso =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  function card(item){
    const date = item.date ? `<p class="card-meta">${fmtUK(item.date)} · ${esc((item.type||"post"))}</p>` : "";
    const img  = item.image ? `<img src="${item.image}" alt="${esc(item.title)}">` : "";
    const tag  = Array.isArray(item.tags) && item.tags.length ? ` data-tags="${esc(item.tags.join(","))}"` : "";
    const href = item.url || "#";

    return `
      <article class="update-card"${tag}>
        <a class="card-media" href="${href}" target="${/^https?:\/\//.test(href) ? "_blank" : "_self"}" rel="noopener">
          ${img}
        </a>
        <div class="card-body">
          ${date}
          <h3 class="card-title"><a href="${href}" target="${/^https?:\/\//.test(href) ? "_blank" : "_self"}" rel="noopener">${esc(item.title)}</a></h3>
          ${item.excerpt ? `<p class="card-excerpt">${esc(item.excerpt)}</p>` : ""}
        </div>
      </article>
    `;
  }

  async function run(){
    try{
      const res = await fetch(src, { cache: "no-store" });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Sort newest first by date string
      const items = (Array.isArray(data) ? data : [])
        .slice() // clone
        .sort((a,b) => (b.date||"").localeCompare(a.date||""));

      const slice = limit > 0 ? items.slice(0, limit) : items;
      grid.innerHTML = slice.map(card).join("") || `<p style="color:var(--white);opacity:.8">No updates yet.</p>`;
    } catch (err){
      console.error("Local updates load failed:", err);
      grid.innerHTML = `<p style="color:var(--white);opacity:.8">Could not load updates.</p>`;
    }
  }

  run();
})();
