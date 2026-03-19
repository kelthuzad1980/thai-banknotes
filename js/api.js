/* ============================================================
   THAI BANKNOTES CATALOGUE — api.js
   WordPress REST API adapter
   ============================================================ */
'use strict';

const API_BASE = window.WP_API_URL || '/wp-json/wp/v2';
const CACHE    = new Map();

const API = {

  /* ── Generic fetch with cache ──────────────────────────── */
  async _get(url) {
    if (CACHE.has(url)) return CACHE.get(url);
    try {
      const res  = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
      const data = await res.json();
      CACHE.set(url, data);
      return data;
    } catch (err) {
      console.warn('[API]', err.message);
      return null;
    }
  },

  /* ── Build query string ────────────────────────────────── */
  _qs(params = {}) {
    const q = new URLSearchParams({ per_page: 24, ...params });
    return `?${q.toString()}`;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BANKNOTES  (CPT: banknote)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  async getBanknotes(params = {}) {
    const url = `${API_BASE}/banknote${this._qs({ ...params, _embed: true })}`;
    return (await this._get(url)) || [];
  },

  async getBanknote(id) {
    return this._get(`${API_BASE}/banknote/${id}?_embed=true`);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     VARIETIES  (CPT: variety)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  async getVarieties(params = {}) {
    return (await this._get(`${API_BASE}/variety${this._qs(params)}`)) || [];
  },

  async getVariety(id) {
    return this._get(`${API_BASE}/variety/${id}`);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SIGNATURE PAIRS  (CPT: signature_pair)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  async getSignaturePairs(params = {}) {
    return (await this._get(`${API_BASE}/signature_pair${this._qs(params)}`)) || [];
  },

  async getSignaturePair(id) {
    return this._get(`${API_BASE}/signature_pair/${id}`);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PERSONS  (CPT: person)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  async getPersons(params = {}) {
    return (await this._get(`${API_BASE}/person${this._qs(params)}`)) || [];
  },

  async getPerson(id) {
    return this._get(`${API_BASE}/person/${id}`);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SERIES  (Taxonomy: series)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  async getSeries(params = {}) {
    return (await this._get(`${API_BASE}/series${this._qs({ per_page: 20, ...params })}`)) || [];
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     HELPERS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /** Extract featured image URL from embedded data */
  getFeaturedImage(post, size = 'full') {
    try {
      const media = post?._embedded?.['wp:featuredmedia']?.[0];
      if (!media) return null;
      if (size !== 'full' && media.media_details?.sizes?.[size]) {
        return media.media_details.sizes[size].source_url;
      }
      return media.source_url || null;
    } catch {
      return null;
    }
  },

  /** Extract taxonomy term names from embedded data */
  getTerms(post, taxonomy) {
    try {
      const terms = post?._embedded?.['wp:term']?.flat() || [];
      return terms.filter(t => t.taxonomy === taxonomy).map(t => t.name);
    } catch {
      return [];
    }
  },

  /** Build banknote card HTML */
  renderCard(note) {
    const img   = this.getFeaturedImage(note, 'medium') || 'https://placehold.co/400x225/3D2E24/C6A75E?text=No+Image';
    const denom = this.getTerms(note, 'denomination')[0] || note.title?.rendered || '';
    const series= this.getTerms(note, 'series')[0] || '';
    const year  = note.acf?.issued_from || '';
    const rar   = note.acf?.rarity_level || 'common';
    const rarMap = { common: 'Common', scarce: 'Scarce', rare: 'Rare', 'very-rare': 'Very Rare' };
    const rarClass = { common: '', scarce: 'badge--scarce', rare: 'badge--rare', 'very-rare': 'badge--very-rare' };

    return `
      <a href="banknote-detail.html?id=${note.id}" class="banknote-card fade-in"
         data-era="${note.acf?.era || ''}" data-denom="${note.acf?.denomination_value || ''}"
         data-rarity="${rar}" data-type="${note.acf?.note_type || 'circulation'}">
        <div class="banknote-card__image">
          <img src="${img}" alt="${denom}" loading="lazy">
          <div class="banknote-card__overlay"><span>View Details</span></div>
        </div>
        <div class="banknote-card__content">
          <div class="banknote-card__denomination">${denom}</div>
          <div class="banknote-card__series">${series}</div>
          <div class="banknote-card__meta">
            <span class="banknote-card__year">${year}</span>
            <span class="banknote-card__rarity ${rarClass[rar] ? 'badge ' + rarClass[rar] : ''}">${rarMap[rar] || rar}</span>
          </div>
        </div>
      </a>`;
  },

  /** Render loading spinner */
  renderLoading() {
    return '<div class="loading"><div class="loading__spinner"></div></div>';
  },

  /** Render empty state */
  renderEmpty(msg = 'No results found') {
    return `<div class="empty-state"><div class="empty-state__icon">◇</div>
      <h3 class="empty-state__title">${msg}</h3>
      <p class="empty-state__text">Try adjusting your search or filters.</p></div>`;
  }
};

window.API = API;
