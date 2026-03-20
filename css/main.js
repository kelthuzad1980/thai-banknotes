/* ============================================================
   THAI BANKNOTES CATALOGUE — main.js
   v3 · Filters conflict resolved — handled by filters.js only
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
  const ham  = document.getElementById('hamburger');
  const mNav = document.getElementById('mobileNav');

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
  document.addEventListener('click', e => {
    if (mNav?.classList.contains('open') && !mNav.contains(e.target) && !ham?.contains(e.target)) {
      ham?.classList.remove('open');
      mNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Auto-populate mobile nav if empty
  const mobileNavEl = document.getElementById('mobileNav');
  if (mobileNavEl && mobileNavEl.children.length === 0) {
    const links = [
      { href: 'index.html',         label: 'Home'          },
      { href: 'catalog.html',       label: 'Series'        },
      { href: 'catalog.html',       label: 'Banknotes'     },
      { href: 'signature.html',     label: 'Signatures'    },
      { href: 'commemorative.html', label: 'Commemorative' },
    ];
    links.forEach(({ href, label }) => {
      const a = document.createElement('a');
      a.href = href; a.className = 'navbar__link'; a.textContent = label;
      if (href.split('?')[0] === page) a.classList.add('active');
      mobileNavEl.appendChild(a);
    });
  }

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
    // restore all cards when search cleared
    document.querySelectorAll('.banknote-card').forEach(c => {
      if (c.dataset.searchHidden) { c.style.display = ''; delete c.dataset.searchHidden; }
    });
  };

  document.getElementById('searchBtn')?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  // Live search — only hides, doesn't conflict with filters
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.banknote-card').forEach(card => {
      if (!q) {
        if (card.dataset.searchHidden) { card.style.display = ''; delete card.dataset.searchHidden; }
      } else {
        const matches = card.textContent.toLowerCase().includes(q);
        if (!matches) { card.style.display = 'none'; card.dataset.searchHidden = '1'; }
        else { card.style.display = ''; delete card.dataset.searchHidden; }
      }
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
        if (entry.isIntersecting) { animateCount(entry.target); cObs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const update = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
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
     NOTE: Sort is handled exclusively by filters.js
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const gridEl  = document.getElementById('banknotesGrid');
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');

  gridBtn?.addEventListener('click', () => {
    gridEl?.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn?.classList.remove('active');
    localStorage.setItem('catalogView', 'grid');
  });
  listBtn?.addEventListener('click', () => {
    gridEl?.classList.add('list-view');
    listBtn.classList.add('active');
    gridBtn?.classList.remove('active');
    localStorage.setItem('catalogView', 'list');
  });
  if (localStorage.getItem('catalogView') === 'list') {
    gridEl?.classList.add('list-view');
    listBtn?.classList.add('active');
    gridBtn?.classList.remove('active');
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     8. CATALOG — SIDEBAR TOGGLE (mobile)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar       = document.getElementById('catalogSidebar');
  sidebarToggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));

  const checkSidebarToggle = () => {
    if (sidebarToggle) sidebarToggle.style.display = window.innerWidth <= 900 ? 'inline-flex' : 'none';
  };
  window.addEventListener('resize', checkSidebarToggle);
  checkSidebarToggle();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     9. TIMELINE ERA — keyboard accessibility
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.timeline-era, .exhibit-era').forEach(era => {
    era.setAttribute('tabindex', '0');
    era.setAttribute('role', 'link');
    era.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); era.click(); }
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     10. SERIES HEADER — dynamic title from URL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const seriesData = {
    'first':       { num:'I',    name:'First Series',       years:'1880–1902', era:'Rama V',        notes:4  },
    'second':      { num:'II',   name:'Second Series',      years:'1902–1925', era:'Rama V–VI',     notes:8  },
    'third':       { num:'III',  name:'Third Series',       years:'1925–1935', era:'Rama VI–VII',   notes:7  },
    'fourth':      { num:'IV',   name:'Fourth Series',      years:'1935–1939', era:'Rama VII–VIII', notes:6  },
    'fifth':       { num:'V',    name:'Fifth Series',       years:'1939–1944', era:'Rama VIII',     notes:9  },
    'sixth':       { num:'VI',   name:'Sixth Series',       years:'1944–1948', era:'Rama VIII–IX',  notes:8  },
    'seventh':     { num:'VII',  name:'Seventh Series',     years:'1948–1953', era:'Rama IX',       notes:10 },
    'eighth':      { num:'VIII', name:'Eighth Series',      years:'1953–1955', era:'Rama IX',       notes:7  },
    'ninth':       { num:'IX',   name:'Ninth Series',       years:'1955–1968', era:'Rama IX',       notes:9  },
    'tenth':       { num:'X',    name:'Tenth Series',       years:'1969–1978', era:'Rama IX',       notes:11 },
    'eleventh':    { num:'XI',   name:'Eleventh Series',    years:'1978–1992', era:'Rama IX',       notes:10 },
    'twelfth':     { num:'XII',  name:'Twelfth Series',     years:'1992–1999', era:'Rama IX',       notes:8  },
    'thirteenth':  { num:'XIII', name:'Thirteenth Series',  years:'1999–2003', era:'Rama IX',       notes:7  },
    'fourteenth':  { num:'XIV',  name:'Fourteenth Series',  years:'1997–2004', era:'Rama IX',       notes:8  },
    'fifteenth':   { num:'XV',   name:'Fifteenth Series',   years:'2004–2012', era:'Rama IX',       notes:6  },
    'sixteenth':   { num:'XVI',  name:'Sixteenth Series',   years:'2012–2015', era:'Rama IX–X',     notes:7  },
    'seventeenth': { num:'XVII', name:'Seventeenth Series', years:'2018–Present', era:'Rama X',     notes:7  },
  };
  const seriesHeader = document.getElementById('seriesHeader');
  if (seriesHeader) {
    const slug = new URLSearchParams(location.search).get('series') || 'fourteenth-series';
    const key  = slug.replace('-series', '');
    const data = seriesData[key] || seriesData['fourteenth'];
    document.title = `${data.name} | Thai Banknotes Catalogue`;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('seriesTitle', data.name);
    set('seriesYears', data.years);
    set('seriesEra',   `Reign of ${data.era}`);
    set('banknoteCount', data.notes);
    const numEl = document.querySelector('.series-header__number');
    if (numEl) numEl.textContent = `Series No. ${data.num}`;
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     11. PAGINATION (visual only until backend)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent.includes('…')) return;
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (!btn.textContent.includes('Next')) {
        window.scrollTo({ top: document.querySelector('.catalog-wrap')?.offsetTop - 100 || 0, behavior: 'smooth' });
      }
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     12. PARALLAX — timeline panorama
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const panoramaImg = document.querySelector('.timeline-panorama img');
  if (panoramaImg) {
    const section = panoramaImg.closest('.timeline-panorama, .timeline-banner');
    window.addEventListener('scroll', () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = 1 - rect.bottom / (window.innerHeight + rect.height);
      panoramaImg.style.transform = `scale(1.06) translateY(${progress * 14}px)`;
    }, { passive: true });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     13. SIGNATURE SEARCH (signature.html)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const sigSearch = document.getElementById('sigSearch');
  sigSearch?.addEventListener('input', () => {
    const q = sigSearch.value.toLowerCase().trim();
    document.querySelectorAll('.sig-card').forEach(card => {
      card.style.display = (!q || card.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     14. FILTER PILLS (commemorative, signature pages)
     NOTE: catalog filters are handled exclusively by filters.js
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.closest('.filter-pills')?.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const f = pill.dataset.filter || 'all';
      document.querySelectorAll('.sig-card').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.role === f) ? '' : 'none';
      });
      document.querySelectorAll('.banknote-card[data-cat]').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     15. COPY CATALOGUE NUMBER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.note-hero__series, .variety-header__code').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to copy';
    el.addEventListener('click', () => {
      navigator.clipboard?.writeText(el.textContent.trim()).then(() => {
        const orig = el.textContent;
        el.textContent = '✓ Copied';
        setTimeout(() => { el.textContent = orig; }, 1500);
      });
    });
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     16. FOOTER YEAR
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.footer__bottom p').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
  });

  console.log('%cThai Banknotes — JS v3 loaded', 'color:#C6A75E;font-family:serif');
});
