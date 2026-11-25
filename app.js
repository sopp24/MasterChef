(() => {
  "use strict";
  const data = window.BK_CONTENT;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const categoryNames = {
    concept: "Concept & stratégie",
    media: "Dispositif média",
    budget: "Budget & arbitrages",
    planning: "Planning & exécution",
    performance: "Performance",
    unknown: "Information manquante"
  };

  const topicGrid = $("#topicGrid");
  topicGrid.innerHTML = data.topics.map((topic) => `
    <details class="branch-card" data-topic="${escapeHTML(topic.id)}" data-color="${escapeHTML(topic.color)}">
      <summary class="branch-summary">
        <span class="branch-num">${escapeHTML(topic.number)}</span>
        <span><span class="branch-title">${escapeHTML(topic.title)}</span><span class="branch-subtitle">${escapeHTML(topic.subtitle)}</span></span>
        <span class="branch-chevron" aria-hidden="true">＋</span>
      </summary>
      <p class="branch-intro">${escapeHTML(topic.intro)}</p>
      <div class="branch-body">
        ${topic.groups.map((group) => `
          <div class="info-group">
            <h4>${escapeHTML(group.label)}</h4>
            <ul>${group.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          </div>
        `).join("")}
        <div class="question-tags" role="group" aria-label="Questions associées">
          ${topic.questions.map((question) => `<span>${escapeHTML(question)}</span>`).join("")}
        </div>
        ${topic.budget ? `
          <div class="budget-mini" role="group" aria-label="Répartition du budget">
            <div class="budget-strip">${topic.budget.map((item) => `<span style="width:${(item.value / 2200000 * 100).toFixed(3)}%;background:${item.color}" title="${escapeHTML(item.label)} : ${escapeHTML(item.pct)}"></span>`).join("")}</div>
            <div class="budget-legend">${topic.budget.map((item) => `<div><i style="background:${item.color}"></i><span>${escapeHTML(item.label)}</span><strong>${escapeHTML(item.amount)} · ${escapeHTML(item.pct)}</strong></div>`).join("")}</div>
          </div>
        ` : ""}
      </div>
    </details>
  `).join("");

  const objectionGrid = $("#objectionGrid");
  objectionGrid.innerHTML = data.objections.map((objection, index) => `
    <article class="objection-card" data-objection="${escapeHTML(objection.id)}" data-category="${escapeHTML(objection.category)}" data-search="${escapeHTML([objection.title, objection.label, objection.brief, objection.defend, objection.trade, objection.say].join(" ").toLowerCase())}">
      <details>
        <summary>
          <span><span class="category-label">${escapeHTML(objection.label)} · ${String(index + 1).padStart(2, "0")}</span><h3>${escapeHTML(objection.title)}</h3></span>
          <span class="expand-icon" aria-hidden="true">＋</span>
        </summary>
        <div class="objection-body">
          <div class="objection-part"><h4>LE FAIT À RAPPELER</h4><p>${escapeHTML(objection.brief)}</p></div>
          <div class="objection-part"><h4>L'ARGUMENT À DÉFENDRE</h4><p>${escapeHTML(objection.defend)}</p></div>
          <div class="objection-part"><h4>L'ARBITRAGE / LA CONTREPARTIE</h4><p>${escapeHTML(objection.trade)}</p></div>
          <div class="objection-part sample"><h4>FORMULATION POSSIBLE À L'ORAL</h4><p>${escapeHTML(objection.say)}</p></div>
        </div>
      </details>
    </article>
  `).join("");

  $("#missingList").innerHTML = data.missing.map((item) => `<div class="missing-item">${escapeHTML(item)}</div>`).join("");
  $("#assetGrid").innerHTML = data.assets.map((asset) => `
    <a class="asset-link" href="${escapeHTML(asset.url)}" target="_blank" rel="noopener noreferrer">
      <span class="asset-arrow" aria-hidden="true">↗</span>
      <span class="asset-type">${escapeHTML(asset.type)}</span>
      <strong>${escapeHTML(asset.title)}</strong>
      <small>${escapeHTML(asset.description)}</small>
    </a>
  `).join("");

  // Budget strip / legend are styled locally to keep the mind map self-contained.
  const budgetStyle = document.createElement("style");
  budgetStyle.textContent = `
    .budget-mini{margin-top:18px;padding-top:14px;border-top:1px solid #eee6dc}
    .budget-strip{height:12px;display:flex;overflow:hidden;border-radius:99px;background:#eee}
    .budget-legend{display:grid;gap:7px;margin-top:12px}
    .budget-legend>div{display:grid;grid-template-columns:9px minmax(0,1fr) auto;align-items:center;gap:8px;font-size:10px;color:#6b6157}
    .budget-legend i{width:8px;height:8px;border-radius:50%}
    .budget-legend strong{font-size:10px;color:#26221e}
  `;
  document.head.appendChild(budgetStyle);

  const searchInput = $("#searchInput");
  const filterButtons = $$(".filter-chip");
  const feedback = $("#searchFeedback");
  const noResults = $("#noResults");
  const drawResult = $("#drawResult");
  let activeFilter = "all";
  let lastDrawId = "";
  let visibleObjections = data.objections.slice();

  function applyObjectionFilters() {
    const query = searchInput.value.trim().toLocaleLowerCase("fr-FR");
    let visible = 0;
    visibleObjections = [];
    $$(".objection-card").forEach((card) => {
      const categoryOK = activeFilter === "all" || card.dataset.category === activeFilter;
      const text = `${card.dataset.search} ${card.dataset.objection}`.toLocaleLowerCase("fr-FR");
      const queryOK = !query || text.includes(query);
      const show = categoryOK && queryOK;
      card.hidden = !show;
      if (show) {
        visible += 1;
        const record = data.objections.find((item) => item.id === card.dataset.objection);
        if (record) visibleObjections.push(record);
      }
    });
    if (!drawResult.hidden && !visibleObjections.some((item) => item.id === lastDrawId)) drawResult.hidden = true;
    feedback.textContent = `${visible} objection${visible === 1 ? "" : "s"} ${query || activeFilter !== "all" ? "correspondante" + (visible === 1 ? "" : "s") : "pour t'entraîner"}.`;
    noResults.hidden = visible !== 0;
    if (visible === 0) drawResult.hidden = true;
  }

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("selected")));
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      applyObjectionFilters();
    });
  });
  searchInput.addEventListener("input", applyObjectionFilters);

  $("#drawBtn").addEventListener("click", () => {
    if (!visibleObjections.length) {
      drawResult.hidden = false;
      drawResult.innerHTML = `<strong>AUCUNE OBJECTION DISPONIBLE</strong><p>Enlève un filtre ou modifie ta recherche pour tirer une objection.</p>`;
      return;
    }
    let pool = visibleObjections.filter((item) => item.id !== lastDrawId);
    if (!pool.length) pool = visibleObjections;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    lastDrawId = chosen.id;
    drawResult.hidden = false;
    drawResult.innerHTML = `<strong>TON OBJECTION À TRAITER</strong><p>${escapeHTML(chosen.title)}</p><span class="draw-open" role="button" tabindex="0">Ouvrir la réponse préparée ↗</span>`;
    const openChosen = () => {
      const card = $(`[data-objection="${chosen.id}"]`);
      if (!card) return;
      const details = $("details", card);
      details.open = true;
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    };
    const openLink = $(".draw-open", drawResult);
    openLink.addEventListener("click", openChosen);
    openLink.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openChosen(); }
    });
  });

  $("#printBtn").addEventListener("click", () => window.print());

  // À l'impression, les navigateurs récents masquent le contenu des <details> fermés
  // malgré les styles d'impression : on les ouvre le temps de l'impression, puis on restaure.
  let reopenAfterPrint = [];
  window.addEventListener("beforeprint", () => {
    reopenAfterPrint = $$("details:not([open])");
    reopenAfterPrint.forEach((details) => { details.open = true; });
  });
  window.addEventListener("afterprint", () => {
    reopenAfterPrint.forEach((details) => { details.open = false; });
    reopenAfterPrint = [];
  });

  const methodText = [
    "1. ACCUEILLIR : reformuler l'objection et identifier le risque.",
    "2. REPLACER : rappeler le besoin initial et la contrainte du brief.",
    "3. DÉFENDRE : apporter deux arguments appuyés sur des faits, chiffres ou jalons.",
    "4. ARBITRER : proposer une option et en expliquer la contrepartie.",
    "5. OUVRIR : obtenir une priorité, une validation ou une décision."
  ].join("\n");
  // Copie : API Clipboard, avec repli sur execCommand si elle est indisponible (contexte non sécurisé, vieux navigateur).
  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch (error) { /* repli ci-dessous */ }
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
    document.body.removeChild(area);
    return copied;
  }
  let copyTimer = 0;
  $("#copyMethod").addEventListener("click", async () => {
    const status = $("#copyStatus");
    status.textContent = (await copyText(methodText)) ? "Méthode copiée." : "Copie indisponible sur ce navigateur.";
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => { status.textContent = ""; }, 2800);
  });

  // Raccourci clavier de recherche (Cmd/Ctrl + K).
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  // Navigation : l'onglet de section visible est mis en évidence.
  const navLinks = $$(".nav-link");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    navLinks.forEach((link) => {
      const section = $(link.getAttribute("href"));
      if (section) observer.observe(section);
    });
  }

  applyObjectionFilters();
})();
