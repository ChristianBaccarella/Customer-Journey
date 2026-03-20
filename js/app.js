/**
 * app.js — Customer Journey Map Builder
 * Handles form interaction, validation, and journey map rendering.
 */

'use strict';

/* =====================================================
   CONSTANTS
   ===================================================== */

const STAGE_NAMES = [
  'Bewusstsein / Aufmerksamkeit',
  'Überlegung / Abwägung',
  'Kauf / Entscheidung',
  'Bindung / Erfahrung',
  'Weiterempfehlung / Loyalität'
];

const STAGE_ICONS = ['🔍', '⚖️', '🛒', '💡', '📣'];

const EMOTION_LABELS = {
  1: 'Frustriert',
  2: 'Ängstlich',
  3: 'Neutral',
  4: 'Zufrieden',
  5: 'Begeistert'
};

const EMOTION_COLORS = {
  1: '#EF4444',
  2: '#F97316',
  3: '#EAB308',
  4: '#22C55E',
  5: '#06B6D4'
};

const EMOTION_BG_COLORS = {
  1: '#FEF2F2',
  2: '#FFF7ED',
  3: '#FEFCE8',
  4: '#F0FDF4',
  5: '#ECFEFF'
};

/* =====================================================
   DOM REFERENCES
   ===================================================== */

const form          = document.getElementById('journey-form');
const vizPanel      = document.getElementById('visualization');
const btnReset      = document.getElementById('btn-reset');
const btnPrint      = document.getElementById('btn-print');
const emotionChart  = document.getElementById('emotion-chart');
const journeyTimeline = document.getElementById('journey-timeline');

/* =====================================================
   EMOTION SLIDER LIVE UPDATES
   ===================================================== */

(function initSliders() {
  for (let i = 0; i < 5; i++) {
    const slider  = document.getElementById(`s${i}-emotion`);
    const display = document.getElementById(`s${i}-emotion-display`);

    if (!slider || !display) continue;

    function update(slider, display) {
      const val   = parseInt(slider.value, 10);
      const label = EMOTION_LABELS[val] || 'Neutral';
      const color = EMOTION_COLORS[val] || '#EAB308';
      display.textContent = `${val} — ${label}`;
      display.style.color = color;
    }

    // Bind with IIFE to capture correct i
    slider.addEventListener('input', (function(s, d) {
      return function() { update(s, d); };
    })(slider, display));

    update(slider, display);
  }
})();

/* =====================================================
   FORM VALIDATION
   ===================================================== */

function getFieldError(field) {
  field.classList.remove('invalid');
  const errEl = field.parentElement.querySelector('.field-error');
  if (errEl) errEl.textContent = '';

  const val = field.value.trim();

  if (field.required && !val) {
    return 'Dieses Feld ist erforderlich.';
  }

  if (field.type === 'number') {
    const num = Number(val);
    if (!val || isNaN(num) || num < 1 || num > 120) {
      return 'Bitte gib ein gültiges Alter ein (1–120).';
    }
  }

  return null;
}

function validateForm() {
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    const err = getFieldError(field);
    if (err) {
      valid = false;
      field.classList.add('invalid');
      const errEl = field.parentElement.querySelector('.field-error');
      if (errEl) errEl.textContent = err;
    }
  });

  // Focus first invalid field
  if (!valid) {
    const first = form.querySelector('.invalid');
    if (first) {
      first.focus();
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return valid;
}

// Inline validation on blur
form.querySelectorAll('[required]').forEach(field => {
  field.addEventListener('blur', () => {
    const err = getFieldError(field);
    if (err) {
      field.classList.add('invalid');
      const errEl = field.parentElement.querySelector('.field-error');
      if (errEl) errEl.textContent = err;
    }
  });
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) {
      const err = getFieldError(field);
      if (!err) {
        field.classList.remove('invalid');
        const errEl = field.parentElement.querySelector('.field-error');
        if (errEl) errEl.textContent = '';
      }
    }
  });
});

/* =====================================================
   COLLECT FORM DATA
   ===================================================== */

function collectData() {
  const data = {
    persona: {
      name:       document.getElementById('customer-name').value.trim(),
      age:        document.getElementById('customer-age').value.trim(),
      occupation: document.getElementById('customer-occupation').value.trim(),
      bio:        document.getElementById('customer-bio').value.trim(),
      goals:      document.getElementById('customer-goals').value.trim(),
      pain:       document.getElementById('customer-pain').value.trim()
    },
    stages: []
  };

  for (let i = 0; i < 5; i++) {
    data.stages.push({
      touchpoints:   document.getElementById(`s${i}-touchpoints`).value.trim(),
      actions:       document.getElementById(`s${i}-actions`).value.trim(),
      emotion:       parseInt(document.getElementById(`s${i}-emotion`).value, 10),
      channel:       document.getElementById(`s${i}-channel`).value,
      opportunities: document.getElementById(`s${i}-opportunities`).value.trim()
    });
  }

  return data;
}

/* =====================================================
   RENDER VISUALIZATION
   ===================================================== */

