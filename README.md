# StudentPlacement Help & Onboarding Center

A help and onboarding site built with [Zensical](https://zensical.org/).
The welcome page is public and shows how the site works; entering an email
(no password) reveals the navigation, tracks progress, and shows a personal
"My Progress" dashboard inline on the welcome page. Users submit feedback
after each scenario ("Was this useful?" plus an optional comment). Progress
and feedback are stored in DynamoDB via a Lambda API, and can be browsed on
the built-in admin page or exported as CSV.

## Architecture

```
Browser (static site: local or GitHub Pages)
  └── docs/javascripts/app.js  — email gate, view tracking, feedback widget
        └── HTTPS → API Gateway (HTTP API)
              └── Lambda: umeo-help-tracking-api  (infra/lambda/handler.py)
                    └── DynamoDB table: umeo-help-tracking
```

- **AWS account/profile:** `toppn`, region `eu-north-1`
- **API endpoint:** `https://mwkwaveovl.execute-api.eu-north-1.amazonaws.com`
  (configured in `docs/javascripts/config.js`)
- **Admin key:** stored in `infra/.admin-key` (gitignored). Needed by the
  Admin page; also usable directly:
  `curl <api>/admin/results -H "x-admin-key: $(cat infra/.admin-key)"`
- Note: Lambda Function URLs are blocked by an organization SCP in this AWS
  account, which is why API Gateway fronts the function.

## Run locally

```bash
python3 -m venv .venv && .venv/bin/pip install zensical   # first time only
.venv/bin/zensical serve                                   # http://localhost:8000
```

The locally served site talks to the real AWS API — entries you make locally
land in the production DynamoDB table.

### Fully offline alternative

`infra/local_server.py` runs the exact same Lambda handler against an
in-memory DynamoDB (requires `pip install moto boto3`; admin key
`local-admin-key`). Point `API_BASE_URL` in `docs/javascripts/config.js` at
`http://localhost:8787` while using it.

## Languages

Content exists in three languages — English (`docs/en/`), Norwegian Bokmål
(`docs/nb/`) and Swedish (`docs/sv/`) — with identical structure. A header
dropdown switches language (same page, other tree) and the sidebar only shows
the active language. UI strings live in `STR` in `docs/javascripts/app.js`;
per-language scenario titles in `docs/javascripts/scenarios.js`. Scenario ids
are language-neutral, so progress carries across languages. The root URL
redirects to the last-chosen language (default English). The Admin page is
English only.

## Content: test scenarios

Each scenario lives in its own folder with its images next to the page:

```
docs/en/scenarios/TS-01-create-quota-request/     (same layout in nb/ and sv/)
├── index.md
└── images/*.png
```

Scenario pages end with `<div class="hc-feedback" data-scenario="...">`,
which `app.js` turns into the feedback widget. The scenario list used by the
Progress/Admin pages is `docs/javascripts/scenarios.js`.

To (re)generate scenarios from the source HTML exports in
`~/Desktop/umeo/test-scenarios`, run `python3 tools/convert_scenarios.py`
(also regenerates `scenarios.js`; nav in `zensical.toml` is maintained by
hand).

## Tracking API

| Route | Description |
|---|---|
| `POST /login` `{email}` | register/identify a user |
| `POST /track` `{email, scenario_id, status}` | record `viewed` / `completed` |
| `POST /feedback` `{email, scenario_id, useful, comment?}` | upsert feedback, marks scenario completed |
| `GET /progress?email=` | one user's progress + feedback |
| `GET /admin/results` | everything — requires `x-admin-key` header |
| `GET /health` | liveness check |

Data model (single table, on-demand billing):
`USER#<email>` / `PROFILE`, `PROGRESS#<scenario>`, `FEEDBACK#<scenario>`.

### Deploying backend changes

```bash
./infra/deploy.sh update    # code-only update of the Lambda
./infra/deploy.sh           # full (re)create: table, role, function, API GW
```

## Publish to GitHub Pages

1. Push this repo to GitHub (branch `main` or `master`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. The included workflow `.github/workflows/docs.yml` builds and deploys on
   every push. Optionally set `site_url` in `zensical.toml` to the Pages URL.

The email gate is identification, not authentication — the site content is
public to anyone with the URL; emails exist so you can attribute progress and
feedback. The admin key protects only the collected data, never commit it.
