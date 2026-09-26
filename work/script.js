// ========== 预加载器 (and2es 风格) ==========
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  // 页面加载完成后，优雅淡出预加载器
  setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.6s ease-in-out';
      setTimeout(() => {
        preloader.style.display = 'none';
        // 预加载器消失后触发 Hero 入场动画
        triggerHeroIntro();
      }, 600);
    } else {
      triggerHeroIntro();
    }
  }, 300);
});

// 若 load 事件未触发（极快加载），备用方案
setTimeout(() => {
  if (preloader && preloader.style.display !== 'none') {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.6s ease-in-out';
    setTimeout(() => {
      preloader.style.display = 'none';
      triggerHeroIntro();
    }, 600);
  }
}, 1500);

// ========== Hero 文字错落入场动画 ==========
function triggerHeroIntro() {
  const heroEl = document.querySelector('.hero-text');
  if (!heroEl) return;
  const items = heroEl.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-desc, .hero-actions, .hero-stats');
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
  // 头像同时淡入
  const avatar = document.querySelector('.hero-avatar');
  if (avatar) {
    avatar.style.opacity = '0';
    avatar.style.transform = 'scale(0.92)';
    avatar.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        avatar.style.opacity = '1';
        avatar.style.transform = 'scale(1)';
      });
    });
  }
}

// ========== 导航栏滚动效果 ==========
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // 导航栏阴影
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // 回到顶部按钮
  if (scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }

  // 导航高亮当前 section
  highlightNav();
});

// ========== 移动端菜单切换 ==========
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// 点击导航链接后关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ========== 导航高亮 ==========
function highlightNav() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
}

// ========== 回到顶部 ==========
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== 作品筛选 ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 更新按钮状态
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    workCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
        // 优雅的淡入动画
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ========== 滚动揭示动画 (and2es 风格 - 平滑缓动) ==========
const revealElements = document.querySelectorAll(
  '.about-card, .work-card, .video-card, .xhs-card, .contact-card, .section-header, .about-bio, .social-intro'
);

revealElements.forEach(el => {
  el.classList.add('reveal');
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // 错落揭示动画
      const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 60;
      setTimeout(() => {
        entry.target.classList.add('visible');
        entry.target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      }, Math.min(delay, 300));
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => observer.observe(el));

// ========== 数字滚动动画（平滑缓动版）==========
const stats = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

stats.forEach(s => statObserver.observe(s.closest('.hero-stats') || s));

function animateStats() {
  stats.forEach(stat => {
    const targetText = stat.textContent;
    const numMatch = targetText.match(/[\d.]+/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[0]);
    const suffix = targetText.replace(numMatch[0], '');
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic 缓动
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      stat.textContent = (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ========== 平滑滚动 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ========== 页面加载完成动画 ==========
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
