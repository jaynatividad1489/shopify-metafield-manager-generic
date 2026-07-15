# 🗂️ Shopify Metafield Manager — Generic Edition

> A two-part Metafield Manager that works on **ANY Shopify theme** — beautiful storefront display sections + a merchant-friendly admin edit tool. Zero Dawn dependencies, fully self-contained.

![Shopify](https://img.shields.io/badge/Shopify-Any_Theme-96BF48?style=flat-square&logo=shopify&logoColor=white)
![Liquid](https://img.shields.io/badge/Liquid-Templating-0090D6?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Accessible](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🎯 Why This Exists

Shopify's native metafield editing requires navigating deep into Admin → Products → Metafields — confusing for non-technical merchants. And displaying that data beautifully on the storefront requires custom code every time.

This Generic edition solves both problems for **any Shopify theme** — no Dawn required.

---

## ✨ Features

### 🛍️ Storefront Display
- Tabbed interface grouping all metafield data
- Product Specs table with emoji icons
- Size Guide with cm ↔ in unit toggle
- Care Instructions icon grid
- Product FAQ accordion
- Custom Badges (pill + ribbon styles)
- Sections auto-hide when metafield is empty
- Keyboard accessible tabs (← → Home End)
- CSS design tokens for easy theming

### 🔧 Admin Edit Tool
- Product list via Storefront API
- Search products by name
- Load + edit all metafields in one form
- JSON Preview before saving
- Save via Storefront API
- Reset to last saved values
- Unsaved changes warning
- Success / error feedback

---

## 📁 File Structure

```
generic/
│
├── sections/
│   ├── product-metafields-generic.liquid   ← Storefront display
│   └── metafield-admin-generic.liquid      ← Admin edit tool
│
└── assets/
    ├── metafield-manager-generic.js        ← All logic
    └── metafield-manager-generic.css       ← Self-contained styles
```

---

## 📦 Metafield Namespaces & Keys

| Metafield | Type | Example |
|---|---|---|
| `custom.specs_material` | String | `100% Organic Cotton` |
| `custom.specs_weight` | String | `250g` |
| `custom.specs_dimensions` | String | `30cm x 20cm x 5cm` |
| `custom.specs_origin` | String | `Made in Portugal` |
| `custom.size_guide_json` | JSON String | See below |
| `custom.care_instructions_json` | JSON String | See below |
| `custom.product_faqs_json` | JSON String | See below |
| `custom.badges_json` | JSON String | See below |

---

## 📋 JSON Formats

### Size Guide
```json
{
  "headers": ["Size", "Chest (cm)", "Waist (cm)"],
  "rows": [
    ["S", "84-88", "66-70"],
    ["M", "88-92", "70-74"],
    ["L", "92-96", "74-78"]
  ],
  "note": "Measurements in centimeters. Size up if in doubt."
}
```

### Care Instructions
```json
{
  "instructions": [
    { "icon": "🌡️", "label": "Machine wash at 30°C" },
    { "icon": "🚫", "label": "Do not bleach" },
    { "icon": "👗", "label": "Tumble dry low heat" }
  ],
  "note": "Always check the garment label before washing."
}
```

### Product FAQs
```json
{
  "faqs": [
    {
      "question": "Is this suitable for sensitive skin?",
      "answer": "Yes, dermatologically tested and free from parabens."
    },
    {
      "question": "What is the shelf life?",
      "answer": "24 months from the date of manufacture."
    }
  ]
}
```

### Custom Badges
```json
{
  "badges": [
    { "label": "New Arrival",  "style": "pill",   "color": "#22c55e", "text_color": "#ffffff" },
    { "label": "Eco Friendly", "style": "pill",   "color": "#16a34a", "text_color": "#ffffff" },
    { "label": "Best Seller",  "style": "ribbon", "color": "#dc2626", "text_color": "#ffffff" }
  ]
}
```

---

## 🚀 Installation

### Step 1 — Upload files

In **Online Store → Themes → Edit Code:**

```
sections/ → product-metafields-generic.liquid
sections/ → metafield-admin-generic.liquid
assets/   → metafield-manager-generic.js
assets/   → metafield-manager-generic.css
```

### Step 2 — Create Metafield Definitions

In Shopify Admin → **Settings → Custom data → Products**, create:
- `custom.specs_material` — Single line text
- `custom.specs_weight` — Single line text
- `custom.specs_dimensions` — Single line text
- `custom.specs_origin` — Single line text
- `custom.size_guide_json` — Single line text (JSON)
- `custom.care_instructions_json` — Single line text (JSON)
- `custom.product_faqs_json` — Single line text (JSON)
- `custom.badges_json` — Single line text (JSON)

### Step 3 — Add to Product Page

In Theme Editor → Product page → **Add section → Product Metafields (Generic)**

### Step 4 — Set Up Admin Tool

1. Get Storefront API token: Admin → Apps → Develop Apps → API credentials
2. Create a **Page** in Shopify Admin (e.g. "Metafield Manager")
3. Assign template `page.metafield-admin-generic`
4. In Theme Editor → add **Metafield Admin (Generic)** section → paste token
5. **Restrict access** to staff only

### Step 5 — Customize Design Tokens

Open `metafield-manager-generic.css` and update the CSS variables:

```css
:root {
  --mfg-bg:          #ffffff;   /* Background color */
  --mfg-text:        #1a1a1a;   /* Primary text */
  --mfg-text-muted:  #6b7280;   /* Secondary text */
  --mfg-border:      #e5e7eb;   /* Borders */
  --mfg-accent:      #1a1a1a;   /* Buttons, active tabs */
  --mfg-accent-text: #ffffff;   /* Text on accent buttons */
  --mfg-radius:      0.6rem;    /* Border radius */
  --mfg-font:        inherit;   /* Inherits from your theme */
}
```

---

## 🆚 Generic vs Dawn Edition

| Feature | Generic | Dawn |
|---|---|---|
| Works on any theme | ✅ | ❌ Dawn only |
| Zero theme dependencies | ✅ | ❌ |
| CSS design tokens | ✅ | ❌ |
| Uses Dawn CSS custom properties | ❌ | ✅ |
| Uses Dawn Web Components pattern | ❌ | ✅ |
| Color scheme picker | ❌ | ✅ |
| Dawn visual match | ❌ | ✅ |

> **Which should I use?**
> Running Dawn? → **Dawn Edition**. Any other theme? → **Generic Edition**

---

## 🧪 Edge Cases Handled

| Scenario | Behavior |
|---|---|
| Empty metafield | Tab / section hidden entirely |
| Invalid JSON in textarea | Error shown before save |
| No products in API | Empty state message |
| Network error on save | Error status with details |
| Unsaved changes + switch product | Confirm dialog |
| Unsaved changes + page close | Browser beforeunload warning |
| Size guide — no imperial data | Auto-converts cm → in |
| FAQs — single open mode | Previous item closes on open |
| Token not configured | Clear setup instructions shown |

---

## 🔌 JavaScript API

```javascript
// Access the admin tool globally
window.MfgAdmin.loadProducts();
window.MfgAdmin.save();
window.MfgAdmin.showError('Something went wrong');
window.MfgAdmin.showSuccess('Saved!');
```

---

## 👤 Author

**John Venedick Natividad**
Senior Shopify Developer & CRM Implementation Specialist
14+ years building eCommerce experiences for global brands

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jaynatividad)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/jaynatividad1489)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:jaynatividad1489@gmail.com)

---

## 📄 License

MIT — free to use in personal and commercial Shopify projects.
If this helped you, a ⭐ star on the repo is always appreciated!
