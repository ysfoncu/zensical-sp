---
title: Testscenario 02 — Inställningar - Studieadministratörer
---

# Testscenario 02 — Inställningar - Studieadministratörer

!!! info "Scenarioöversikt"

    - **Sida:** Settings → Study Admins
    - **Roll:** Placeringskoordinator (PK)
    - **Mål:** Skapa en studieadministratör från ett tomt utgångsläge och tilldela hen en studie och dess program.
    - **Förutsättning:** Minst en studie med program finns (skapa en först med *Testscenario 01*). Inga studieadministratörer är definierade ännu.

## Vad den här sidan är

**Study Admins** (under Settings) är där du ger personer administrativt ansvar för en
 studie och ett eller flera av dess program. Varje administratör har ett namn, en e-postadress, en enda **studie** och en uppsättning
 **program** inom den studien.

---

## Steg

### 1. Börja på Dashboard

Efter inloggningen hamnar du på **Dashboard**.

<figure markdown="span">
  ![Dashboard — utgångspunkt](images/01-dashboard.png)
  <figcaption>Utgångspunkt — Dashboard</figcaption>
</figure>

### 2. Öppna Settings → Study Admins (tom)

Klicka på **Settings** i sidofältet och välj sedan **Study Admins**. Sidan är tom:
 *"No study admins added yet — Click 'Add Admin' to create your first admin."*

<figure markdown="span">
  ![Tom sida för Study Admins](images/02-admins-empty.png)
  <figcaption>Study Admins — tomt utgångsläge</figcaption>
</figure>

### 3. Lägg till en administratör

Klicka på **Add Admin** (uppe till höger) och fyll i formuläret:

1.  Ange administratörens **namn** — här `Anne Larsen`.
2.  Ange administratörens **e-postadress** — här `anne.larsen@moso.no`.
3.  Välj en **studie** i rullgardinsmenyn (t.ex. *Helse-, sosial og idrettsfag*).
4.  Bocka för de **program** som administratören ansvarar för — här **Nursing** och **Physiotherapy**.
5.  Klicka på **Add**.

<figure markdown="span">
  ![Formuläret för att lägga till administratör ifyllt](images/03-add-admin.png)
  <figcaption>Add Admin — namn, e-post, studie och program valda</figcaption>
</figure>

---

## Slutresultat

Den nya administratören visas i listan med en etikett för **antal program**, sin e-postadress, studien och de
 program som hen ansvarar för.

<figure markdown="span">
  ![Slutläge — administratör skapad](images/04-final.png)
  <figcaption>Slutläge — Anne Larsen skapad med 2 program</figcaption>
</figure>

## Anteckningar

-   **Studieadministratörer kan bara se data för valda studier**

---

<div class="hc-feedback" data-scenario="TS-05-study-admins"></div>
