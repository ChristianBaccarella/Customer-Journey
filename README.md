# Customer Journey Map Builder

An interactive, browser-based tool that lets students fill in customer characteristics and instantly visualise a complete customer journey map — including an emotion curve, persona summary, and colour-coded stage cards.

---

## 📸 Screenshots

> Open `index.html` in your browser to see the app in action.  
> The left panel contains the input form; after clicking **Generate Journey Map**, the visualisation appears on the right (or below on smaller screens).

---

## 🚀 How to Use

1. **Clone or download** this repository.
2. Open `index.html` in any modern web browser — no server, no build tools required.
3. Fill in the **Customer Persona** details (name, age, occupation, bio).
4. Add the customer's **Goals** and **Pain Points**.
5. For each of the **5 journey stages** (Awareness → Consideration → Purchase → Retention → Advocacy), fill in:
   - Touchpoints
   - Customer Actions
   - Emotion Level (1–5 slider)
   - Channel
   - Opportunities for Improvement
6. Click **Generate Journey Map** to visualise the full journey.
7. Use the **Print / Export** button to save or print the map.
8. Use the **Reset** button to start over.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Persona Input Form** | Name, age, occupation, bio, goals, pain points |
| **5 Journey Stages** | Awareness, Consideration, Purchase, Retention, Advocacy |
| **Per-Stage Inputs** | Touchpoints, actions, emotion slider, channel, improvement opportunities |
| **Persona Summary Card** | Displayed at the top with initials avatar, goals & pain blocks |
| **Emotion Curve Chart** | Smooth canvas-drawn line chart showing the emotional arc |
| **Stage Detail Cards** | Colour-coded by emotion level (red → yellow → green/cyan) |
| **Validation** | Required-field checks with inline error messages |
| **Reset Button** | Clears all fields and the visualisation |
| **Print / Export** | Uses `window.print()` with a print-optimised stylesheet |
| **Responsive Design** | Two-column layout on desktop, single-column on mobile/tablet |
| **Smooth Animations** | Journey map fades and slides in on generation |
| **No Dependencies** | Pure HTML5, CSS3, JavaScript — no frameworks or build tools |

---

## 🗂️ File Structure

```
index.html          — Main HTML file (form + visualisation container)
css/
  styles.css        — All styles (layout, components, responsive, print)
js/
  app.js            — Form handling, validation, journey map rendering
  chart.js          — Emotion curve chart (Canvas API)
README.md           — This file
```

---

## 🎓 What Students Learn

- **Customer journey mapping** — understanding how customers move through Awareness, Consideration, Purchase, Retention, and Advocacy stages
- **Persona development** — defining a representative customer with goals and pain points
- **Touchpoint analysis** — identifying where and how customers interact with a brand
- **Emotional mapping** — visualising how customer sentiment shifts across the journey
- **Opportunity identification** — recognising where to improve the customer experience
- **HTML/CSS/JS fundamentals** — the app itself is a hands-on example of modern web development with Canvas API, CSS Grid/Flexbox, and DOM manipulation

---

## 🛠️ Tech Stack

- **HTML5** — semantic markup
- **CSS3** — CSS custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)** — vanilla JS, Canvas API for chart rendering
- **Google Fonts** — Inter typeface
