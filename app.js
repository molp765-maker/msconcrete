const galleryImages = [
  { src:'images/image_0.jpg', alt:'Curved rural driveway pour', category:'Residential' },
  { src:'images/image_1.jpeg', alt:'Driveway apron finish beside home', category:'Residential' },
  { src:'images/image_2.jpg', alt:'Backyard concrete path along fence line', category:'Residential' },
  { src:'images/image_3.jpg', alt:'Large backyard slab pour', category:'Residential' },
  { src:'images/image_4.jpg', alt:'Commercial building entrance footpath', category:'Commercial' },
  { src:'images/image_5.jpg', alt:'Commercial forecourt pour between buildings', category:'Commercial' },
  { src:'images/image_6.jpg', alt:'Exposed aggregate footpath along boundary fence', category:'Infrastructure' },
  { src:'images/image_7.jpg', alt:'Covered walkway with exposed aggregate finish', category:'Commercial' },
  { src:'images/image_8.jpg', alt:'Interior slab finish', category:'Commercial' },
  { src:'images/image_9.jpg', alt:'Curving pathway along fence line', category:'Infrastructure' },
  { src:'images/image_10.jpg', alt:'Commercial precinct pathway with garden bed', category:'Commercial' },
  { src:'images/image_11.jpg', alt:'Accessibility tactile paving detail', category:'Infrastructure' },
];

const page = {
  nav: document.getElementById('mainNav'),
  navToggle: document.getElementById('navToggle'),
  mobileMenu: document.getElementById('mobileMenu'),
  galleryGrid: document.getElementById('galleryGrid'),

  closeMobileMenu() {
    page.navToggle.classList.remove('open');
    page.mobileMenu.classList.remove('open');
    page.navToggle.setAttribute('aria-expanded', 'false');
    page.mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  },

  openLightbox(item, trigger) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', `${item.category}: ${item.alt}`);
    box.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image">&times;</button>
      <img src="${item.src}" alt="${item.alt}">
      <div class="lightbox-cap">${item.category} — ${item.alt}</div>
    `;
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => box.classList.add('show'));

    const close = () => {
      box.classList.remove('show');
      setTimeout(() => box.remove(), 300);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      trigger?.focus();
    };
    const onKey = event => { if (event.key === 'Escape') close(); };

    box.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    box.querySelector('.lightbox-close').focus();
  },

  initGallery() {
    page.galleryGrid.innerHTML = galleryImages.map((item, index) => `
      <button class="gallery-item reveal delay-${(index % 4) + 1}" type="button" aria-label="View ${item.category} project: ${item.alt}">
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
        <span class="gallery-overlay"></span>
        <span class="gallery-cat">${item.category}</span>
      </button>
    `).join('');

    page.galleryGrid.addEventListener('click', event => {
      const item = event.target.closest('.gallery-item');
      if (!item) return;
      page.openLightbox(galleryImages[[...page.galleryGrid.children].indexOf(item)], item);
    });
  },

  init() {
    page.initGallery();
    window.addEventListener('scroll', () => {
      page.nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    page.navToggle.addEventListener('click', () => {
      const isOpen = page.mobileMenu.classList.toggle('open');
      page.navToggle.classList.toggle('open', isOpen);
      page.navToggle.setAttribute('aria-expanded', String(isOpen));
      page.mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    page.mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', page.closeMobileMenu);
    });
    document.getElementById('mobileMenuClose').addEventListener('click', page.closeMobileMenu);
    page.mobileMenu.addEventListener('click', event => {
      if (event.target === page.mobileMenu) page.closeMobileMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && page.mobileMenu.classList.contains('open')) {
        page.closeMobileMenu();
        page.navToggle.focus();
      }
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('vis');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  },
};

page.init();
