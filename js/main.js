// =============================================
//  Syed Farooq Israr — Portfolio JS
// =============================================

// ---- Navbar scroll shadow ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// ---- Mobile Nav Toggle ----
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
    closeMobileNav();
  }
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ---- Scroll Reveal ----
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Hero photo fallback ----
const heroPhoto = document.getElementById('heroPhoto');
const heroPlaceholder = document.getElementById('heroPlaceholder');
if (heroPhoto) {
  const checkPhoto = () => {
    if (!heroPhoto.complete || heroPhoto.naturalWidth === 0) {
      heroPhoto.style.display = 'none';
      if (heroPlaceholder) heroPlaceholder.style.display = 'flex';
    } else {
      if (heroPlaceholder) heroPlaceholder.style.display = 'none';
    }
  };
  heroPhoto.addEventListener('error', () => {
    heroPhoto.style.display = 'none';
    if (heroPlaceholder) heroPlaceholder.style.display = 'flex';
  });
  heroPhoto.addEventListener('load', checkPhoto);
  checkPhoto();
}

// =============================================
//  PROJECT MODAL
// =============================================

const projectData = JSON.parse(
  document.getElementById('project-data').textContent
);

let currentSlide = 0;
let totalSlides   = 0;

function openModal(id) {
  const project = projectData[id];
  if (!project) return;
  currentSlide = 0;

  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDesc').textContent  = project.desc;

  const slidesEl = document.getElementById('modalSlides');
  const dotsEl   = document.getElementById('slideDots');
  slidesEl.innerHTML = '';
  dotsEl.innerHTML   = '';
  totalSlides = project.images.length;
  document.getElementById('modalSlider').style.display = totalSlides ? '' : 'none';

  project.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src   = src;
    img.alt   = project.title + ' screenshot ' + (i + 1);
    img.className = 'modal-slide';
    img.onerror = function () {
      img.remove();
      if (dot) dot.remove();
      totalSlides = slidesEl.children.length;
      document.getElementById('modalSlider').style.display = totalSlides ? '' : 'none';
      document.getElementById('slidePrev').style.display = totalSlides > 1 ? 'flex' : 'none';
      document.getElementById('slideNext').style.display = totalSlides > 1 ? 'flex' : 'none';
      goToSlide(0);
    };
    slidesEl.appendChild(img);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick   = () => goToSlide(i);
    dotsEl.appendChild(dot);
  });

  document.getElementById('slidePrev').style.display = totalSlides > 1 ? 'flex' : 'none';
  document.getElementById('slideNext').style.display = totalSlides > 1 ? 'flex' : 'none';

  document.getElementById('modalFeatures').innerHTML = project.features.map(f => `
    <div class="modal-feature-item">
      <span class="feature-icon">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="#1a56db" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      ${f}
    </div>`).join('');

  document.getElementById('modalTags').innerHTML =
    project.tags.map(t => `<span class="tag">${t}</span>`).join('');
  addLogos(document.getElementById('modalTags'));

  const linksEl = document.getElementById('modalLinks');
  linksEl.innerHTML = '';
  if (project.github) {
    const a = document.createElement('a');
    a.href = project.github; a.target = '_blank'; a.className = 'btn-outline';
    a.innerHTML = `<i class="fab fa-github"></i> GitHub`;
    linksEl.appendChild(a);
  }
  if (project.live) {
    const a = document.createElement('a');
    a.href = project.live; a.target = '_blank'; a.className = 'btn-primary';
    a.innerHTML = `<i class="${project.liveLabel === 'Google Play' ? 'fab fa-google-play' : 'fas fa-external-link-alt'}"></i> ${project.liveLabel || 'Live Demo'}`;
    linksEl.appendChild(a);
  }

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeEduModal(); }
});

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  document.getElementById('modalSlides').style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('#slideDots .dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
}

// =============================================
//  EDUCATION MODAL
// =============================================

const eduData = JSON.parse(
  document.getElementById('edu-data').textContent
);

let currentEduDocs = [];
let currentEduTab  = 0;

