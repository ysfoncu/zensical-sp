---
title: Test Scenario 09 — Student Placement - Create
---

# Test Scenario 09 — Student Placement - Create

!!! info "Scenario overview"

    - **Page:** Student placement → New Student Placement
    - **Role:** Placement Coordinator (PK)
    - **Goal:** Create a student placement from an **approved quota request**, so the placement is matched to the request from the start.
    - **Precondition:** At least one approved quota request with available capacity exists (created via Capacity planning). The placement form is no longer filled in manually — its details come from the request you pick.

## What this page is

**Student placement** lists all placements for your programmes. At the top there are filters (**Study / Program**, **emne**, **status** and a **Period** selector — the active periods are shown as removable chips, e.g. *This Semester · Jan 1, 2026 – Aug 1, 2026*). The **View by** toggle switches between two views:

- **Table view** — one row per placement with Study/Program, Title, Year, Semester, Emne, number of Students, Start–End date, Status and Pending steps, plus pagination controls.
- **Calendar view** — a timeline of months (e.g. *June 2026 – December 2026*, "Showing 7 months") where each placement is drawn as a horizontal bar spanning its start–end dates, labelled with its date range and student count. Arrows shift the visible window and **Reset to Default** restores it.

---

## Steps

### 1. Start on the Dashboard

<figure markdown="span">
  ![Dashboard](images/01-dashboard.png)
  <figcaption>Starting point — the Dashboard</figcaption>
</figure>

### 2. Open Student placement

Click **Student placement** in the sidebar. The list opens in the view you used last — here the **table view**.

<figure markdown="span">
  ![Student placements — table view](images/02-placements-table.png)
  <figcaption>Student placement — table view with filters and period chips</figcaption>
</figure>

Switching **View by** to the calendar shows the same placements as bars on a month timeline:

<figure markdown="span">
  ![Student placements — calendar view](images/03-calendar-view.png)
  <figcaption>Student placement — calendar view (placements drawn across their date ranges)</figcaption>
</figure>

### 3. Click "Create new student placement"

The **New Student Placement** page opens with the message *"Welcome! Let's Get Started — Pick an approved request to start a placement matched to it — or start a blank placement to fill the details yourself."*

It lists the approved quota requests with capacity for your programme (here *"5 requests with capacity for your programme"*), filterable by **programme**, **emne** and **period**. Each card shows the praksis place, programme · emne · period, an **Approved** badge, a capacity bar (places in use vs. available), the per-unit breakdown and a **Use this** button. You can also **Start a blank placement** or **Request quota** if nothing fits.

<figure markdown="span">
  ![New Student Placement — request picker](images/04-request-picker.png)
  <figcaption>New Student Placement — pick an approved quota request</figcaption>
</figure>

### 4. Select a quota request and click "Use this"

Pick the request you want to base the placement on — here **Mørkheim kommune · Bachelor Vernepleie · Ver1001 · 9 Sep 2026 – 9 Dec 2026** (90 places available) — and click **Use this**.

### 5. Confirm placement details and create

The **Confirm placement details** step appears: *"These come from the quota request and are locked so the placement stays matched. Name it, confirm the dates, then create."*

- **Praksis place**, **Programme**, **Emne** and **Quota window** are shown read-only.
- **Placement title** is prefilled (here `Helse-, sosial og idrettsfag/Ver1001/2026/Autumn`) and can be edited.
- **Start date** and **End date** are prefilled with the quota window and must stay within it (*"On or after 9 Sep 2026"* / *"On or before 9 Dec 2026"*).

Tick the checkbox **"The start and end dates are correct for this placement"** — it confirms *9 Sep 2026 – 9 Dec 2026 (within the quota window)* — and click **Create & open**.

<figure markdown="span">
  ![Confirm placement details](images/05-confirm-details.png)
  <figcaption>Confirm placement details — locked request data, prefilled dates, confirmation checkbox</figcaption>
</figure>

---

## Final result

The placement is created and opens on its detail page: **Helse-, sosial og idrettsfag/Ver1001/2026/Autumn** (2026 · Autumn · 2026-09-09 – 2026-12-09) with status **1/3 Setup Students & Quotas**. Because it was created from the request, the **Available Quotas** panel on the left already shows the matched request — **Mørkheim kommune** with its units (Mørkheim kommune 45/45, Bjørkely sykehjem 45/45, 90 available in total). The right column prompts to **Import Students**.

The scenario ends here — importing students is covered in the next scenario.

<figure markdown="span">
  ![Placement created and opened](images/06-created.png)
  <figcaption>After Create & open — matched quotas on the left, Import Students prompt on the right</figcaption>
</figure>

---

<div class="hc-feedback" data-scenario="TS-09-create-placement"></div>
