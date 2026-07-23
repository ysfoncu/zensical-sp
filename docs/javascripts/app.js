// StudentPlacement Help & Onboarding — email gate, progress tracking, feedback, i18n.
//
// Loaded as an ES module on every page (see zensical.toml). Talks to the
// Lambda + DynamoDB tracking API configured in config.js.
//
// Page behavior:
//   - Root page (#hc-lang-redirect): redirects to the chosen language tree.
//   - Welcome pages (<lang>/index.md, #hc-welcome): always visible. Inline
//     email form when anonymous, progress dashboard once signed in.
//   - All other pages: blocked by a full-screen email dialog when anonymous.
//   - While anonymous the navigation stays visible but dimmed (html.hc-anon);
//     clicking a nav link opens the email dialog and, after sign-in,
//     continues to the clicked page.
//   - Languages: en / nb / sv content trees. A header dropdown switches
//     between them (same page, other language). The sidebar only shows the
//     active language's section. Scenario ids are language-neutral, so
//     progress carries across languages.

import { CONFIG } from "./config.js";
import { SCENARIOS } from "./scenarios.js";

const EMAIL_KEY = "hc:email";
const ADMIN_KEY_STORE = "hc:admin-key";
const LANG_KEY = "hc:lang";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const LANGS = { en: "English", nb: "Norsk bokmål", sv: "Svenska" };

// must match [project] site_name in zensical.toml — the value Zensical bakes
// into the built HTML (page title, header logo, nav drawer) at build time
const SITE_NAME = "StudentPlacement Help & Onboarding";

const HEADER_TITLE = {
  en: "StudentPlacement Help & Onboarding",
  nb: "StudentPlacement Hjelp og opplæring",
  sv: "StudentPlacement Hjälp och introduktion",
};

