# AXI Labs

**AXI Labs** is a static, mobile-first web workspace that combines a community feed, a full PDF editor, developer utilities, account and messaging features, and the NovaOS project — all served from plain HTML, CSS and JavaScript with Firebase as the backend.

- **Live site:** https://axilabs.wuaze.com/
- **Source code:** https://github.com/akligamerdz-lgtm/AXILABS
- **Current release:** v1.27.0 — see [CHANGELOG.md](CHANGELOG.md)

---

## Contents

- [Highlights](#highlights)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Pages](#pages)
- [Local development](#local-development)
- [Firebase setup](#firebase-setup)
- [Deployment](#deployment)
- [Admin accounts](#admin-accounts)
- [Release](#release)
- [Links](#links)
- [License](#license)

---

## Highlights

- **No build step.** Every page is a self-contained HTML file with inline CSS and JavaScript. Upload and it runs.
- **Real backend, no server code.** Firebase Authentication, Firestore and Storage handle accounts, posts, reactions, friends, messages and uploads.
- **Works on mobile.** Responsive layout with a bottom navigation bar and touch-friendly controls.
- **Themes and language.** Light, Dark and Dark Blue themes plus a Google Translate widget.
- **PWA-ready.** Web app manifest and a service worker for offline fallback.

---

## Features

### Dashboard / Home

- Rotating **AXI News** panel with live auto-advance.
- Official AXI Labs trailer embed (YouTube).
- **NovaOS** feature card with the AXI Labs logo.
- Theme selector: Light, Dark, Dark Blue (persisted in the browser).
- Notifications bell with unread badge and read state.
- **AXI Assistant** chatbot (bottom-right) with commands for theme, navigation, language and animations.

### Accounts

- Firebase Authentication: **email/password** sign-in and sign-up, plus **Google** sign-in.
- Profile fields: display name, `@username`, bio, and a **public/private** profile toggle.
- **Avatar upload** (JPG, PNG, GIF or WebP, max 5 MB) stored in Firebase Storage.
- Every account always has an avatar: uploaded image first, then a per-account default, then `images/logo.png`.
- Password change and sign-out from **Account settings**.
- **Blue verification tick** for admin accounts.

### Community

- Public posts stored in **Firestore** and streamed in real time with `onSnapshot`.
- Author row shows avatar, `@username`, display name and verification tick.
- **Images** (up to 6, auto-compressed) and **one video per post** (max 25 MB).
- Animated **GIF picker** and drag-and-drop image upload.
- **Likes, dislikes, replies, shares and saves.**
  - Reactions are stored per user in `users/{uid}.postReactions`.
  - Counts (`likes`, `dislikes`, `replyCount`, `shares`) live on the post document.
  - Replies live in the `replies` subcollection.
  - Saved posts and **drafts** are kept locally per account.
- Authors can delete their own posts; admins can delete any post.

### People

- Search **public profiles** by display name or username.
- **Friend requests:** send, accept and decline.
- **Direct messages** between friends, with unread indicators and a sidebar badge.
- Avatars everywhere: search results, requests, friends list and chat header.

### PDF Studio

- Open and drag-and-drop PDFs.
- Merge, split / extract pages, delete and rotate pages.
- Watermarks and page numbers.
- PDF to images (PNG ZIP) and images to PDF.
- Optimization, metadata editing, text replacement and export.

### Developer tools

All tools run locally in the browser:

| Tool | What it does |
| --- | --- |
| Image Converter | PNG, JPEG, WebP, ICO and SVG |
| Code Minifier | Minify HTML, CSS and JS |
| Online Editor | Write HTML/CSS/JS with live preview |
| UUID Generator | Random v4 and time-ordered v7 IDs in bulk |
| JSON Formatter | Format, minify and validate JSON |
| Base64 Tool | Encode and decode Base64 text |
| SHA-256 Hash | Generate SHA-256 hashes |

### Updates

- Version history with per-release details.
- Update trailer.
- **Source code** link to the GitHub repository.

### Settings

- Language (Google Translate widget, 12+ languages).
- Theme and animation preferences.
- Account card showing the signed-in user or Guest.
- Notification controls.

### PWA

- `manifest.json` for installability.
- `sw.js` service worker: network-first with a cached `index.html` fallback.

### NovaOS

The `myos/` folder contains **NovaOS**, a small x86-64 operating system written from scratch in C and assembly, with its own build scripts and documentation. See [myos/README.md](myos/README.md).

---

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | HTML5, CSS3 (custom properties), vanilla JavaScript |
| Auth | Firebase Authentication (email/password, Google) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| PDF | PDF.js, pdf-lib, JSZip (CDN) |
| Security | Google reCAPTCHA v3 (invisible) |
| Hosting | Apache (`.htaccess` clean URLs) |
| Offline | Service worker + web app manifest |

There is **no package manager, bundler or framework**. All dependencies are loaded from CDNs.

---

## Project structure

```
.
├── index.html            # Dashboard: Home, Community, PDF Studio, Dev Tools, Updates, Settings
├── login.html            # Authentication portal (email/password + Google)
├── account.html          # Profile, avatar, password, sign out
├── people.html           # Public profile search, friends and direct messages
├── pdf-studio.html       # Standalone PDF Studio page
├── manifest.json         # Web app manifest
├── sw.js                 # Service worker (network-first with cache fallback)
├── axi-recaptcha.js      # Invisible reCAPTCHA v3 helper
├── bridge-config.js      # Optional local bridge URL
├── .htaccess             # Clean URLs (Apache mod_rewrite)
├── ads.txt
├── favicon.ico
├── images/
│   └── logo.png          # Site logo and default avatar
├── accav/
│   └── mesli.png         # Default avatar for one account
├── subcodes/             # Extra pages (typing game, store, tutorials)
└── myos/                 # NovaOS source (separate project, own README)
```

---

## Pages

| File | URL | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Main dashboard and community |
| `login.html` | `/login` | Sign in / sign up |
| `account.html` | `/account` | Profile, avatar, password |
| `people.html` | `/people` | Profiles, friends, messages |
| `pdf-studio.html` | `/pdf-studio` | Standalone PDF editor |
| `subcodes/kpfast.html` | `/subcodes/kpfast` | Typing game |
| `subcodes/kfrank.html` | `/subcodes/kfrank` | Typing leaderboard |
| `subcodes/store.html` | `/subcodes/store` | Store page |
| `subcodes/win11-tuto.html` | `/subcodes/win11-tuto` | Windows 11 tutorial |
| `subcodes/ssd_tutorial.html` | `/subcodes/ssd_tutorial` | SSD tutorial |

The `.htaccess` file redirects `/page.html` to `/page` and serves the matching HTML file internally.

---

## Local development

Because the site uses ES modules and Firebase, it must be served over HTTP (opening the files with `file://` will not work).

```bash
# Python
python -m http.server 8080

# or Node.js
npx serve .
```

Then open `http://localhost:8080`.

Firebase Authentication must allow the host you use. `localhost` is authorised by default in most Firebase projects; add other domains in **Firebase Console → Authentication → Settings → Authorized domains**.

When you change cached files, bump `CACHE_NAME` in `sw.js` (for example `axilabs-cache-v3`) so clients pick up the new version.

---

## Firebase setup

The site uses the Firebase project **`maptitan-auth`**. The web configuration is embedded in `index.html`, `login.html`, `account.html` and `people.html`:

```js
{
  apiKey: "AIzaSyA0jc64vq-l9ngcxw1wm4iE8EZluqaL3jw",
  authDomain: "maptitan-auth.firebaseapp.com",
  projectId: "maptitan-auth",
  storageBucket: "maptitan-auth.firebasestorage.app",
  messagingSenderId: "303640467724",
  appId: "1:303640467724:web:a1c048cbb835dff8dc1129"
}
```

The web API key is a public identifier; security is enforced by Firebase Security Rules and authorised domains.

### Firestore collections

| Path | Purpose |
| --- | --- |
| `posts/{postId}` | Community posts, attachments and counters |
| `posts/{postId}/replies/{replyId}` | Replies to a post |
| `users/{uid}` | Per-user data, including `postReactions` |
| `publicProfiles/{uid}` | Public profile: username, display name, bio, avatar, `public` flag |
| `friendRequests/{requestId}` | Friend requests (`fromUid`, `toUid`, `status`) |
| `conversations/{conversationId}` | Direct-message threads (`memberUids`) |
| `conversations/{conversationId}/messages/{messageId}` | Messages |

### Security rules (summary)

**Firestore**

- `posts`: public read; signed-in users create posts as themselves; authors can update; anyone signed in can update only the counter fields (`likes`, `dislikes`, `replyCount`, `shares`); authors and admins can delete.
- `posts/{id}/replies`: public read; signed-in users create replies as themselves (text 1–500 characters); authors and admins can delete.
- `users/{uid}`: owner-only read and write.
- `publicProfiles/{uid}`: public read when `public == true`; owner write.
- `friendRequests` and `conversations`: readable and writable only by the members involved.

**Storage**

- `posts/{uid}/**`: public read; owner write; files under 25 MB; images and videos only.
- `avatars/{uid}/**`: public read; owner write; images under 5 MB.

Publish both rule sets in **Firebase Console → Firestore → Rules** and **Storage → Rules**.

---

## Deployment

1. Upload the site files to your web host (the project is plain static files).
2. Keep `.htaccess` if you use Apache with `mod_rewrite` for clean URLs.
3. Add your domain to **Firebase → Authentication → Authorized domains**.
4. Bump `CACHE_NAME` in `sw.js` after deploying changes.
5. Hard-refresh (`Ctrl+F5`) to clear the old service worker and cache.

Files changed most often: `index.html`, `account.html`, `people.html`.

---

## Admin accounts

Admin emails receive the blue verification tick and can delete any community post. The list is defined in `index.html`, `account.html` and `people.html`:

```js
const ADMIN_EMAILS = [
  "adminaxi@axilabs.com",
  "mesli@axilabs.com",
  "axilabs@gmail.com"
];
```

Keep the three copies in sync when adding or removing an admin.

---

## Release

**v1.27.0 — Community & NovaOS release** (current)

- Firestore-backed community posts with real-time updates.
- Likes, dislikes, replies, shares, saves and drafts.
- Image and video attachments.
- Avatars for every account, with public profile sync.
- `@username` and verification tick on posts.
- New People hub: profile search, friend requests and direct messages.
- NovaOS card on the Home page.
- Source code link in Updates.

See [CHANGELOG.md](CHANGELOG.md) for the full history and [RELEASE_NOTES.md](RELEASE_NOTES.md) for the release notes.

---

## Links

- Live site: https://axilabs.wuaze.com/
- GitHub: https://github.com/akligamerdz-lgtm/AXILABS
- YouTube: https://www.youtube.com/@LabsCoding5

---

## License

No license has been published for this repository yet. Until one is added, the code is © AXI Labs and all rights are reserved.

If you plan to accept contributions or allow reuse, add a `LICENSE` file (for example, MIT) and update this section.
