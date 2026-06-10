---
name: webapp-docker-restart-on-server-change
description: Editing webapp/server.py requires restarting the Docker container; index.html/app.js do not
metadata:
  type: project
---

The BI webapp runs in Docker container `anphabe-bi-webapp` (host `127.0.0.1:6869` -> container 6868), with `./webapp` mounted **read-only**. `server.py` is a long-lived `http.server` process with NO auto-reload.

**Why:** editing `webapp/server.py` updates the file on disk but the running process keeps the OLD code in RAM, so `/api/*` responses are stale (e.g. a new field is silently missing and the frontend falls back to a default). The static files `index.html` / `app.js` / `sortable.js` ARE re-read per request, so changing them only needs a browser reload (Ctrl+Shift+R to beat cache).

**How to apply:** after any change to `server.py`, run `docker restart anphabe-bi-webapp` (no rebuild needed — code is volume-mounted), then reload the page. Local dev runs on a free port instead: `python3 webapp/server.py 6879` (6868/6869 are taken by Docker). See [[account-customerclass-meaning]] — the CRM-status feature lives in server.py + index.html.
