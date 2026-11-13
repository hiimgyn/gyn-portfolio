# Gyn Nguyen Portfolio

Personal portfolio of Gyn Nguyen, Business Analyst with an engineering background. Built with Vue 3, Vite, Tailwind CSS 4, three.js and GSAP, in the same always-dark visual style as the rest of the hiimgyn ecosystem (GPM Hub, the hub site).

---

## 🚀 Features

- **Home**: hero over a fixed full-screen three.js particle scene that morphs on scroll from a BPMN process (start event, tasks, exclusive gateway, end event) to a layered system diagram to a globe. Reduced-motion and no-WebGL fallbacks.
- **How I work**: BPMN process modelling, system decomposition, requirements, data modelling, delivery/UAT.
- **Projects**: ReLightHost, Animal Survivor, GFGames, GPM Hub (real screenshots), viet-hoa-game (AI game-localisation ruleset, private repo) and a VBook extension pack, each in a window-frame preview.
- **About**: profile, a sample user story with Gherkin criteria, toolkit, career timeline and earlier case studies.
- **Tetris Lab**: Zen, Training (T-spin lessons) and Boss modes with SRS rotation.
- **Contact** page and English / Vietnamese localisation.

---

## 🛠️ Tech Stack

- **Vue 3 (Composition API)** + **Vite 6** + **vue-router**
- **Tailwind CSS 4**, SVN-Gilroy display headings, Geist body
- **three.js** for the background scene (one Points draw call, morph in the vertex shader)
- **vue-i18n** for English and Vietnamese
- **GSAP** for the hero entrance
- **@heroicons/vue** for icons

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/hiimgyn/gyn-portfolio.git
cd gyn-portfolio

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```
