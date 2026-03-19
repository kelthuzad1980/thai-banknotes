/* ============================================================
   THAI BANKNOTES CATALOGUE — filters.js
   URL-aware filtering & state management
   ============================================================ */
'use strict';

const Filters = {

  /* Current state */
  state: {
    era:    'all',
    denoms: [],
    rarity: [],
    type:   [],
    page:   1,
    sort:   'series-asc',
    q:      ''
  },

  /* Read filters from URL on page load */
  init() {
    const p = new URLSearchParams(location.search);
    if (p.get('era'))    this.state.era    = p.get('era');
    if (p.get('sort'))   this.state.sort   = p.get('sort');
    if (p.get('page'))   this.state.page   = parseInt(p.get('page'), 10) || 1;
    if (p.get('denom'))  this.state.denoms = p.getAll('denom');
    if (p.get('rarity')) this.state.rarity = p.getAll('rarity');
    if (p.get('type'))   this.state.type   = p.getAll('type');
    if (p.get('q'))      this.state.q      = p.get('q');

    this._syncInputs();
    this._apply();
    this._bindEvents();
  },

  /* Push current state to URL without reload */
  _pushURL() {
    const p = new URLSearchParams();
    if (this.state.era && this.state.era !== 'all') p.set('era', this.state.era);
    this.state.denoms.forEach(d => p.append('denom', d));
    this.state.rarity.forEach(r => p.append('rarity', r));
    this.state.type.forEach(t => p.append('type', t));
    if (this.state.sort !== 'series-asc') p.set('sort', this.state.sort);
    if (this.state.page > 1) p.set('page', this.state.page);
    if (this.state.q) p.set('q', this.state.q);
    const qs = p.toString();
    history.replaceState({}, '', qs ? `?${qs}` : location.pathname);
  },

  /* Sync form controls to state */
  _syncInputs() {
    const era = document.querySelector(`input[name="era"][value="${this.state.era}"]`);
    if (era) era.checked = true;

    this.state.denoms.forEach(v => {
      const el = document.querySelector(`input[name="denom"][value="${v}"]`);
      if (el) el.checked = true;
    });
    this.state.rarity.forEach(v => {
      const el = document.querySelector(`input[name="rarity"][value="${v}"]`);
      if (el) el.checked = true;
    });
    this.state.type.forEach(v => {
      const el = document.querySelector(`input[name="type"][value="${v}"]`);
      if (el) el.checked = true;
    });

    const sort = document.getElementById('sortSelect');
    if (sort && this.state.sort) sort.value = this.state.sort;
  },

  /* Apply filters to visible cards */
  _apply() {
    const grid = document.getElementById('banknotesGrid');
    if (!grid) return;

    let visible = 0;
    const q = this.state.q.toLowerCase().trim();

    grid.querySelectorAll('.banknote-card').forEach(card => {
      const matchEra   = this.state.era === 'all' || card.dataset.era === this.state.era;
      const matchDenom = this.state.denoms.length === 0 || this.state.denoms.includes(card.dataset.denom);
      const matchRar   = this.state.rarity.length === 0 || this.state.rarity.includes(card.dataset.rarity);
      const matchType  = this.state.type.length === 0   || this.state.type.includes(card.dataset.type);
      const matchQ     = !q || card.textContent.toLowerCase().includes(q);
      const show = matchEra && matchDenom && matchRar && matchType && matchQ;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const countEl = document.getElementById('noteCount');
    if (countEl) countEl.textContent = visible;

    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';

    this._pushURL();
  },

  /* Bind all filter events */
  _bindEvents() {
    /* Era radio */
    document.querySelectorAll('input[name="era"]').forEach(inp => {
      inp.addEventListener('change', () => {
        this.state.era = inp.value;
        this.state.page = 1;
        this._apply();
      });
    });

    /* Denomination checkboxes */
    document.querySelectorAll('input[name="denom"]').forEach(inp => {
      inp.addEventListener('change', () => {
        this.state.denoms = [...document.querySelectorAll('input[name="denom"]:checked')].map(i => i.value);
        this._apply();
      });
    });

    /* Rarity checkboxes */
    document.querySelectorAll('input[name="rarity"]').forEach(inp => {
      inp.addEventListener('change', () => {
        this.state.rarity = [...document.querySelectorAll('input[name="rarity"]:checked')].map(i => i.value);
        this._apply();
      });
    });

    /* Type checkboxes */
    document.querySelectorAll('input[name="type"]').forEach(inp => {
      inp.addEventListener('change', () => {
        this.state.type = [...document.querySelectorAll('input[name="type"]:checked')].map(i => i.value);
        this._apply();
      });
    });

    /* Sort */
    document.getElementById('sortSelect')?.addEventListener('change', e => {
      this.state.sort = e.target.value;
      this._sortCards();
      this._pushURL();
    });

    /* Clear all */
    document.getElementById('clearFilters')?.addEventListener('click', () => {
      this.state = { era: 'all', denoms: [], rarity: [], type: [], page: 1, sort: this.state.sort, q: '' };
      document.querySelectorAll('input[name="era"][value="all"]')[0]?.click();
      document.querySelectorAll('input[name="denom"], input[name="rarity"], input[name="type"]')
        .forEach(i => { i.checked = false; });
      this._apply();
    });
  },

  /* Sort banknote cards */
  _sortCards() {
    const grid = document.getElementById('banknotesGrid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.banknote-card')];
    const dv = { '1': 1, '5': 5, '10': 10, '20': 20, '50': 50, '60': 60, '100': 100, '500': 500, '1000': 1000 };
    cards.sort((a, b) => {
      const da = dv[a.dataset.denom] || 0;
      const db = dv[b.dataset.denom] || 0;
      if (this.state.sort === 'denom-asc')  return da - db;
      if (this.state.sort === 'denom-desc') return db - da;
      return 0;
    });
    cards.forEach(c => grid.appendChild(c));
  }
};

// Auto-init on catalog page
if (document.getElementById('banknotesGrid')) {
  document.addEventListener('DOMContentLoaded', () => Filters.init());
}

window.Filters = Filters;