function openEduModal(id) {
  const edu = eduData[id];
  if (!edu) return;

  document.getElementById('eduModalTitle').textContent = edu.title;
  document.getElementById('eduModalSub').textContent   = edu.sub;
  document.getElementById('eduModalIcon').innerHTML    = `<i class="${edu.icon}"></i>`;

  currentEduDocs = edu.docs || [];
  currentEduTab  = 0;

  const tabsEl = document.getElementById('eduModalTabs');
  tabsEl.innerHTML = '';

  if (currentEduDocs.length === 0) {
    tabsEl.innerHTML = '<span style="font-size:13px;color:var(--text-muted);padding:12px 0;display:inline-block">No documents available yet.</span>';
  } else {
    currentEduDocs.forEach((doc, i) => {
      const btn = document.createElement('button');
      btn.className   = 'edu-tab-btn' + (i === 0 ? ' active' : '');
      btn.textContent = doc.label;
      btn.onclick     = () => switchEduTab(i);
      tabsEl.appendChild(btn);
    });
  }

  renderEduDoc(0);
  document.getElementById('eduModalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchEduTab(idx) {
  currentEduTab = idx;
  document.querySelectorAll('.edu-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });
  renderEduDoc(idx);
}

function renderEduDoc(idx) {
  const previewEl = document.getElementById('eduDocPreview');
  const actionsEl = document.getElementById('eduDocActions');
  previewEl.innerHTML = '';
  actionsEl.innerHTML = '';

  if (!currentEduDocs.length || !currentEduDocs[idx]) {
    previewEl.innerHTML = `
      <div class="edu-doc-placeholder">
        <i class="fas fa-folder-open"></i>
        <p>No documents available</p>
      </div>`;
    return;
  }

  const doc = currentEduDocs[idx];

  if (doc.type === 'image') {
    const img = document.createElement('img');
    img.src = doc.file;
    img.alt = doc.label;
    img.onerror = () => {
      previewEl.innerHTML = `
        <div class="edu-doc-placeholder">
          <i class="fas fa-image"></i>
          <p>Image not found</p>
          <code>${doc.file}</code>
        </div>`;
    };
    previewEl.appendChild(img);
  } else if (doc.type === 'pdf') {
    const iframe = document.createElement('iframe');
    iframe.src   = doc.file + '#toolbar=0&navpanes=0&view=FitH';
    iframe.title = doc.label;
    previewEl.appendChild(iframe);
  }

  const downloadBtn = document.createElement('a');
  downloadBtn.href = doc.file; downloadBtn.download = '';
  downloadBtn.className = 'btn-outline';
  downloadBtn.style.cssText = 'font-size:13px;padding:7px 16px;';
  downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;

  const openBtn = document.createElement('a');
  openBtn.href = doc.file; openBtn.target = '_blank';
  openBtn.className = 'btn-primary';
  openBtn.style.cssText = 'font-size:13px;padding:7px 16px;';
  openBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> Open`;

  actionsEl.appendChild(downloadBtn);
  actionsEl.appendChild(openBtn);
}

function closeEduModal() {
  document.getElementById('eduModalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// =============================================
//  KEYBOARD ACCESS: Enter / Space opens a project card
// =============================================
document.querySelectorAll('.project-card[role="button"]').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});


// =============================================
//  TECH LOGOS (Simple Icons CDN; hidden if a logo is missing)
// =============================================
const LOGOS = {
  'Flutter':'flutter','Dart':'dart','Firebase':'firebase','Firestore':'firebase','Crashlytics':'firebase',
  'Supabase':'supabase','Python':'python','Git & GitHub':'github','Google Play':'googleplay',
  'Play Store Release':'googleplay','Android':'android','Drift':'sqlite','Drift / SQLite':'sqlite',
  'n8n':'n8n','Gemini API':'googlegemini','Google AI Studio':'googlegemini','Hugging Face':'huggingface',
  'OpenStreetMap':'openstreetmap','PySide6':'qt','SymPy':'sympy','Groq':'groq','Groq API':'groq','Groq AI':'groq'
};
function addLogos(root) {
  (root || document).querySelectorAll('.tag, .skill-tag').forEach(el => {
    if (el.dataset.logo) return;
    el.dataset.logo = '1';
    const slug = LOGOS[el.textContent.trim()];
    if (!slug) return;
    const img = new Image();
    img.src = 'https://cdn.simpleicons.org/' + slug;
    img.alt = ''; img.width = 14; img.height = 14;
    img.onerror = () => img.remove();
    el.prepend(img);
  });
}
addLogos();