const STR = {
  en: {
    gateTitle: "Enter your email to continue",
    gateBody:
      "Your email is used only to track your progress through the test scenarios and to collect your feedback. No password needed.",
    continueBtn: "Continue",
    signingIn: "Signing in…",
    invalidEmail: "Please enter a valid email address.",
    signInFailed: (msg) => `Could not sign in: ${msg}. Is the tracking API reachable?`,
    signOut: "Sign out",
    finishTitle: "Finish this scenario",
    usefulQuestion: "Was this scenario useful?",
    yes: "👍 Yes",
    no: "👎 No",
    commentPlaceholder: "Optional comment — what worked, what was unclear?",
    submitFeedback: "Submit feedback",
    saving: "Saving…",
    saved: "✓ Thanks! Scenario marked as completed.",
    saveFailed: (msg) => `Could not save: ${msg}`,
    submittedAt: (when) => `Submitted ${when} — you can update it.`,
    loadingProgress: "Loading your progress…",
    progressFailed: (msg) => `Could not load progress: ${msg}`,
    myProgress: "My Progress",
    completedOf: (done, total) => `<strong>${done} of ${total}</strong> scenarios completed`,
    signedInAs: "signed in as",
    thScenario: "Scenario",
    thStatus: "Status",
    thUseful: "Useful",
    thComment: "Your comment",
    stateNotStarted: "Not started",
    stateViewed: "Viewed",
    stateCompleted: "Completed",
  },
  nb: {
    gateTitle: "Skriv inn e-postadressen din for å fortsette",
    gateBody:
      "E-postadressen din brukes kun til å følge fremdriften din gjennom testscenarioene og samle inn tilbakemeldingene dine. Ingen passord nødvendig.",
    continueBtn: "Fortsett",
    signingIn: "Logger inn…",
    invalidEmail: "Skriv inn en gyldig e-postadresse.",
    signInFailed: (msg) => `Kunne ikke logge inn: ${msg}. Er sporings-API-et tilgjengelig?`,
    signOut: "Logg ut",
    finishTitle: "Fullfør dette scenarioet",
    usefulQuestion: "Var dette scenarioet nyttig?",
    yes: "👍 Ja",
    no: "👎 Nei",
    commentPlaceholder: "Valgfri kommentar — hva fungerte, hva var uklart?",
    submitFeedback: "Send tilbakemelding",
    saving: "Lagrer…",
    saved: "✓ Takk! Scenarioet er merket som fullført.",
    saveFailed: (msg) => `Kunne ikke lagre: ${msg}`,
    submittedAt: (when) => `Sendt ${when} — du kan oppdatere den.`,
    loadingProgress: "Laster fremdriften din…",
    progressFailed: (msg) => `Kunne ikke laste fremdrift: ${msg}`,
    myProgress: "Min fremdrift",
    completedOf: (done, total) => `<strong>${done} av ${total}</strong> scenarioer fullført`,
    signedInAs: "logget inn som",
    thScenario: "Scenario",
    thStatus: "Status",
    thUseful: "Nyttig",
    thComment: "Din kommentar",
    stateNotStarted: "Ikke startet",
    stateViewed: "Sett",
    stateCompleted: "Fullført",
  },
  sv: {
    gateTitle: "Ange din e-postadress för att fortsätta",
    gateBody:
      "Din e-postadress används endast för att följa dina framsteg genom testscenarierna och samla in din feedback. Inget lösenord behövs.",
    continueBtn: "Fortsätt",
    signingIn: "Loggar in…",
    invalidEmail: "Ange en giltig e-postadress.",
    signInFailed: (msg) => `Kunde inte logga in: ${msg}. Är spårnings-API:et nåbart?`,
    signOut: "Logga ut",
    finishTitle: "Slutför detta scenario",
    usefulQuestion: "Var detta scenario användbart?",
    yes: "👍 Ja",
    no: "👎 Nej",
    commentPlaceholder: "Valfri kommentar — vad fungerade, vad var oklart?",
    submitFeedback: "Skicka feedback",
    saving: "Sparar…",
    saved: "✓ Tack! Scenariot är markerat som slutfört.",
    saveFailed: (msg) => `Kunde inte spara: ${msg}`,
    submittedAt: (when) => `Skickad ${when} — du kan uppdatera den.`,
    loadingProgress: "Laddar dina framsteg…",
    progressFailed: (msg) => `Kunde inte ladda framsteg: ${msg}`,
    myProgress: "Mina framsteg",
    completedOf: (done, total) => `<strong>${done} av ${total}</strong> scenarier slutförda`,
    signedInAs: "inloggad som",
    thScenario: "Scenario",
    thStatus: "Status",
    thUseful: "Användbart",
    thComment: "Din kommentar",
    stateNotStarted: "Inte påbörjat",
    stateViewed: "Visad",
    stateCompleted: "Slutfört",
  },
};

// ---------------------------------------------------------------------------
// language helpers
// ---------------------------------------------------------------------------

// site root, derived from this module's URL (…/javascripts/app.js)
const SITE_ROOT = new URL("..", import.meta.url);

function pageLang() {
  const rel = location.pathname.replace(SITE_ROOT.pathname, "");
  const seg = rel.split("/")[0];
  return LANGS[seg] ? seg : null;
}

function getLang() {
  // a page inside a language tree always wins, so URL and UI stay in sync
  const fromPage = pageLang();
  if (fromPage) {
    localStorage.setItem(LANG_KEY, fromPage);
    return fromPage;
  }
  const stored = localStorage.getItem(LANG_KEY);
  return LANGS[stored] ? stored : "en";
}

function switchLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang);
  const current = pageLang();
  if (current) {
    const rel = location.pathname.replace(SITE_ROOT.pathname, "");
    location.href = SITE_ROOT.pathname + lang + rel.slice(current.length);
  } else {
    location.href = SITE_ROOT.pathname + lang + "/";
  }
}

// site_name is static HTML baked in at build time (page title, header logo,
// nav drawer logo/label), so switching the displayed title per language
// means rewriting those spots on load — there's no live re-render since
// switchLanguage() does a full page navigation anyway.
function applyHeaderTitle(lang) {
  const title = HEADER_TITLE[lang] || HEADER_TITLE.en;
  if (title === SITE_NAME) return;

  document.title = document.title.split(SITE_NAME).join(title);

  document.querySelectorAll('[data-md-component="logo"]').forEach((logo) => {
    logo.title = title;
    logo.setAttribute("aria-label", title);
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim() === SITE_NAME) textNodes.push(node);
  }
  textNodes.forEach((n) => { n.nodeValue = n.nodeValue.replace(SITE_NAME, title); });
}

