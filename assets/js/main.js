/* ═══════════════════════════════════════════════
   AYŞENUR ŞAHİN — PORTFOLIO  |  main.js
   ═══════════════════════════════════════════════ */

/* ── DYNAMIC BASE PATH ────────────────────────
   Detects whether we're in root or pages/ subfolder
   so fetch() calls to backend always resolve correctly.
   ─────────────────────────────────────────────── */
const _inPages = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/admin/');
const API_BASE  = _inPages ? '../backend/php' : 'backend/php';

document.addEventListener('DOMContentLoaded', () => {

  /* ── LUCIDE ICONS ─────────────────────────── */
  if (window.lucide) {
    try { window.lucide.createIcons(); } catch (e) {}
  }

  /* ── PAGE LOADER ──────────────────────────── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 900);
  }

  /* ── SCROLL PROGRESS ──────────────────────── */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
    }, { passive: true });
  }

  /* ── CUSTOM CURSOR ────────────────────────── */
  const cursor   = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (cursor && follower && window.innerWidth > 980) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top  = `${my}px`;
    });

    (function animate() {
      fx += (mx - fx) * 0.14;
      fy += (my - fy) * 0.14;
      follower.style.left = `${fx}px`;
      follower.style.top  = `${fy}px`;
      requestAnimationFrame(animate);
    })();

    const hoverTargets = 'a, button, .project-card-new, .filter-btn, input, textarea, .contact-link-item, .blog-card';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
    });
  }

  /* ── NAV ACTIVE STATE ─────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((a) => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('active', href === page);
  });

  /* ── NAV SCROLL ───────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  /* ── MOBILE MENU ──────────────────────────── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobile-menu');
  if (ham && mob) {
    ham.addEventListener('click', (e) => {
      e.stopPropagation();
      ham.classList.toggle('open');
      mob.classList.toggle('open');
    });
    mob.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        mob.classList.remove('open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!ham.contains(e.target) && !mob.contains(e.target)) {
        ham.classList.remove('open');
        mob.classList.remove('open');
      }
    });
  }

  /* ── INTERSECTION REVEAL ──────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => obs.observe(el));
  }

  /* ── SKILL BARS ANIMATE ───────────────────── */
  const skillBars = document.querySelectorAll('.sc2-fill[data-w]');
  if (skillBars.length) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.width = target.dataset.w + '%';
          barObs.unobserve(target);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach((bar) => barObs.observe(bar));
  }

  /* ── PROJECT FILTER ───────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('[data-cat]');
  if (filterBtns.length && cards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter || 'all';
        cards.forEach((card) => {
          const cats = (card.dataset.cat || '').split(' ');
          const show = cat === 'all' || cats.includes(cat);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── VOTE API ─────────────────────────────── */
  document.querySelectorAll('[data-vote][data-project-id]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const projectId = Number(btn.getAttribute('data-project-id'));
      const voteType  = btn.getAttribute('data-vote');
      if (!projectId || !voteType) return;
      btn.disabled = true;
      try {
        const res  = await fetch(`${API_BASE}/projects.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: projectId, vote_type: voteType })
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.message || 'Oy hatası');
        const card = btn.closest('.project-card-new');
        if (card && data.counts) {
          const likeEl    = card.querySelector('[data-like-count]');
          const dislikeEl = card.querySelector('[data-dislike-count]');
          if (likeEl)    likeEl.textContent    = data.counts.likes;
          if (dislikeEl) dislikeEl.textContent = data.counts.dislikes;
        }
        showToast('Oy kaydedildi ✓', 'success');
      } catch (err) {
        showToast(err.message || 'Oy gönderilemedi', 'error');
      } finally {
        btn.disabled = false;
      }
    });
  });

  /* ── CONTACT FORM ─────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Char counter
    const textarea = contactForm.querySelector('textarea');
    const counter  = contactForm.querySelector('.char-counter');
    if (textarea && counter) {
      textarea.addEventListener('input', () => {
        counter.textContent = `${textarea.value.length}/500`;
      });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-cine[type="submit"]');
      if (btn) { btn.style.opacity = '.7'; btn.style.pointerEvents = 'none'; }

      const payload = {
        name:    contactForm.querySelector('#name')?.value    || '',
        email:   contactForm.querySelector('#email')?.value   || '',
        subject: contactForm.querySelector('#subject')?.value || '',
        message: contactForm.querySelector('#message')?.value || ''
      };

      try {
        const res  = await fetch(`${API_BASE}/contact.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.ok) {
          contactForm.style.display = 'none';
          const success = document.getElementById('form-success');
          if (success) success.classList.add('show');
        } else {
          showToast(data.message || 'Hata oluştu', 'error');
        }
      } catch {
        showToast('Bağlantı hatası', 'error');
      } finally {
        if (btn) { btn.style.opacity = ''; btn.style.pointerEvents = ''; }
      }
    });
  }

  /* ── COPY EMAIL ───────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(el.dataset.copy);
        showToast('E-posta kopyalandı ✓', 'success');
      } catch {
        showToast('Kopyalanamadı', 'error');
      }
    });
  });

  /* ── AUTH FORMS ───────────────────────────── */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fb  = document.getElementById('auth-feedback');
      const btn = loginForm.querySelector('.auth-submit');
      if (btn) btn.style.opacity = '.7';

      try {
        const res  = await fetch(`${API_BASE}/auth.php?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:    loginForm.querySelector('#login-email')?.value,
            password: loginForm.querySelector('#login-password')?.value
          })
        });
        const data = await res.json();
        if (data.ok) {
          if (fb) { fb.textContent = 'Giriş başarılı, yönlendiriliyorsunuz…'; fb.className = 'auth-feedback success'; }
          setTimeout(() => window.location.href = '../index.html', 1000);
        } else {
          if (fb) { fb.textContent = data.message || 'Giriş başarısız.'; fb.className = 'auth-feedback error'; }
        }
      } catch {
        if (fb) { fb.textContent = 'Bağlantı hatası.'; fb.className = 'auth-feedback error'; }
      } finally {
        if (btn) btn.style.opacity = '';
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fb  = document.getElementById('auth-feedback');
      const btn = registerForm.querySelector('.auth-submit');
      if (btn) btn.style.opacity = '.7';

      try {
        const res  = await fetch(`${API_BASE}/auth.php?action=register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:     registerForm.querySelector('#register-name')?.value,
            email:    registerForm.querySelector('#register-email')?.value,
            password: registerForm.querySelector('#register-password')?.value
          })
        });
        const data = await res.json();
        if (data.ok) {
          if (fb) { fb.textContent = 'Kayıt başarılı! Yönlendiriliyorsunuz…'; fb.className = 'auth-feedback success'; }
          setTimeout(() => window.location.href = '../index.html', 1000);
        } else {
          if (fb) { fb.textContent = data.message || 'Kayıt başarısız.'; fb.className = 'auth-feedback error'; }
        }
      } catch {
        if (fb) { fb.textContent = 'Bağlantı hatası.'; fb.className = 'auth-feedback error'; }
      } finally {
        if (btn) btn.style.opacity = '';
      }
    });
  }

  /* ── INTERACTIVE STAR RATINGS ─────────────── */
  document.querySelectorAll('.star-rating-interactive').forEach((widget) => {
    const stars = widget.querySelectorAll('.star-i');
    const label = widget.querySelector('.rating-label');
    const key   = widget.dataset.key;
    const saved = key ? localStorage.getItem('rating:' + key) : null;

    if (saved) {
      stars.forEach((s, i) => s.classList.toggle('active', i < Number(saved)));
      if (label) label.textContent = saved + '/5';
    }

    stars.forEach((star, idx) => {
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
      });
      star.addEventListener('mouseleave', () => {
        const cur = saved ? Number(saved) : 0;
        stars.forEach((s, i) => s.classList.toggle('active', i < cur));
      });
      star.addEventListener('click', () => {
        const val = idx + 1;
        if (key) localStorage.setItem('rating:' + key, val);
        stars.forEach((s, i) => s.classList.toggle('active', i < val));
        if (label) label.textContent = val + '/5';
        showToast(`${val} yıldız verildi ✓`, 'success');
      });
    });
  });

  /* ── ANIMATED CODE BLOCK ─────────────────── */
  const codeBlock = document.getElementById('heroCodeBlock');
  const particles = document.getElementById('hcbParticles');
  const hcbText   = document.getElementById('hcbText');

  if (codeBlock && particles) {
    const tags = [
      '<html>', '</html>', '<div>', '</div>', '<span>', '</span>',
      '<section>', '</section>', '<nav>', '</nav>', '<main>', '</main>',
      '<p>', '<a>', '<ul>', '<li>', '<img />', '<input />', '<button>',
      '{ }', '=>', '&&', '||', '===', '!==', 'const', 'let', 'async'
    ];

    function spawnParticle() {
      const el = document.createElement('span');
      el.className = 'hcb-particle';
      el.textContent = tags[Math.floor(Math.random() * tags.length)];
      const left = Math.random() * 95;
      const dur  = 3.5 + Math.random() * 4;
      const dx   = (Math.random() - 0.5) * 60;
      const rot  = (Math.random() - 0.5) * 30;
      el.style.cssText = `left:${left}%;bottom:0;animation-duration:${dur}s;animation-delay:${Math.random()*2}s;--dx:${dx}px;--rot:${rot}deg;`;
      particles.appendChild(el);
      setTimeout(() => el.remove(), (dur + 2) * 1000);
    }

    // spawn particles continuously
    const spawnLoop = setInterval(spawnParticle, 600);
    // spawn a burst on load
    for (let i = 0; i < 8; i++) setTimeout(spawnParticle, i * 200);

    // reveal text when block is visible
    if (hcbText) {
      const textObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => hcbText.classList.add('vis'), 400);
          textObs.unobserve(codeBlock);
        }
      }, { threshold: 0.3 });
      textObs.observe(codeBlock);
    }

    // clean up on page unload
    window.addEventListener('beforeunload', () => clearInterval(spawnLoop));
  }

  /* ── BLOG STAR RATINGS ────────────────────── */
  document.querySelectorAll('.blog-card-rating[data-blog-key]').forEach((widget) => {
    const stars = widget.querySelectorAll('.blog-star');
    const label = widget.querySelector('.blog-star-label');
    const key   = widget.dataset.blogKey;
    const saved = key ? localStorage.getItem('blog-rating:' + key) : null;

    if (saved) {
      stars.forEach((s, i) => s.classList.toggle('active', i < Number(saved)));
      if (label) label.textContent = saved + '/5';
    }

    stars.forEach((star, idx) => {
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
      });
      star.addEventListener('mouseleave', () => {
        const cur = saved ? Number(saved) : 0;
        stars.forEach((s, i) => s.classList.toggle('active', i < cur));
      });
      star.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = idx + 1;
        if (key) localStorage.setItem('blog-rating:' + key, val);
        stars.forEach((s, i) => s.classList.toggle('active', i < val));
        if (label) label.textContent = val + '/5';
        showToast(`${val} yıldız verildi ✓`, 'success');
      });
    });
  });

  /* ── SCROLL TO TOP ────────────────────────── */
  document.querySelectorAll('.footer-top, [data-scroll-top]').forEach((el) => {
    el.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  /* ── STATS COUNTER ANIMATION ──────────────── */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let start = null;
    const duration = 1800;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(el);
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ── TOAST ────────────────────────────────── */
  function showToast(message, type = 'info') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span class="toast-icon"></span><span class="toast-text"></span><button class="toast-close">×</button>`;
      document.body.appendChild(toast);
      toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
      });
    }
    toast.className = `toast ${type}`;
    toast.querySelector('.toast-icon').textContent = { success: '✓', error: '!', info: 'i' }[type] || 'i';
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  window.showToast = showToast;

});
