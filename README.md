# Adel & Roaa — Katb Ketab Invitation

Invitation website for the Katb Ketab of **Adel & Roaa**.

- **Date:** Monday, October 5th, 2026
- **Venue:** Masjid Fadel, 6th of October City
- **Palette:** navy blue · baby blue · white · grey (silver stars)

## Run it

No dependencies needed — just Node.js. Fonts are self-hosted in
`assets/fonts/`, so the site looks identical in every browser and works
fully offline:

```bash
node server.js        # or: npm start
```

Then open `http://localhost:510`. Set `PORT` to change the port (default `510`).

## Guest wishes

Wishes are stored in `wishes.json` (created/updated automatically) and served
via `GET /api/wishes` / `POST /api/wishes`. They appear as floating bubbles in
the galaxy at the bottom of the page. Delete entries from `wishes.json` to
moderate.

## Photos

- `assets/photo-1.jpg` — the hero portrait at the top (portrait works best, ~4:5)
- `assets/photo-2.jpeg` … `assets/photo-7.jpeg` — the "Little Moments"
  swipeable carousel, shown in filename order

To add or change carousel photos, drop the file in `assets/` and add a
matching `<figure class="carousel-slide">` line in `index.html`. Portrait
photos fill the frame; landscape photos are shown in full automatically.

## Hosting behind Cloudflare Tunnel (roaa.adelsamir.com)

On the server machine, after starting `node server.js`, point the tunnel at
the local port, e.g.:

```bash
cloudflared tunnel --url http://localhost:510
```

or add an ingress rule for `roaa.adelsamir.com` → `http://localhost:510` in
your cloudflared config. Nothing in the site is tunnel-specific.

**Deploying on the server with an AI assistant?** Hand it `AGENTS.md` — it
contains step-by-step server-side instructions (run the app, keep it alive,
wire the named tunnel to `roaa.adelsamir.com`).