function injectLangDropdown(lang) {
  const header = document.querySelector(".md-header__inner");
  if (!header) return;
  const select = document.createElement("select");
  select.className = "hc-lang";
  select.setAttribute("aria-label", "Language");
  select.innerHTML = Object.entries(LANGS)
    .map(([code, label]) => `<option value="${code}"${code === lang ? " selected" : ""}>${label}</option>`)
    .join("");
  select.addEventListener("change", () => switchLanguage(select.value));
  header.appendChild(select);
}

// hide sidebar sections that belong to other languages
function filterNavByLang(lang) {
  const items = document.querySelectorAll(
    ".md-sidebar--primary .md-nav--primary > .md-nav__list > .md-nav__item"
  );
  items.forEach((li) => {
    const link = li.querySelector("a[href]");
    if (!link) return;
    const rel = new URL(link.href).pathname.replace(SITE_ROOT.pathname, "");
    const seg = rel.split("/")[0];
    if (LANGS[seg] && seg !== lang) li.classList.add("hc-lang-hidden");
  });
}

// ---------------------------------------------------------------------------
// generic helpers
// ---------------------------------------------------------------------------

function esc(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

async function api(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(CONFIG.API_BASE_URL + path, {
    method,
    headers: body ? { "content-type": "application/json", ...headers } : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `API error (${res.status})`);
  return data;
}

function getEmail() {
  return localStorage.getItem(EMAIL_KEY) || "";
}

function currentScenario() {
  const anchor = document.querySelector(".hc-feedback[data-scenario]");
  return anchor ? anchor.dataset.scenario : null;
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleString();
}

function setAnon(anon) {
  document.documentElement.classList.toggle("hc-anon", anon);
}

// Shared submit flow for both email forms. Returns true on success.
async function signIn(email, error, button, t) {
  if (!EMAIL_RE.test(email)) {
    error.textContent = t.invalidEmail;
    error.hidden = false;
    return false;
  }
  button.disabled = true;
  button.textContent = t.signingIn;
  try {
    await api("/login", { method: "POST", body: { email } });
    localStorage.setItem(EMAIL_KEY, email);
    setAnon(false);
    return true;
  } catch (err) {
    error.textContent = t.signInFailed(err.message);
    error.hidden = false;
    button.disabled = false;
    button.textContent = t.continueBtn;
    return false;
  }
}

// ---------------------------------------------------------------------------
// email entry: inline form on the welcome page
// ---------------------------------------------------------------------------

function renderWelcomeForm(root, t) {
  root.innerHTML = `
    <div class="hc-welcome-box">
      <h3>${t.gateTitle}</h3>
      <form class="hc-gate-form">
        <input type="email" name="email" placeholder="you@example.com"
               autocomplete="email" required>
        <button type="submit" class="hc-btn hc-btn--primary">${t.continueBtn}</button>
      </form>
      <p class="hc-error" hidden></p>
    </div>`;

  const form = root.querySelector("form");
  const input = root.querySelector("input");
  const error = root.querySelector(".hc-error");
  const button = root.querySelector("button");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = input.value.trim().toLowerCase();
    if (await signIn(email, error, button, t)) {
      showUserChip(email, t);
      renderProgress(root, email, t);
    }
  });
}

// ---------------------------------------------------------------------------
// email dialog (gate on non-welcome pages + intercepted nav clicks)
// ---------------------------------------------------------------------------

