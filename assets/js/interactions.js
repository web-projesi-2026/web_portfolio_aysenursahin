/* ══════════════════════════════════════════════════
   interactions.js  —  6 JS Etkileşim
   1. Dark / Light Mod  (T kısayolu + localStorage)
   2. Scroll-to-Top FAB
   3. Okuma İlerleme Çubuğu (gradient renk)
   4. Akıllı Tooltip  (touch desteği dahil)
   5. Konfeti Animasyonu
   6. Sayfa Geçiş Animasyonu
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────
     1. DARK / LIGHT MOD
     - Sayfa yüklenince localStorage'dan tercih okunur
     - Nav içine güneş/ay butonu eklenir
     - T klavye kısayoluyla da toggle edilebilir
     ───────────────────────────────────────────────── */
  const THEME_KEY = 'as-portfolio-theme';

  // Kaydedilmiş tercihi uygula (flash önlemek için hemen)
  if (localStorage.getItem(THEME_KEY) === 'light') {
    document.body.classList.add('light-mode');
  }

  // Butonu oluştur ve nav-right içine hamburgerden önce ekle
  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle-btn';
  themeBtn.setAttribute('aria-label', 'Temayı değiştir');
  themeBtn.setAttribute('data-tip', 'Dark / Light (T)');
  themeBtn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';

  const navRight  = document.querySelector('.nav-right');
  const hamburger = document.getElementById('hamburger');
  if (navRight && hamburger) {
    navRight.insertBefore(themeBtn, hamburger);
  }

  function applyTheme(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  }

  themeBtn.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('light-mode'));
  });

  // T kısayolu — input/textarea odaklıyken çalışmasın
  document.addEventListener('keydown', (e) => {
    if ((e.key === 't' || e.key === 'T') && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      applyTheme(!document.body.classList.contains('light-mode'));
    }
  });


  /* ─────────────────────────────────────────────────
     2. SCROLL-TO-TOP (footer'daki orijinal buton yeterli)
     — FAB kaldırıldı, orijinal "↑ Başa Dön" kullanılıyor
     ───────────────────────────────────────────────── */


  /* ─────────────────────────────────────────────────
     3. OKUMA İLERLEME ÇUBUĞU
     - Mevcut .scroll-progress elementine gradient uygular
     - Sayfa boyunca yüzde hesaplar
     ───────────────────────────────────────────────── */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    // CSS'te !important ile gradient verildi; JS sadece günceller
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }


  /* ─────────────────────────────────────────────────
     4. AKILLı TOOLTİP
     - data-tip="..." olan her elemana otomatik uygulanır
     - Touch cihazlarda tap ile kısa süreli gösterim
     - Eski data-tooltip elementleri de kapsanır
     ───────────────────────────────────────────────── */
  // Eski sistemle uyumluluk: data-tooltip → data-tip
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    if (!el.getAttribute('data-tip')) {
      el.setAttribute('data-tip', el.getAttribute('data-tooltip'));
    }
  });

  // Touch: tap → 1.8s göster
  let tipTimer;
  document.addEventListener('touchstart', (e) => {
    const el = e.target.closest('[data-tip]');
    clearTimeout(tipTimer);
    document.querySelectorAll('[data-tip].tip-touch').forEach(x => x.classList.remove('tip-touch'));
    if (el) {
      el.classList.add('tip-touch');
      tipTimer = setTimeout(() => el.classList.remove('tip-touch'), 1800);
    }
  }, { passive: true });

  // touch-active tooltip stili (CSS pseudo-element yetersiz kalırsa)
  const tipStyle = document.createElement('style');
  tipStyle.textContent = `[data-tip].tip-touch::after { opacity:1; transform:translateX(-50%) translateY(0); }`;
  document.head.appendChild(tipStyle);


  /* ─────────────────────────────────────────────────
     5. KONFETİ ANİMASYONU
     - CTA bölümüne veya footer logo'ya "🎉 Kutla!" butonu eklenir
     - Her tıklamada 80 renkli parçacık saçılır
     ───────────────────────────────────────────────── */
  const CONFETTI_COLORS = [
    '#e5395e','#7c44f5','#a46fff','#2dd4bf',
    '#fbbf24','#4499ff','#34d399','#ff6b9d','#c49dff'
  ];

  function launchConfetti(originX, originY) {
    const count = 90;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';

      const color   = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const fallY   = (220 + Math.random() * 340) + 'px';
      const driftX  = ((Math.random() - 0.5) * 280) + 'px';
      const spin    = (Math.random() * 720 - 360) + 'deg';
      const dur     = (0.8 + Math.random() * 1.1).toFixed(2) + 's';
      const delay   = (Math.random() * 0.35).toFixed(2) + 's';
      const size    = (7 + Math.random() * 7) + 'px';
      const shape   = Math.random() > 0.5 ? '50%' : '2px';

      el.style.cssText = `
        left: ${originX}px;
        top:  ${originY}px;
        background: ${color};
        width: ${size};
        height: ${size};
        border-radius: ${shape};
        --fall-y: ${fallY};
        --drift-x: ${driftX};
        --spin: ${spin};
        animation-duration: ${dur};
        animation-delay: ${delay};
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (parseFloat(dur) + parseFloat(delay) + 0.2) * 1000);
    }
  }

  // Konfeti butonunu bul ve ekle
  // Önce CTA section'ına, yoksa footer'a ekle
  const ctaInner  = document.querySelector('.cta-inner');
  const footerInner = document.querySelector('.footer-inner');
  const confettiTarget = ctaInner || footerInner;

  if (confettiTarget) {
    const confettiBtn = document.createElement('button');
    confettiBtn.className = 'confetti-btn';
    confettiBtn.setAttribute('data-tip', 'Kutla! 🎉');
    confettiBtn.innerHTML = '🎉 Kutla!';
    confettiTarget.appendChild(confettiBtn);

    confettiBtn.addEventListener('click', (e) => {
      const rect = confettiBtn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      launchConfetti(cx, cy);
    });
  }

  // Ayrıca footer logo'ya da çift tıkta konfeti
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    footerLogo.setAttribute('data-tip', '2x tıkla 🎉');
    footerLogo.style.cursor = 'pointer';
    footerLogo.addEventListener('dblclick', (e) => {
      const rect = footerLogo.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }


  /* ─────────────────────────────────────────────────
     6. SAYFA GEÇİŞ ANİMASYONU
     - Siteye ait linklere tıklanınca overlay fade-in
     - Yeni sayfa yüklenince fade-out
     ───────────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  // Giriş: sayfa yüklenince overlay fade-out
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity .35s ease';
      overlay.classList.remove('active');
    });
  });

  // Çıkış: dahili linklere tıklanınca overlay fade-in, sonra navigate
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Dış link, #anchor, javascript:, mailto: atla
    if (!href || href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto') || href.startsWith('javascript') ||
        link.target === '_blank') return;

    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 320);
  });


  /* ═══════════════════════════════════════════════════
     YENİ 6 ETKİLEŞİM
     ═══════════════════════════════════════════════════ */

  /* ─────────────────────────────────────────────────
     7. YAZI YAZMA EFEKTİ (Typing Animation)
     - hero-desc paragrafının metnini siler, harf harf yazar
     - Yazma bittikten sonra imleç yanıp söner
     ───────────────────────────────────────────────── */
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    const originalText = heroDesc.textContent.trim();
    heroDesc.textContent = '';

    // İmleç oluştur
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    heroDesc.appendChild(cursor);

    let charIndex = 0;
    let typingStarted = false;

    const typeChar = () => {
      if (charIndex < originalText.length) {
        heroDesc.insertBefore(document.createTextNode(originalText[charIndex]), cursor);
        charIndex++;
        setTimeout(typeChar, 28 + Math.random() * 18);
      } else {
        cursor.classList.add('done');
      }
    };

    // Element görünür olunca başla
    const typingObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !typingStarted) {
        typingStarted = true;
        setTimeout(typeChar, 600);
        typingObs.disconnect();
      }
    }, { threshold: 0.4 });
    typingObs.observe(heroDesc);
  }


  /* ─────────────────────────────────────────────────
     8. 3D TILT EFEKTİ (Kart Hover)
     - .project-card-new, .reel-card, .blog-card
       üzerinde fareyi hareket ettirince 3D döner
     - Mouse ayrılınca sıfırlanır
     ───────────────────────────────────────────────── */
  const tiltTargets = document.querySelectorAll('.project-card-new, .reel-card.featured, .blog-card, .contact-card');

  tiltTargets.forEach(card => {
    card.style.transition = 'transform .15s ease, box-shadow .15s ease';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 … 1
      const dy     = (e.clientY - cy) / (rect.height / 2);  // -1 … 1
      const rotX   = (-dy * 9).toFixed(2);
      const rotY   = ( dx * 9).toFixed(2);
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.style.boxShadow = `${-dx*14}px ${-dy*14}px 40px rgba(124,68,245,.28)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.boxShadow = '';
    });
  });


  /* ─────────────────────────────────────────────────
     9. BİLDİRİM / DUYURU BANNERI
     - Sayfa üstünde ince bir duyuru çubuğu çıkar
     - X ile kapatılabilir, localStorage'da hatırlanır
     ───────────────────────────────────────────────── */
  const BANNER_KEY = 'as-banner-closed-v1';

  if (!localStorage.getItem(BANNER_KEY)) {
    const banner = document.createElement('div');
    banner.className = 'announce-banner';
    banner.innerHTML = `
      <span class="announce-dot"></span>
      <span class="announce-text">🚀 Portfolyo sitesi aktif olarak güncellenmektedir — yeni projeler ekleniyor!</span>
      <button class="announce-close" aria-label="Kapat">×</button>
    `;
    document.body.prepend(banner);

    // Nav'ı aşağı it
    const nav = document.getElementById('nav');
    if (nav) nav.style.top = '40px';

    banner.querySelector('.announce-close').addEventListener('click', () => {
      banner.classList.add('hide');
      if (nav) nav.style.top = '';
      setTimeout(() => banner.remove(), 350);
      localStorage.setItem(BANNER_KEY, '1');
    });

    setTimeout(() => banner.classList.add('show'), 100);
  }


  /* ─────────────────────────────────────────────────
     10. FARE IŞIK HUZMESİ (Dark mode spotlight)
     - Karanlık modda fareyi takip eden ışık hüzmesi
     - Light modda otomatik devre dışı
     ───────────────────────────────────────────────── */
  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  document.body.appendChild(spotlight);

  let spotX = window.innerWidth  / 2;
  let spotY = window.innerHeight / 2;
  let curX  = spotX, curY = spotY;
  let spotActive = false;

  document.addEventListener('mousemove', (e) => {
    spotX = e.clientX;
    spotY = e.clientY;
    if (!spotActive) {
      spotActive = true;
      spotlight.classList.add('visible');
    }
  });

  // Smooth follow
  (function animateSpot() {
    curX += (spotX - curX) * 0.08;
    curY += (spotY - curY) * 0.08;
    spotlight.style.left = curX + 'px';
    spotlight.style.top  = curY + 'px';
    // Light modda gizle
    spotlight.style.opacity = document.body.classList.contains('light-mode') ? '0' : '';
    requestAnimationFrame(animateSpot);
  })();


  /* ─────────────────────────────────────────────────
     11. SMOOTH SCROLL + AKTİF MENÜ TAKİBİ
     - Sayfayı kaydırırken hangi section'daysa
       nav linkini aktif olarak işaretler
     - Sadece index.html'de çalışır (section'lar burada)
     ───────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], section[class]');

  if (sections.length > 0) {
    // Section'lara id yoksa class'tan id üret
    const sectionMap = [];
    document.querySelectorAll('section').forEach((sec, i) => {
      if (!sec.id) {
        const cls = [...sec.classList].find(c => c.startsWith('section-') || c === 'hero');
        if (cls) { sec.id = cls; }
      }
      if (sec.id) sectionMap.push(sec);
    });

    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('section-active'));
          // Sadece tam eşleşen değil, hero için de ana sayfa aktif kalsın
          const matched = [...navLinks].find(a => {
            const href = a.getAttribute('href') || '';
            return href.includes(entry.target.id) ||
                   (entry.target.classList.contains('hero') && (href.endsWith('index.html') || href === './'));
          });
          if (matched) matched.classList.add('section-active');
        }
      });
    }, { threshold: 0.35 });

    sectionMap.forEach(sec => sectionObs.observe(sec));
  }


  /* ─────────────────────────────────────────────────
     12. GÖRÜNTÜ / KART LAZY ZOOM EFEKTİ
     - .pc-poster, .reel-poster elementleri
       viewport'a girince scale(1.06) zoom yapar
     - Smooth CSS transition ile
     ───────────────────────────────────────────────── */
  const zoomTargets = document.querySelectorAll('.pc-poster, .reel-poster');

  zoomTargets.forEach(el => {
    el.style.transition = 'transform .6s cubic-bezier(.25,.8,.25,1)';
    el.style.transform  = 'scale(1)';
    el.style.overflow   = 'hidden';

    const zoomObs = new IntersectionObserver(([entry]) => {
      el.style.transform = entry.isIntersecting ? 'scale(1.06)' : 'scale(1)';
    }, { threshold: 0.25 });

    zoomObs.observe(el);
  });

});
