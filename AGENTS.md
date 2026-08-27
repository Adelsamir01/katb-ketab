# AGENTS.md — server-side deployment guide

This file is written for an AI worker/agent operating **on the server PC**
where this repo is cloned. Follow it to run the site and expose it through
Cloudflare Tunnel as `roaa.adelsamir.com`.

## Project overview

- Zero-dependency **Node.js** app. No `npm install` is needed.
- `server.js` serves the static site and a small wishes API
  (`GET/POST /api/wishes`, persisted to `wishes.json`).
- Requires **Node 18+** (check with `node -v`).
- The app listens on **port 510** by default (`PORT` env overrides).

## Step 1 — Clone and run

```bash
git clone https://github.com/Adelsamir01/katb-ketab.git
cd katb-ketab
node server.js
```

Verify locally: `curl -I http://localhost:510` should return `200`,
and `curl http://localhost:510/api/wishes` should return JSON.

## Step 2 — Keep it alive

Run the app as a background service so it survives reboots and logouts.
Either option is fine:

- **pm2** (simplest): `npm i -g pm2 && pm2 start server.js --name katb-ketab && pm2 save && pm2 startup`
- **systemd**: a small unit running `/usr/bin/node /path/to/katb-ketab/server.js`
  with `Restart=always`.

## Step 3 — Cloudflare Tunnel for roaa.adelsamir.com

Use a **named tunnel** (persistent hostname):

1. `cloudflared tunnel login` — authenticates to the Cloudflare account that
   owns `adelsamir.com`.
2. Create (or reuse) a tunnel: `cloudflared tunnel create katb-ketab`
3. In the cloudflared config (`~/.cloudflared/config.yml`), add:

   ```yaml
   tunnel: <TUNNEL_ID>
   credentials-file: /path/to/<TUNNEL_ID>.json
   ingress:
     - hostname: roaa.adelsamir.com
       service: http://localhost:510
     - service: http_status:404
   ```

4. Route DNS: `cloudflared tunnel route dns katb-ketab roaa.adelsamir.com`
5. Run it: `cloudflared tunnel run katb-ketab` — also keep this alive with
   pm2 (`pm2 start "cloudflared tunnel run katb-ketab" --name cf-tunnel`)
   or `cloudflared service install` on Linux.

Then verify: `curl -I https://roaa.adelsamir.com` → `200`.

> A quick temporary test is possible with
> `cloudflared tunnel --url http://localhost:510`, but that gives a random
> trycloudflare URL — not the production hostname.

## Notes for the agent

- Do **not** commit `wishes.json` (guest data) or `node_modules/` — both are
  gitignored.
- Fonts are self-hosted in `assets/fonts/`; the site makes no external
  requests, so no internet access is required at runtime beyond the tunnel.
- To update the site later: `git pull` on the server, then restart the app
  (`pm2 restart katb-ketab` or `systemctl restart katb-ketab`).