function showEmailGate(t, redirectTo = null) {
  document.documentElement.classList.add("hc-locked");
  const overlay = document.createElement("div");
  overlay.className = "hc-overlay";
  overlay.innerHTML = `
    <div class="hc-card" role="dialog" aria-modal="true" aria-labelledby="hc-gate-title">
      <h2 id="hc-gate-title">${t.gateTitle}</h2>
      <p>${t.gateBody}</p>
      <form class="hc-gate-form">
        <input type="email" name="email" placeholder="you@example.com"
               autocomplete="email" required autofocus>
        <button type="submit" class="hc-btn hc-btn--primary">${t.continueBtn}</button>
      </form>
      <p class="hc-error" hidden></p>
    </div>`;
  document.body.appendChild(overlay);

  const form = overlay.querySelector("form");
  const input = overlay.querySelector("input");
  const error = overlay.querySelector(".hc-error");
  const button = overlay.querySelector("button");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = input.value.trim().toLowerCase();
    if (await signIn(email, error, button, t)) {
      if (redirectTo) {
        location.href = redirectTo;
        return;
      }
      overlay.remove();
      document.documentElement.classList.remove("hc-locked");
      initSignedIn(email, t);
    }
  });
}

// While anonymous, nav links are visible but open the email dialog instead
// of navigating; the clicked page is opened after a successful sign-in.
function interceptAnonNav(t) {
  document.addEventListener(
    "click",
    (event) => {
      if (getEmail()) return;
      const link = event.target.closest(
        ".md-sidebar--primary a[href], .md-footer__inner a[href]"
      );
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      if (!document.querySelector(".hc-overlay")) showEmailGate(t, link.href);
    },
    true
  );
}

function showUserChip(email, t) {
  const chip = document.createElement("div");
  chip.className = "hc-chip";
  chip.innerHTML = `
    <span class="hc-chip__email" title="${esc(email)}">${esc(email)}</span>
    <button type="button" class="hc-chip__switch">${t.signOut}</button>`;
  chip.querySelector("button").addEventListener("click", () => {
    localStorage.removeItem(EMAIL_KEY);
    location.reload();
  });
  document.body.appendChild(chip);
}

// ---------------------------------------------------------------------------
// scenario page: track view + feedback widget
// ---------------------------------------------------------------------------

async function initScenarioPage(email, scenario, t) {
  api("/track", {
    method: "POST",
    body: { email, scenario_id: scenario, status: "viewed" },
  }).catch((err) => console.warn("track failed:", err));

  const anchor = document.querySelector(".hc-feedback[data-scenario]");
  anchor.innerHTML = `
    <div class="hc-widget">
      <h3>${t.finishTitle}</h3>
      <p class="hc-widget__question">${t.usefulQuestion}</p>
      <div class="hc-widget__choices">
        <button type="button" class="hc-btn hc-choice" data-useful="true">${t.yes}</button>
        <button type="button" class="hc-btn hc-choice" data-useful="false">${t.no}</button>
      </div>
      <textarea class="hc-widget__comment" rows="3"
        placeholder="${t.commentPlaceholder}"></textarea>
      <div class="hc-widget__actions">
        <button type="button" class="hc-btn hc-btn--primary hc-submit" disabled>${t.submitFeedback}</button>
        <span class="hc-widget__status"></span>
      </div>
    </div>`;

  const choices = [...anchor.querySelectorAll(".hc-choice")];
  const comment = anchor.querySelector(".hc-widget__comment");
  const submit = anchor.querySelector(".hc-submit");
  const status = anchor.querySelector(".hc-widget__status");
  let useful = null;

  function select(value) {
    useful = value;
    choices.forEach((btn) => {
      btn.classList.toggle("hc-choice--selected", btn.dataset.useful === String(value));
    });
    submit.disabled = false;
  }

  choices.forEach((btn) => {
    btn.addEventListener("click", () => select(btn.dataset.useful === "true"));
  });

  // prefill previously submitted feedback
  try {
    const mine = await api(`/progress?email=${encodeURIComponent(email)}`);
    const existing = (mine.feedback || []).find((f) => f.scenario_id === scenario);
    if (existing) {
      select(existing.useful);
      comment.value = existing.comment || "";
      status.textContent = t.submittedAt(fmtDate(existing.updated_at));
    }
  } catch (err) {
    console.warn("could not load existing feedback:", err);
  }

  submit.addEventListener("click", async () => {
    if (useful === null) return;
    submit.disabled = true;
    status.textContent = t.saving;
    try {
      await api("/feedback", {
        method: "POST",
        body: { email, scenario_id: scenario, useful, comment: comment.value },
      });
      status.textContent = t.saved;
    } catch (err) {
      status.textContent = t.saveFailed(err.message);
    }
    submit.disabled = false;
  });
}

