/* ============================================================
   THAI BANKNOTES CATALOGUE — main.js
   v2 · Full-featured professional museum site
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     1. HEADER — scroll detection & active link
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const header = document.getElementById('header');
  if (header) {
    const tick = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  // Highlight active nav link by current page
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(a => {
    const href = a.getAttribute('href')?.split('?')[0];
    if (href === page) a.classList.add('active');
    else if (page === '' && href === 'index.html') a.classList.add('active');
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2. HAMBURGER / MOBILE NAV
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const ham    = document.getElementById('hamburger');
  const mNav   = document.getElementById('mobileNav');

  ham?.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mNav?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham?.classList.remove('open');
    mNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
  // Close on outside click
  document.addEventListener('click', e => {
    if (mNav?.classList.contains('open') && !mNav.contains(e.target) && !ham?.contains(e.target)) {
      ham?.classList.remove('open');
      mNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3. SEARCH OVERLAY
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput   = document.getElementById('searchInput');
  const searchClose   = document.getElementById('searchClose');

  const openSearch = () => {
    searchOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 60);
  };
  const closeSearch = () => {
    searchOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
  };

  document.getElementById('searchBtn')?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  // Live search in grid (client-side, for demonstration)
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return;
    document.querySelectorAll('.banknote-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     4. SCROLL REVEAL (IntersectionObserver)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const revealEls = document.querySelectorAll('.reveal, .fade-in');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      obs.observe(el);
    });
  } else {
    revealEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     5. COUNTER ANIMATION (hero stats)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 1400;
    const start  = performance.now();
    const update = now => {
      const p = Math.min((now - start) / dur, 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = v + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     6. SMOOTH ANCHOR SCROLL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
      }
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     7. CATALOG — VIEW TOGGLE (grid / list)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const grid     = document.getElementById('banknotesGrid');
  const gridBtn  = document.getElementById('gridViewBtn');
  const listBtn  = document.getElementById('listViewBtn');

  gridBtn?.addEventListener('click', () => {
    grid?.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn?.classList.remove('active');
    localStorage.setItem('catalogView', 'grid');
  });
  listBtn?.addEventListener('click', () => {
    grid?.classList.add('list-view');
    listBtn.classList.add('active');
    gridBtn?.classList.remove('active');
    localStorage.setItem('catalogView', 'list');
  });
  // Restore saved view
  if (localStorage.getItem('catalogView') === 'list') {
    grid?.classList.add('list-view');
    listBtn?.classList.add('active');
    gridBtn?.classList.remove('active');
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     8. CATALOG — SORT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const sortSel = document.getElementById('sortSelect');
  sortSel?.addEventListener('change', () => {
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.banknote-card')];
    const val   = sortSel.value;
    const denoms = { '1': 1, '5': 5, '10': 10, '20': 20, '50': 50, '60': 60, '100': 100, '500': 500, '1000': 1000 };

    cards.sort((a, b) => {
      const da = denoms[a.dataset.denom] || 0;
      const db = denoms[b.dataset.denom] || 0;
      if (val === 'denom-asc')  return da - db;
      if (val === 'denom-desc') return db - da;
      // series sort is based on DOM position by default
      return 0;
    });

    cards.forEach(c => grid.appendChild(c));
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     9. CATALOG — SIDEBAR TOGGLE (mobile)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar       = document.getElementById('catalogSidebar');
  sidebarToggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));

  // Show sidebar toggle on narrow screens
  const checkSidebarToggle = () => {
    if (sidebarToggle) sidebarToggle.style.display = window.innerWidth <= 900 ? 'inline-flex' : 'none';
  };
  window.addEventListener('resize', checkSidebarToggle);
  checkSidebarToggle();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     10. CATALOG — FILTERS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function applyFilters() {
    if (!grid) return;

    // Collect active filters
    const era    = document.querySelector('input[name="era"]:checked')?.value || 'all';
    const denoms = [...document.querySelectorAll('input[name="denom"]:checked')].map(i => i.value);
    const rars   = [...document.querySelectorAll('input[name="rarity"]:checked')].map(i => i.value);
    const types  = [...document.querySelectorAll('input[name="type"]:checked')].map(i => i.value);

    // Also read URL param (for era= links from index)
    const urlEra = new URLSearchParams(location.search).get('era');
    const activeEra = urlEra || era;

    let visible = 0;
    grid.querySelectorAll('.banknote-card').forEach(card => {
      const matchEra  = activeEra === 'all' || card.dataset.era === activeEra;
      const matchDenom = denoms.length === 0 || denoms.includes(card.dataset.denom);
      const matchRar   = rars.length === 0   || rars.includes(card.dataset.rarity);
      const matchType  = types.length === 0  || types.includes(card.dataset.type);
      const show = matchEra && matchDenom && matchRar && matchType;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Update count
    const countEl = document.getElementById('noteCount');
    if (countEl) countEl.textContent = visible;

    // Show/hide empty state
    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }

  // Listen to all filter inputs
  document.querySelectorAll('input[name="era"], input[name="denom"], input[name="rarity"], input[name="type"]')
    .forEach(inp => inp.addEventListener('change', applyFilters));

  // Clear filters
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    document.querySelectorAll('input[name="era"]')[0]?.click(); // reset era to "all"
    document.querySelectorAll('input[name="denom"], input[name="rarity"], input[name="type"]')
      .forEach(i => { if (i.type === 'checkbox') i.checked = false; });
    history.replaceState({}, '', location.pathname);
    applyFilters();
  });

  // Apply era filter from URL on load
  const urlEra = new URLSearchParams(location.search).get('era');
  if (urlEra) {
    const radio = document.querySelector(`input[name="era"][value="${urlEra}"]`);
    if (radio) { radio.checked = true; }
    applyFilters();
  }

  // Init count
  const countEl = document.getElementById('noteCount');
  if (countEl && grid) {
    countEl.textContent = grid.querySelectorAll('.banknote-card').length;
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     11. TIMELINE ERA — click to navigate
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.timeline-era, .exhibit-era').forEach(era => {
    era.style.cursor = 'pointer';
    era.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        era.click();
      }
    });
    era.setAttribute('tabindex', '0');
    era.setAttribute('role', 'link');
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     12. SERIES HEADER — dynamic from URL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const seriesData = {
    'first':       { num: 'I',    name: 'First Series',       years: '1880–1902', era: 'Rama V',         notes: 4  },
    'second':      { num: 'II',   name: 'Second Series',      years: '1902–1925', era: 'Rama V–VI',      notes: 8  },
    'third':       { num: 'III',  name: 'Third Series',       years: '1925–1935', era: 'Rama VI–VII',    notes: 7  },
    'fourth':      { num: 'IV',   name: 'Fourth Series',      years: '1935–1939', era: 'Rama VII–VIII',  notes: 6  },
    'fifth':       { num: 'V',    name: 'Fifth Series',       years: '1939–1944', era: 'Rama VIII',      notes: 9  },
    'sixth':       { num: 'VI',   name: 'Sixth Series',       years: '1944–1948', era: 'Rama VIII–IX',   notes: 8  },
    'seventh':     { num: 'VII',  name: 'Seventh Series',     years: '1948–1953', era: 'Rama IX',        notes: 10 },
    'eighth':      { num: 'VIII', name: 'Eighth Series',      years: '1953–1955', era: 'Rama IX',        notes: 7  },
    'ninth':       { num: 'IX',   name: 'Ninth Series',       years: '1955–1968', era: 'Rama IX',        notes: 9  },
    'tenth':       { num: 'X',    name: 'Tenth Series',       years: '1969–1978', era: 'Rama IX',        notes: 11 },
    'eleventh':    { num: 'XI',   name: 'Eleventh Series',    years: '1978–1992', era: 'Rama IX',        notes: 10 },
    'twelfth':     { num: 'XII',  name: 'Twelfth Series',     years: '1992–1999', era: 'Rama IX',        notes: 8  },
    'thirteenth':  { num: 'XIII', name: 'Thirteenth Series',  years: '1999–2003', era: 'Rama IX',        notes: 7  },
    'fourteenth':  { num: 'XIV',  name: 'Fourteenth Series',  years: '1997–2004', era: 'Rama IX',        notes: 8  },
    'fifteenth':   { num: 'XV',   name: 'Fifteenth Series',   years: '2004–2012', era: 'Rama IX',        notes: 6  },
    'sixteenth':   { num: 'XVI',  name: 'Sixteenth Series',   years: '2012–2015', era: 'Rama IX–X',      notes: 7  },
    'seventeenth': { num: 'XVII', name: 'Seventeenth Series', years: '2018–Present', era: 'Rama X',      notes: 7  },
  };

  const seriesHeader = document.getElementById('seriesHeader');
  if (seriesHeader) {
    const slug  = new URLSearchParams(location.search).get('series') || 'fourteenth-series';
    const key   = slug.replace('-series', '');
    const data  = seriesData[key] || seriesData['fourteenth'];
    document.title = `${data.name} | Thai Banknotes Catalogue`;
    const titleEl = document.getElementById('seriesTitle');
    const yearsEl = document.getElementById('seriesYears');
    const eraEl   = document.getElementById('seriesEra');
    const numEl   = document.querySelector('.series-header__number');
    const countEl = document.getElementById('banknoteCount');
    if (titleEl) titleEl.textContent = data.name;
    if (yearsEl) yearsEl.textContent = data.years;
    if (eraEl)   eraEl.textContent   = `Reign of ${data.era}`;
    if (numEl)   numEl.textContent   = `Series No. ${data.num}`;
    if (countEl) countEl.textContent = data.notes;
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     13. PAGINATION (client-side demo)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent.includes('Next')) {
        const active = document.querySelector('.page-btn.active');
        if (active?.nextElementSibling?.classList.contains('page-btn')) {
          active.classList.remove('active');
          active.nextElementSibling.classList.add('active');
        }
      } else if (!btn.textContent.includes('…')) {
        document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.scrollTo({ top: document.querySelector('.catalog-wrap, .banknotes-section')?.offsetTop - 100 || 0, behavior: 'smooth' });
      }
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     14. PARALLAX — panorama image (subtle)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const panoramaImg = document.querySelector('.timeline-panorama img');
  if (panoramaImg) {
    const section = panoramaImg.closest('.timeline-panorama, .timeline-banner');
    const scroll = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = 1 - rect.bottom / (window.innerHeight + rect.height);
      panoramaImg.style.transform = `scale(1.06) translateY(${progress * 16}px)`;
    };
    window.addEventListener('scroll', scroll, { passive: true });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     15. SERIES GRID CARD — hover image background (index.html)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.series-card--bg').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const hover = card.style.getPropertyValue('--hover-img');
      if (hover) card.style.setProperty('--bg-img', hover);
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     16. IMAGE LAZY LOAD + error fallback
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', () => {
      img.style.background = '#E8E4DA';
      img.style.display = 'block';
      img.removeAttribute('src');
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     17. COPY CATALOGUE NUMBER (banknote detail)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.note-hero__series, .variety-header__code').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to copy catalogue number';
    el.addEventListener('click', () => {
      navigator.clipboard?.writeText(el.textContent.trim()).then(() => {
        const orig = el.textContent;
        el.textContent = '✓ Copied';
        setTimeout(() => { el.textContent = orig; }, 1500);
      });
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     18. MOBILE NAV — add all links if not already present
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const mobileNavEl = document.getElementById('mobileNav');
  if (mobileNavEl && mobileNavEl.children.length === 0) {
    const links = [
      { href: 'index.html',        label: 'Home'          },
      { href: 'catalog.html',      label: 'Series'        },
      { href: 'catalog.html',      label: 'Banknotes'     },
      { href: 'signature.html',    label: 'Signatures'    },
      { href: 'commemorative.html',label: 'Commemorative' },
    ];
    links.forEach(({ href, label }) => {
      const a = document.createElement('a');
      a.href = href; a.className = 'navbar__link'; a.textContent = label;
      if (href.split('?')[0] === page) a.classList.add('active');
      mobileNavEl.appendChild(a);
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     19. SIGNATURE / PERSON SEARCH
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const sigSearch = document.getElementById('sigSearch');
  sigSearch?.addEventListener('input', () => {
    const q = sigSearch.value.toLowerCase().trim();
    document.querySelectorAll('.sig-card').forEach(card => {
      card.style.display = (!q || card.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     20. COMMEMORATIVE CATEGORY FILTER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.closest('.filter-pills')?.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const f = pill.dataset.filter || 'all';
      // Role filter (signature page)
      document.querySelectorAll('.sig-card').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.role === f) ? '' : 'none';
      });
      // Category filter (commemorative page)
      document.querySelectorAll('.banknote-card[data-cat]').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INIT complete
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  console.log('%cThai Banknotes Catalogue — JS loaded', 'color:#C6A75E;font-family:serif;font-size:13px');
});
