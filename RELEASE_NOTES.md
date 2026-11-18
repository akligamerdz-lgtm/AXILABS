# AXI Labs v1.27.0 — Community & NovaOS

**Release date:** 18 November 2026
**Live site:** https://axilabs.wuaze.com/
**Repository:** https://github.com/akligamerdz-lgtm/AXILABS

---

## Highlights

This release turns AXI Labs into a social workspace. Community posts now live in
Cloud Firestore and update for everyone in real time, every account gets a real
avatar, and a new People hub adds profiles, friends and direct messages. NovaOS
also gets a featured card on the Home page, and the source code is one click
away from the Updates tab.

## What's new

### Community

- Posts are stored in Firestore and streamed with `onSnapshot`, so new posts and
  counter changes appear without a refresh.
- **Likes, dislikes, replies, shares and saves**, plus a **Saved** filter.
- **Drafts** saved per account, restored automatically.
- **Images** (up to 6, auto-compressed) and **one video per post** (max 25 MB).
- Author row shows the avatar, `@username`, display name and a blue verification
  tick for admins.
- Authors can delete their own posts; admins can delete any post.

### People

- Search public profiles by display name or username.
- Send, accept and decline friend requests.
- One-to-one direct messages with unread indicators and a sidebar badge.
- Avatars in search results, requests, the friends list and chat headers.

### Avatars

- Every account always has an avatar: uploaded image, then a per-account
  default, then `images/logo.png`.
- Upload or remove an avatar in **Account settings → Avatar** (max 5 MB).
- Changes sync to the public profile and to the author's existing posts.

### Home and Updates

- **NovaOS** card on the Home page with the AXI Labs logo.
- **Source code** card in Updates linking to the GitHub repository.

### Developer tools

- Added **JSON Formatter**, **Base64 Tool** and **SHA-256 Hash**.

## Fixed

- A syntax error in `account.html` (an over-escaped regular expression) that
  broke the entire account script and avatar upload.
- Accounts without an uploaded avatar no longer show bare initials.
- Removing an avatar now falls back to the account default instead of a blank
  circle.
- `@username` now appears immediately after the avatar in community posts.

## Upgrade notes

1. Upload the updated files:
   - `index.html`
   - `account.html`
   - `people.html`
   - `sw.js` (bump `CACHE_NAME` before uploading)
2. Publish the Firestore rules for `posts`, `replies`, `users`,
   `publicProfiles`, `friendRequests` and `conversations`.
3. Publish the Storage rules for:
   - `posts/{uid}/**` — public read, owner write, max 25 MB, images and videos.
   - `avatars/{uid}/**` — public read, owner write, max 5 MB, images only.
4. Add your domain under **Firebase → Authentication → Authorized domains**.
5. Hard-refresh (`Ctrl+F5`) to clear the old service worker.

> Old posts that were stored in `localStorage` are not migrated and no longer
> appear in the feed. New posts are created directly in Firestore.

## Files changed

| File | Change |
| --- | --- |
| `index.html` | Firestore community, reactions, drafts, video upload, avatars, `@username`, NovaOS card, source code card |
| `account.html` | Avatar upload/remove, public profile sync, post author sync, regex fix |
| `people.html` | Public profile search, friends, direct messages, default avatars |
| `sw.js` | Cache version bump |
| `README.md` | New project documentation |
| `CHANGELOG.md` | New changelog |
| `RELEASE_NOTES.md` | This file |

## Checks

- `index.html`, `account.html` and `people.html` inline scripts pass
  `node --check`.
- HTML `<section>` and `<main>` tags are balanced.
- No new build step or dependency was introduced.

## Known limitations

- The live deployment cannot be tested from the development environment; the
  production site is behind a JavaScript cookie challenge.
- Videos are not included in drafts (size limit); text and images are.
- Saved posts and drafts are stored per browser, not synced across devices.