// ---------------------------------------------------------------------------
// progress dashboard (rendered on the welcome page)
// ---------------------------------------------------------------------------

async function renderProgress(root, email, t, lang) {
  lang = lang || getLang();
  root.innerHTML = `<p>${t.loadingProgress}</p>`;
  let mine;
  try {
    mine = await api(`/progress?email=${encodeURIComponent(email)}`);
  } catch (err) {
    root.innerHTML = `<p class="hc-error">${esc(t.progressFailed(err.message))}</p>`;
    return;
  }
  const progress = Object.fromEntries((mine.progress || []).map((p) => [p.scenario_id, p]));
  const feedback = Object.fromEntries((mine.feedback || []).map((f) => [f.scenario_id, f]));
  const completed = SCENARIOS.filter((s) => progress[s.id]?.status === "completed").length;

  const stateLabels = {
    "not-started": t.stateNotStarted,
    viewed: t.stateViewed,
    completed: t.stateCompleted,
  };

  const rows = SCENARIOS.map((s, i) => {
    const p = progress[s.id];
    const f = feedback[s.id];
    const state = !p ? "not-started" : p.status;
    const useful = f == null ? "—" : f.useful ? t.yes : t.no;
    const title = s.title[lang] || s.title.en;
    return `
      <tr>
        <td>${i + 1}</td>
        <td><a href="scenarios/${esc(s.id)}/">${esc(title)}</a></td>
        <td><span class="hc-badge hc-badge--${esc(state)}">${stateLabels[state]}</span></td>
        <td>${useful}</td>
        <td>${esc(f?.comment || "")}</td>
      </tr>`;
  }).join("");

  root.innerHTML = `
    <h2 id="my-progress">${t.myProgress}</h2>
    <p class="hc-summary">${t.completedOf(completed, SCENARIOS.length)}
      &nbsp;·&nbsp; ${t.signedInAs} <strong>${esc(email)}</strong></p>
    <div class="hc-table-wrap">
      <table class="hc-table">
        <thead><tr><th>#</th><th>${t.thScenario}</th><th>${t.thStatus}</th>
          <th>${t.thUseful}</th><th>${t.thComment}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ---------------------------------------------------------------------------
// admin page (kept in English)
// ---------------------------------------------------------------------------

function toCsv(rows, columns) {
  const quote = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [columns.join(","), ...rows.map((r) => columns.map((c) => quote(r[c])).join(","))].join("\n");
}

function download(filename, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function renderAdminResults(root, data) {
  const { users = [], progress = [], feedback = [] } = data;
  const titles = Object.fromEntries(SCENARIOS.map((s) => [s.id, s.title.en]));

  const byScenario = SCENARIOS.map((s) => {
    const p = progress.filter((x) => x.scenario_id === s.id);
    const f = feedback.filter((x) => x.scenario_id === s.id);
    return {
      title: s.title.en,
      viewed: p.length,
      completed: p.filter((x) => x.status === "completed").length,
      yes: f.filter((x) => x.useful === true).length,
      no: f.filter((x) => x.useful === false).length,
      comments: f.filter((x) => x.comment).length,
    };
  });

  root.innerHTML = `
    <p class="hc-summary"><strong>${users.length}</strong> users ·
      <strong>${progress.filter((p) => p.status === "completed").length}</strong> completions ·
      <strong>${feedback.length}</strong> feedback entries</p>

    <h3>Per scenario</h3>
    <div class="hc-table-wrap"><table class="hc-table">
      <thead><tr><th>Scenario</th><th>Viewed</th><th>Completed</th><th>👍</th><th>👎</th><th>Comments</th></tr></thead>
      <tbody>${byScenario.map((r) => `
        <tr><td>${esc(r.title)}</td><td>${r.viewed}</td><td>${r.completed}</td>
        <td>${r.yes}</td><td>${r.no}</td><td>${r.comments}</td></tr>`).join("")}
      </tbody>
    </table></div>

    <h3>Feedback</h3>
    <div class="hc-table-wrap"><table class="hc-table">
      <thead><tr><th>When</th><th>User</th><th>Scenario</th><th>Useful</th><th>Comment</th></tr></thead>
      <tbody>${feedback.map((f) => `
        <tr><td>${esc(fmtDate(f.updated_at))}</td><td>${esc(f.email)}</td>
        <td>${esc(titles[f.scenario_id] || f.scenario_id)}</td>
        <td>${f.useful ? "👍 Yes" : "👎 No"}</td><td>${esc(f.comment || "")}</td></tr>`).join("")}
      </tbody>
    </table></div>

    <h3>Users</h3>
    <div class="hc-table-wrap"><table class="hc-table">
      <thead><tr><th>Email</th><th>First seen</th><th>Completed</th></tr></thead>
      <tbody>${users.map((u) => `
        <tr><td>${esc(u.email)}</td><td>${esc(fmtDate(u.first_seen_at))}</td>
        <td>${progress.filter((p) => p.email === u.email && p.status === "completed").length}
            / ${SCENARIOS.length}</td></tr>`).join("")}
      </tbody>
    </table></div>

    <p>
      <button type="button" class="hc-btn" id="hc-csv-feedback">Download feedback CSV</button>
      <button type="button" class="hc-btn" id="hc-csv-progress">Download progress CSV</button>
    </p>`;

  root.querySelector("#hc-csv-feedback").addEventListener("click", () =>
    download("feedback.csv", toCsv(feedback, ["email", "scenario_id", "useful", "comment", "created_at", "updated_at"]))
  );
  root.querySelector("#hc-csv-progress").addEventListener("click", () =>
    download("progress.csv", toCsv(progress, ["email", "scenario_id", "status", "first_viewed_at", "completed_at"]))
  );
}

function initAdminPage() {
  const root = document.getElementById("hc-admin");
  root.innerHTML = `
    <form class="hc-admin-form">
      <input type="password" placeholder="Admin key" autocomplete="off"
             value="${esc(sessionStorage.getItem(ADMIN_KEY_STORE) || "")}">
      <button type="submit" class="hc-btn hc-btn--primary">Load results</button>
    </form>
    <p class="hc-error" hidden></p>
    <div class="hc-admin-results"></div>`;

  const form = root.querySelector("form");
  const input = root.querySelector("input");
  const error = root.querySelector(".hc-error");
  const results = root.querySelector(".hc-admin-results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;
    results.innerHTML = "<p>Loading…</p>";
    try {
      const data = await api("/admin/results", { headers: { "x-admin-key": input.value.trim() } });
      sessionStorage.setItem(ADMIN_KEY_STORE, input.value.trim());
      renderAdminResults(results, data);
    } catch (err) {
      results.innerHTML = "";
      error.textContent = err.message === "invalid admin key"
        ? "Invalid admin key." : `Could not load results: ${err.message}`;
      error.hidden = false;
    }
  });

  if (sessionStorage.getItem(ADMIN_KEY_STORE)) form.requestSubmit();
}

// ---------------------------------------------------------------------------
// bootstrap
// ---------------------------------------------------------------------------

function initSignedIn(email, t) {
  showUserChip(email, t);
  const scenario = currentScenario();
  if (scenario) initScenarioPage(email, scenario, t);
}

function main() {
  const lang = getLang();
  const t = STR[lang];

  // root page: forward to the chosen language tree
  if (document.getElementById("hc-lang-redirect")) {
    location.replace(SITE_ROOT.pathname + lang + "/");
    return;
  }

  applyHeaderTitle(lang);
  injectLangDropdown(lang);
  filterNavByLang(lang);

  const email = getEmail();
  setAnon(!email);
  if (document.getElementById("hc-admin")) initAdminPage();

  const welcome = document.getElementById("hc-welcome");
  if (welcome) {
    // welcome page is always visible; email form lives inline
    if (email) {
      showUserChip(email, t);
      renderProgress(welcome, email, t, lang);
    } else {
      renderWelcomeForm(welcome, t);
      interceptAnonNav(t);
    }
    return;
  }

  if (!email) {
    showEmailGate(t);
  } else {
    initSignedIn(email, t);
  }
}

main();
