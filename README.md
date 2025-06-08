
# UW Smart Start Assistant – STELLA

STELLA (Smart Tracker for Engaging Leads & Launching Activity) is a Progressive Web App (PWA) designed to help Utility Warehouse (UW) partners build, organise, and manage their contact list using the FROGS framework:
- **F**riends & Family
- **R**ecreation
- **O**ccupation
- **G**eographic
- **S**ame Name

It also helps partners track performance metrics and develop consistent business-building habits.

---

## 🔧 Features

- Add contacts manually or import via CSV
- Categorise contacts using FROGS framework
- View, edit, and delete contacts
- Preview and categorise CSV contacts before importing
- Dashboard to track key metrics (appointments, invites, partners, etc.)
- Local data storage (browser-based)
- Responsive design for mobile and desktop
- Styled in UW branding (logo, colours, font)

---

## 📁 File Structure

- `index.html` — Main UI structure and tab navigation
- `style.css` — Responsive UW-branded styling
- `app.js` — Core app logic (add/delete/view contacts, UI control)
- `data.js` — Stats tracking and contact rendering
- `import.js` — CSV import and categorisation logic
- `UWLogoTP.png` — UW logo file for branding
- `favicon.ico` — (optional) STELLA branding for tab icon

---

## 📥 CSV Import Format

Prepare your CSV like this:

```
Name,Notes
John Smith,Interested in SIM cards
Jane Doe,Homeowner and open to side income
```

> During import, you'll assign a category (FROGS) to each contact in a preview step before final confirmation.

---

## 🗑️ Contact Deletion

- Each contact includes a delete button.
- Users are prompted before deletion to avoid mistakes.
- Bulk deletion features are planned for a future update.

---

## 🔐 Data Privacy

- All data is stored **locally** in the user’s browser.
- No data is shared, stored online, or accessible to others by default.

---

## 🚧 Roadmap (MVP → Full Version)

- [x] Add/View/Delete Contacts
- [x] CSV Import with FROGS categorisation
- [x] Stats tracking (total contacts, invites, etc.)
- [ ] Daily activity gamification (Duolingo-style)
- [ ] Firebase sync (multi-device/team support)
- [ ] Onboarding checklist (Fast Start guidance)
- [ ] Shareable contact insights

---

## 🤝 Acknowledgements

Built with love for the UW Partner community by Alex Cameron. STELLA is designed to make the early days of your business easier, more fun, and more productive.

