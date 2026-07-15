/**
 * Metafield Manager — Generic / Standalone Version
 * Works on ANY Shopify theme — zero Dawn dependencies
 * Author: John Venedick Natividad
 * GitHub: https://github.com/jaynatividad1489
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. Tabs
  ───────────────────────────────────────────── */
  function initTabs() {
    const tabContainers = document.querySelectorAll('.mfg__tabs');
    tabContainers.forEach(container => {
      const tabs   = container.querySelectorAll('.mfg__tab');
      const panels = container.querySelectorAll('.mfg__panel');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab, tabs, panels));
        tab.addEventListener('keydown', (e) => {
          const list = Array.from(tabs);
          const idx  = list.indexOf(e.target);
          if (e.key === 'ArrowRight') { e.preventDefault(); const next = list[(idx + 1) % list.length]; next.focus(); activateTab(next, tabs, panels); }
          if (e.key === 'ArrowLeft')  { e.preventDefault(); const prev = list[(idx - 1 + list.length) % list.length]; prev.focus(); activateTab(prev, tabs, panels); }
          if (e.key === 'Home') { e.preventDefault(); list[0].focus(); activateTab(list[0], tabs, panels); }
          if (e.key === 'End')  { e.preventDefault(); list[list.length-1].focus(); activateTab(list[list.length-1], tabs, panels); }
        });
      });
    });
  }

  function activateTab(activeTab, tabs, panels) {
    tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => { p.classList.remove('is-active'); p.setAttribute('hidden', ''); });
    activeTab.classList.add('is-active');
    activeTab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(activeTab.getAttribute('aria-controls'));
    if (panel) { panel.classList.add('is-active'); panel.removeAttribute('hidden'); }
  }

  /* ─────────────────────────────────────────────
     2. Size Guide
  ───────────────────────────────────────────── */
  function initSizeGuides() {
    document.querySelectorAll('.mfg__size-guide').forEach(el => {
      const dataEl   = el.querySelector('#MfgSizeData');
      const head     = el.querySelector('#MfgSizeHead');
      const body     = el.querySelector('#MfgSizeBody');
      const noteEl   = el.querySelector('#MfgSizeNote');
      const unitBtns = el.querySelectorAll('.mfg__unit-btn');
      if (!dataEl) return;

      let data;
      try { data = JSON.parse(dataEl.textContent); }
      catch { el.innerHTML = '<p>Size guide data is invalid JSON.</p>'; return; }

      const rangeMin = data.range_min || 0;
      const rangeMax = data.range_max || 999;

      function render(unit) {
        const headers = (unit === 'in' && data.headers_in) ? data.headers_in : data.headers || [];
        const rows    = (unit === 'in' && data.rows_in)    ? data.rows_in    : data.rows    || [];
        const convert = unit === 'in' && !data.headers_in;

        if (head) head.innerHTML = `<tr>${headers.map(h => `<th class="mfg__size-th">${h}</th>`).join('')}</tr>`;
        if (body) body.innerHTML = rows.map(row => `
          <tr class="mfg__size-row">
            ${row.map((cell, i) => {
              const val = convert && i > 0 ? cell.replace(/(\d+\.?\d*)/g, n => (parseFloat(n)/2.54).toFixed(1)) : cell;
              return i === 0
                ? `<th class="mfg__size-td mfg__size-td--label" scope="row">${val}</th>`
                : `<td class="mfg__size-td">${val}</td>`;
            }).join('')}
          </tr>`).join('');

        if (noteEl) noteEl.textContent = data.note || '';
      }

      render('cm');

      unitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          unitBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
          render(btn.dataset.unit);
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     3. Care Instructions
  ───────────────────────────────────────────── */
  function initCare() {
    document.querySelectorAll('.mfg__care').forEach(el => {
      const list   = el.querySelector('#MfgCareList');
      const noteEl = el.querySelector('#MfgCareNote');
      if (!el.dataset.json) return;

      try {
        const data = JSON.parse(el.dataset.json);
        if (list) {
          list.innerHTML = (data.instructions || []).map(item => `
            <li class="mfg__care-item">
              <span class="mfg__care-icon" aria-hidden="true">${item.icon || '•'}</span>
              <span class="mfg__care-text">${item.label}</span>
            </li>`).join('');
        }
        if (noteEl) noteEl.textContent = data.note || '';
      } catch { console.warn('Care JSON parse error'); }
    });
  }

  /* ─────────────────────────────────────────────
     4. FAQs
  ───────────────────────────────────────────── */
  function initFAQs() {
    document.querySelectorAll('.mfg__faqs').forEach(el => {
      const list = el.querySelector('#MfgFAQsList');
      if (!el.dataset.json || !list) return;

      try {
        const data = JSON.parse(el.dataset.json);
        list.innerHTML = (data.faqs || []).map((faq, i) => `
          <details class="mfg__faq-item" id="MfgFaq-${i}">
            <summary class="mfg__faq-question">
              <span class="mfg__faq-text">${faq.question}</span>
              <svg class="mfg__faq-caret" width="14" height="9" viewBox="0 0 14 9" fill="none">
                <path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </summary>
            <div class="mfg__faq-answer"><p>${faq.answer}</p></div>
          </details>`).join('');

        // Single open
        list.querySelectorAll('details').forEach(d => {
          d.addEventListener('toggle', () => {
            if (d.open) list.querySelectorAll('details').forEach(other => { if (other !== d) other.open = false; });
          });
        });
      } catch { console.warn('FAQs JSON parse error'); }
    });
  }

  /* ─────────────────────────────────────────────
     5. Badges
  ───────────────────────────────────────────── */
  function initBadges() {
    document.querySelectorAll('.mfg__badges').forEach(el => {
      const list = el.querySelector('#MfgBadgesList');
      if (!el.dataset.json || !list) return;

      try {
        const data = JSON.parse(el.dataset.json);
        list.innerHTML = (data.badges || []).map(b => `
          <li class="mfg__badge-item">
            <span class="mfg__badge mfg__badge--${b.style || 'pill'}"
              style="background-color:${b.color || '#1a1a1a'};color:${b.text_color || '#fff'}">
              ${b.label}
            </span>
          </li>`).join('');
      } catch { console.warn('Badges JSON parse error'); }
    });
  }

  /* ─────────────────────────────────────────────
     6. Admin Tool
  ───────────────────────────────────────────── */
  const MfgAdmin = {
    el:          document.getElementById('MfgAdmin'),
    token:       null,
    shop:        null,
    products:    [],
    current:     null,
    originals:   {},
    hasUnsaved:  false,
    searchTimer: null,

    init() {
      if (!this.el) return;
      this.token = this.el.dataset.storefrontToken;
      this.shop  = this.el.dataset.shop;

      if (!this.token) {
        this.showError('Storefront API token not configured. Add it in Theme Editor settings.');
        return;
      }

      this.loadProducts();
      this.bindEvents();
    },

    bindEvents() {
      // Search
      document.getElementById('MfgAdminSearch')?.addEventListener('input', (e) => {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => this.filterList(e.target.value.trim()), 300);
      });

      // Form submit
      document.getElementById('MfgAdminForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.save();
      });

      // Reset
      document.getElementById('MfgAdminReset')?.addEventListener('click', () => {
        if (this.hasUnsaved && !confirm('Reset all unsaved changes?')) return;
        this.populate(this.originals);
      });

      // Unsaved tracking
      document.getElementById('MfgAdminForm')?.querySelectorAll('input, textarea').forEach(f => {
        f.addEventListener('input', () => { this.hasUnsaved = true; });
      });

      // Preview buttons
      document.querySelectorAll('.mfg-admin__preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const textarea = document.getElementById(btn.dataset.target);
          if (textarea) this.showPreview(textarea.value, btn.dataset.preview);
        });
      });

      document.getElementById('MfgPreviewClose')?.addEventListener('click', () => {
        document.getElementById('MfgAdminPreview')?.setAttribute('hidden', '');
      });

      // Unsaved warning
      window.addEventListener('beforeunload', (e) => {
        if (this.hasUnsaved) { e.preventDefault(); e.returnValue = ''; }
      });
    },

    async loadProducts() {
      const list = document.getElementById('MfgAdminList');
      if (list) list.setAttribute('aria-busy', 'true');

      const query = `{
        products(first: 250) {
          edges {
            node {
              id title handle
              featuredImage { url(transform:{maxWidth:120}) altText }
              metafields(identifiers:[
                {namespace:"custom",key:"specs_material"},
                {namespace:"custom",key:"specs_weight"},
                {namespace:"custom",key:"specs_dimensions"},
                {namespace:"custom",key:"specs_origin"},
                {namespace:"custom",key:"size_guide_json"},
                {namespace:"custom",key:"care_instructions_json"},
                {namespace:"custom",key:"product_faqs_json"},
                {namespace:"custom",key:"badges_json"}
              ]) { namespace key value }
            }
          }
        }
      }`;

      try {
        const res  = await this.gql(query);
        const data = await res.json();
        if (data.errors) throw new Error(data.errors[0].message);
        this.products = data.data.products.edges.map(e => e.node);
        this.renderList(this.products);
      } catch (err) {
        if (list) list.innerHTML = `<p class="mfg-admin__list-error">Failed to load: ${err.message}</p>`;
      } finally {
        if (list) list.setAttribute('aria-busy', 'false');
      }
    },

    renderList(products) {
      const list = document.getElementById('MfgAdminList');
      if (!list) return;

      if (!products.length) {
        list.innerHTML = '<p class="mfg-admin__list-empty">No products found.</p>';
        return;
      }

      list.innerHTML = products.map(p => {
        const img     = p.featuredImage?.url
          ? `<img src="${p.featuredImage.url}" alt="${p.featuredImage.altText || p.title}" width="40" height="40" loading="lazy">`
          : `<div class="mfg-admin__list-thumb-placeholder"></div>`;
        const hasMeta = (p.metafields || []).some(m => m?.value);
        return `
          <div class="mfg-admin__list-item" role="option" aria-selected="false"
            data-id="${p.id}" tabindex="0">
            <div class="mfg-admin__list-thumb">${img}</div>
            <div class="mfg-admin__list-info">
              <span class="mfg-admin__list-name">${p.title}</span>
              <span class="mfg-admin__list-badge ${hasMeta ? '' : 'mfg-admin__list-badge--empty'}">
                ${hasMeta ? 'Has data' : 'No data'}
              </span>
            </div>
          </div>`;
      }).join('');

      list.querySelectorAll('.mfg-admin__list-item').forEach(item => {
        const handler = () => {
          if (this.hasUnsaved && !confirm('Discard unsaved changes?')) return;
          const product = this.products.find(p => p.id === item.dataset.id);
          if (product) this.select(product, item);
        };
        item.addEventListener('click', handler);
        item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
      });
    },

    filterList(q) {
      const filtered = q
        ? this.products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()))
        : this.products;
      this.renderList(filtered);
    },

    select(product, itemEl) {
      document.querySelectorAll('.mfg-admin__list-item').forEach(i => {
        i.classList.remove('is-active');
        i.setAttribute('aria-selected', 'false');
      });
      itemEl.classList.add('is-active');
      itemEl.setAttribute('aria-selected', 'true');

      this.current    = product;
      this.hasUnsaved = false;

      const nameEl  = document.getElementById('MfgAdminName');
      const idEl    = document.getElementById('MfgAdminId');
      const imgEl   = document.getElementById('MfgAdminImg');

      if (nameEl) nameEl.textContent = product.title;
      if (idEl)   idEl.textContent   = `ID: ${product.id.split('/').pop()}`;
      if (imgEl && product.featuredImage) {
        imgEl.src = product.featuredImage.url;
        imgEl.alt = product.featuredImage.altText || product.title;
      }

      const mfMap = {};
      (product.metafields || []).forEach(mf => {
        if (mf) mfMap[`${mf.namespace}.${mf.key}`] = mf.value || '';
      });

      this.originals = { ...mfMap };
      this.populate(mfMap);

      document.getElementById('MfgAdminEmpty')?.setAttribute('hidden', '');
      document.getElementById('MfgAdminFormWrap')?.removeAttribute('hidden');
      document.getElementById('MfgAdminStatus')?.setAttribute('hidden', '');
      document.getElementById('MfgAdminPreview')?.setAttribute('hidden', '');
    },

    populate(values) {
      document.querySelectorAll('[data-metafield]').forEach(field => {
        field.value = values[field.dataset.metafield] || '';
      });
      this.hasUnsaved = false;
    },

    async save() {
      if (!this.current) return;

      this.setSaveLoading(true);
      document.getElementById('MfgAdminStatus')?.setAttribute('hidden', '');

      const fields     = document.querySelectorAll('[data-metafield]');
      const metafields = [];
      let hasError     = false;

      fields.forEach(field => {
        const [namespace, key] = field.dataset.metafield.split('.');
        const value = field.value.trim();

        if (field.tagName === 'TEXTAREA' && value) {
          try { JSON.parse(value); }
          catch {
            this.showError(`Invalid JSON in: ${key.replace(/_/g, ' ')}`);
            hasError = true;
          }
        }
        metafields.push({ namespace, key, value });
      });

      if (hasError) { this.setSaveLoading(false); return; }

      try {
        const mutation = `
          mutation UpdateProductMetafields($input: ProductInput!) {
            productUpdate(input: $input) {
              product { id }
              userErrors { field message }
            }
          }`;

        const variables = {
          input: {
            id: this.current.id,
            metafields: metafields.map(mf => ({
              namespace: mf.namespace,
              key: mf.key,
              value: mf.value,
              type: 'single_line_text_field'
            }))
          }
        };

        const res  = await this.gql(mutation, variables);
        const data = await res.json();

        if (data.errors?.length)                           throw new Error(data.errors[0].message);
        if (data.data?.productUpdate?.userErrors?.length)  throw new Error(data.data.productUpdate.userErrors[0].message);

        this.originals  = {};
        fields.forEach(f => { this.originals[f.dataset.metafield] = f.value.trim(); });
        this.hasUnsaved = false;
        this.showSuccess('✅ Metafields saved successfully!');

        // Update badge in list
        const item  = document.querySelector(`[data-id="${this.current.id}"]`);
        const badge = item?.querySelector('.mfg-admin__list-badge');
        if (badge) { badge.textContent = 'Has data'; badge.classList.remove('mfg-admin__list-badge--empty'); }

      } catch (err) {
        this.showError(`Failed to save: ${err.message}`);
      } finally {
        this.setSaveLoading(false);
      }
    },

    showPreview(json, type) {
      if (!json.trim()) { this.showError('Nothing to preview — field is empty.'); return; }
      let data;
      try { data = JSON.parse(json); }
      catch { this.showError('Invalid JSON — cannot preview.'); return; }

      let html = '';

      if (type === 'size-guide') {
        const { headers = [], rows = [] } = data;
        html = `<div class="mfg-admin__preview-sg">
          <table class="mfg__size-table">
            <thead><tr>${headers.map(h => `<th class="mfg__size-th">${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr class="mfg__size-row">${r.map((c,i) => i===0?`<th class="mfg__size-td mfg__size-td--label" scope="row">${c}</th>`:`<td class="mfg__size-td">${c}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
          ${data.note ? `<p class="mfg__size-note">${data.note}</p>` : ''}</div>`;
      }

      if (type === 'care') {
        const { instructions = [], note = '' } = data;
        html = `<ul class="mfg__care-list" role="list">
          ${instructions.map(i => `<li class="mfg__care-item"><span class="mfg__care-icon">${i.icon}</span><span class="mfg__care-text">${i.label}</span></li>`).join('')}
          </ul>${note ? `<p class="mfg__care-note">${note}</p>` : ''}`;
      }

      if (type === 'faqs') {
        const { faqs = [] } = data;
        html = faqs.map(f => `
          <details class="mfg__faq-item">
            <summary class="mfg__faq-question"><span class="mfg__faq-text">${f.question}</span></summary>
            <div class="mfg__faq-answer"><p>${f.answer}</p></div>
          </details>`).join('');
      }

      if (type === 'badges') {
        const { badges = [] } = data;
        html = `<ul class="mfg__badges-list" role="list">
          ${badges.map(b => `<li class="mfg__badge-item"><span class="mfg__badge mfg__badge--${b.style||'pill'}" style="background:${b.color};color:${b.text_color}">${b.label}</span></li>`).join('')}
          </ul>`;
      }

      const body    = document.getElementById('MfgPreviewBody');
      const preview = document.getElementById('MfgAdminPreview');
      if (body)    body.innerHTML = html;
      if (preview) { preview.removeAttribute('hidden'); preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    },

    setSaveLoading(on) {
      const btn     = document.getElementById('MfgAdminSave');
      const label   = btn?.querySelector('.mfg-admin__save-label');
      const spinner = btn?.querySelector('.mfg__spinner');
      if (btn) btn.disabled = on;
      label?.classList.toggle('mfg__hidden', on);
      spinner?.classList.toggle('mfg__hidden', !on);
    },

    showSuccess(msg) {
      const el = document.getElementById('MfgAdminStatus');
      if (!el) return;
      el.className = 'mfg-admin__status mfg-admin__status--success';
      el.textContent = msg;
      el.removeAttribute('hidden');
      setTimeout(() => el.setAttribute('hidden', ''), 5000);
    },

    showError(msg) {
      const el = document.getElementById('MfgAdminStatus');
      if (!el) return;
      el.className = 'mfg-admin__status mfg-admin__status--error';
      el.textContent = msg;
      el.removeAttribute('hidden');
    },

    gql(query, variables = {}) {
      return fetch(`https://${this.shop}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.token
        },
        body: JSON.stringify({ query, variables })
      });
    }
  };

  /* ─────────────────────────────────────────────
     Boot
  ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSizeGuides();
    initCare();
    initFAQs();
    initBadges();
    MfgAdmin.init();
  });

  window.MfgAdmin = MfgAdmin;

})();
