# Todo List App

A todo app I built with React 19 as part of my full-stack development coursework. It started as a simple CRUD app and grew into something I'm genuinely proud of, with a glassmorphism UI, dark/light mode, protected routes, and mobile swipe gestures.

It now talks to my own Node and Express API instead of a third-party service, so I built both sides of it. The backend lives in a separate repo and handles auth, folders, the recycle bin, bulk actions, and an admin-only analytics view.

## Live Demo

[Live Demo](https://frankangel-todo-app.vercel.app)

---

## Features

### Todos

- Add, edit, and delete todos
- Mark todos as complete or incomplete
- Filter by status (All, Active, Completed)
- Sort by created date or title
- Search with debounced input so it doesn't spam the API
- Swipe to delete on mobile
- Hover to reveal delete button on desktop

### Folders

- Create, rename, and delete folders from a modal
- Pick a folder when you add a task, or move existing ones later
- Filter the list by folder, or by everything that has no folder
- Deleting a folder leaves its tasks alone, they just end up with no folder

### Recycle bin

- Deleting a task sends it to the trash instead of wiping it
- Restore anything from the trash view
- Empty the trash when you actually want it gone, with a confirm step first

### Bulk actions

- Tick several tasks at once, or select everything on screen
- Mark them all done or not done
- Move them all into a folder
- Send them all to the trash

### Accounts

- Register with an email and password, or sign up with Google
- reCAPTCHA on the register form so bots can't spam it
- Admin accounts get an analytics page showing task activity across every user

### Everything else

- Dark/light mode toggle that saves your preference
- Protected routes that redirect you to login if you're not authenticated
- Filters live in the URL so you can share or bookmark a filtered view
- Input sanitization with DOMPurify
- Fully responsive with a bottom nav bar on mobile
- Accessible with ARIA labels, live regions, and keyboard navigation

---

## Technologies Used

| Category | Technology |
|----------|------------|
| UI Library | React 19 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite 8 |
| Input Sanitization | DOMPurify |
| Google Sign In | @react-oauth/google |
| Deployment | Vercel |

The backend is Node, Express 5, PostgreSQL, and Prisma, with JWT auth and Joi validation.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- The backend API running, either locally or deployed

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/frankangel-dev/todo-list.git
   cd todo-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root:
   ```
   VITE_TARGET=http://localhost:3000
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

   `VITE_TARGET` is wherever your backend is running. Vite proxies every `/api` request there, which keeps things same-origin so the auth cookie works.

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the dev server at `http://localhost:3001` |
| `npm run build` | Builds for production into the `dist` folder |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint |

---

## Design Decisions

**Glassmorphism UI:** I wanted the app to look different from a typical todo app. Cards, inputs, and the nav all have blur with semi-transparent backgrounds so the page background bleeds through slightly. It gives the UI a layered, frosted-glass feel without being heavy.

**Color system with CSS custom properties:** Instead of hardcoding colors everywhere, I defined a full token system in CSS (background, surface, border, accent, error, etc.) and wired them into Tailwind. Switching between light and dark mode is just toggling a `.dark` class on `<html>` and everything updates automatically.

**Dark/light mode:** The toggle saves to localStorage so your preference sticks between sessions. Light mode uses warm whites and soft grays, dark mode uses a deep navy palette. Both use the same amber accent color.

**Mobile-first layout:** I designed for small screens first and used Tailwind breakpoints to adapt for larger screens. On mobile there's a fixed bottom nav bar instead of the top nav, which feels more natural for touch use.

**useReducer for todo state:** I used useReducer instead of multiple useState calls because todos have a lot of interdependent state changes. Each action has a START, SUCCESS, and ERROR case, which made optimistic updates and rollbacks straightforward.

**URL for filters, reducer for selection:** Filters like status, folder, and the trash view are URL search params, so a filtered view is bookmarkable and survives a refresh. Bulk selection is different, it lives in the reducer, because a list of ticked task IDs is meaningless after a reload.

**Auth with an HttpOnly cookie:** The backend puts the session in a cookie JavaScript can't read, so a script on the page can't steal it. That also means the frontend can't attach it manually, which is why every fetch uses `credentials: 'include'` and lets the browser send it. Anything that changes data also sends a CSRF token in a header, since another site could trigger the cookie but can't read my localStorage.

**One context for folders:** The add form, the filter dropdown, and the bulk action bar all need the same folder list. Rather than fetching it three times, there's a FolderProvider around the todos page. It's mounted there instead of in App because nothing else in the app cares about folders.

---

## Future Improvements

- Drag and drop reordering
- PWA support for offline use
- Animations on add/remove
- Delete your account from the profile page

---

## License

MIT

---

## Contact

**Frank Angel**
- GitHub: [frankangel-dev](https://github.com/frankangel-dev)