function renderVisualization(data) {
  renderPersonaCard(data.persona);
  renderEmotionChart(data.stages);
  renderTimeline(data.stages);

  // Subtitle
  document.getElementById('viz-subtitle').textContent =
    `Journey Map für ${data.persona.name} · Erstellt am ${_formatDate(new Date())}`;

  // Show panel
  vizPanel.classList.remove('hidden');
  vizPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Persona Card ---------- */
function renderPersonaCard(p) {
  // Avatar initials
  const initials = p.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  const avatarEl = document.getElementById('persona-avatar');
  avatarEl.textContent = initials;

  document.getElementById('persona-name').textContent  = p.name;
  document.getElementById('persona-meta').textContent  = `${p.age} Jahre alt · ${p.occupation}`;
  document.getElementById('persona-bio').textContent   = p.bio || '';
  document.getElementById('persona-goals').textContent = p.goals;
  document.getElementById('persona-pain').textContent  = p.pain;

  // Hide bio row if empty
  const bioEl = document.getElementById('persona-bio');
  bioEl.style.display = p.bio ? '' : 'none';
}

/* ---------- Emotion Chart ---------- */
function renderEmotionChart(stages) {
  const values = stages.map(s => s.emotion);
  EmotionChart.draw(emotionChart, values, STAGE_NAMES);
}

/* ---------- Journey Timeline Cards ---------- */
function renderTimeline(stages) {
  journeyTimeline.innerHTML = '';

  stages.forEach((stage, i) => {
    const color    = EMOTION_COLORS[stage.emotion]   || '#EAB308';
    const bgColor  = EMOTION_BG_COLORS[stage.emotion] || '#FEFCE8';
    const label    = EMOTION_LABELS[stage.emotion]   || 'Neutral';
    const icon     = STAGE_ICONS[i]                  || '●';
    const name     = STAGE_NAMES[i];

    const card = document.createElement('div');
    card.className = 'stage-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `Phase ${i + 1}: ${name}`);
    card.style.setProperty('--stage-color', color);

    card.innerHTML = `
      <div class="stage-card-header" style="background:${bgColor};">
        <div class="stage-card-dot" style="background:${color};">${icon}</div>
        <div class="stage-card-title">${_escape(name)}</div>
        <div class="stage-card-emotion-badge" style="background:${color};">
          ${_emotionEmoji(stage.emotion)} ${_escape(label)}
        </div>
      </div>
      <div class="stage-card-body">
        ${_detailRow('Berührungspunkte',  stage.touchpoints   || '—')}
        ${_detailRow('Kundenaktionen',    stage.actions       || '—')}
        ${_detailRow('Kanal',             stage.channel       || '—')}
        ${stage.opportunities ? _improvementRow(stage.opportunities) : ''}
      </div>
    `;

    journeyTimeline.appendChild(card);
  });
}

/* =====================================================
   HELPERS
   ===================================================== */

function _detailRow(label, value) {
  return `
    <div class="detail-row">
      <span class="detail-label">${_escape(label)}</span>
      <span class="detail-value">${_escape(value)}</span>
    </div>`;
}

function _improvementRow(value) {
  return `
    <div class="strategy-section">
      <div class="strategy-label">🎯 STRATEGISCHE OPTIONEN</div>
      <div class="strategy-value">${_escape(value)}</div>
    </div>`;
}

function _escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function _emotionEmoji(v) {
  const map = { 1: '😤', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };
  return map[v] || '😐';
}

function _formatDate(d) {
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* =====================================================
   RESET
   ===================================================== */

function resetAll() {
  form.reset();

  // Reset sliders display and re-init
  for (let i = 0; i < 5; i++) {
    const slider  = document.getElementById(`s${i}-emotion`);
    const display = document.getElementById(`s${i}-emotion-display`);
    if (slider && display) {
      slider.value    = 3;
      display.textContent = '3 — Neutral';
      display.style.color = EMOTION_COLORS[3];
    }
  }

  // Clear validation states
  form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });

  // Hide visualization
  vizPanel.classList.add('hidden');
  journeyTimeline.innerHTML = '';

  // Scroll to top of form
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =====================================================
   EVENT LISTENERS
   ===================================================== */

form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const data = collectData();
  renderVisualization(data);
});

btnReset.addEventListener('click', function() {
  if (vizPanel.classList.contains('hidden') ||
      confirm('Alle Felder zurücksetzen und die Journey Map löschen?')) {
    resetAll();
  }
});

btnPrint.addEventListener('click', function() {
  window.print();
});

// Re-render chart on window resize (debounced)
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (!vizPanel.classList.contains('hidden')) {
      const data = collectData();
      renderEmotionChart(data.stages);
    }
  }, 200);
});

/* =====================================================
   BRIEFING CARD TOGGLE
   ===================================================== */
(function initBriefingToggle() {
  const header = document.getElementById('briefing-header');
  const toggleBtn = document.getElementById('briefing-toggle');
  const body = document.getElementById('briefing-body');

  if (!header || !toggleBtn || !body) return;

  function toggle() {
    const isOpen = !body.classList.contains('hidden');
    if (isOpen) {
      body.classList.add('hidden');
      toggleBtn.textContent = 'Einblenden';
      header.setAttribute('aria-expanded', 'false');
    } else {
      body.classList.remove('hidden');
      toggleBtn.textContent = 'Ausblenden';
      header.setAttribute('aria-expanded', 'true');
    }
  }

  header.addEventListener('click', toggle);
  header.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
})();

/* =====================================================
   COPYRIGHT YEAR
   ===================================================== */
(function() {
  var el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
})();
