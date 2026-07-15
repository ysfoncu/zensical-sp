---
title: Testscenario 10 — Studentplassering - Fordele studenter
---

# Testscenario 10 — Studentplassering - Fordele studenter

!!! info "Scenariooversikt"

    - **Side:** Student placement → *(en plassering)*
    - **Rolle:** Praksiskoordinator (PK)
    - **Mål:** Fordel de importerte studentene på de tilgjengelige kvotene (praksisstedene), slik at hver student har en plass for praksisen sin.
    - **Forutsetning:** En plassering finnes med importerte studenter og minst én godkjent kvote. Denne gjennomgangen bruker **Helse-, sosial og idrettsfag/SP102/2026/Autumn** med **3 importerte studenter**.

## Om import av studenter

Studenter legges til en plassering før dette trinnet. De kan **importeres fra en Excel-fil** eller **hentes automatisk fra det nasjonale studentregisteret** — **FS** i Norge eller **Ladok** i Sverige. For denne demonstrasjonen ble **3 mock-studenter** importert (Ola Nordmann, Kari Hansen, Lars Johansen).

## Forstå denne siden

Plasseringens detaljside har to koblede paneler:

- **Available Quotas** (venstre) — **plassene studenter kan tilordnes**. Hver godkjente forespørsel er gruppert per praksissted og fordelt på enheter, med tallene **req · apr** (forespurt / godkjent) og **con · avail · asgn** (bekreftet / ledig / tilordnet). **+ (Assign students)**-ikonet på en enhet åpner et hurtigtilordningspanel. **Total**-raden summerer hele kvoten.
- **Students** (høyre) — **personene som må plasseres** for praksisen sin. Hver rad viser studenten, plasseringshistorikken, det tilordnede **Praksis Place** (eller en **Add praksis place**-knapp når ingen er satt), veiledere, prioriteringer, egendefinert forespørsel og filvedlegg. Over tabellen finnes et søkefelt, filtrene **All assignments** / **All priorities** og knappene **Diagram**, **Columns**, utvid og **Actions**.

Et fremdriftsmerke øverst (f.eks. **2/3 Attach praksis places to the students**) viser hvor langt plasseringen har kommet i arbeidsflyten. Etter hvert som studenter tilordnes, oppdateres kvotetallene til venstre i sanntid.

Det finnes **tre måter å tilordne en student til en plass på**, alle vist nedenfor.

<figure markdown="span">
  ![Plasseringsdetaljer — kvoter og studenter](images/01-placement-overview.png)
  <figcaption>Plasseringssiden — Available Quotas (venstre) og de 3 importerte studentene (høyre)</figcaption>
</figure>

---

## Trinn

### 1. Åpne plasseringen

Klikk på **Student placement** i sidemenyen og velg **Helse-, sosial og idrettsfag/SP102/2026/Autumn**.

### 2. Tilordne første student — "Add praksis place" (studenttabellen)

I **Students**-tabellen klikker du på **Add praksis place** på raden til **Ola Nordmann**. En **Select Praksis Place**-dialog viser de tilgjengelige kvoteforespørslene (med ledighet og antall tilordnede). Den tilbyr også å *kansellere* studenten — med eller uten ekstra kostnad — slik at plasseringen fortsatt kan publiseres hvis ingen plass passer.

Velg en plass — her **Vestmark sykehus · Medisinsk klinikk** — for å tilordne Ola.

<figure markdown="span">
  ![Select Praksis Place-dialog](images/02-add-praksis-place-dialog.png)
  <figcaption>"Add praksis place" — velg en kvoteforespørsel for studenten</figcaption>
</figure>

Studentens rad viser nå den tilordnede plassen med **Change place** / **Detach**, og Available Quotas-tallene oppdateres (enheten går til *1 tilordnet*).

<figure markdown="span">
  ![Første student tilordnet](images/03-first-student-assigned.png)
  <figcaption>Ola tilordnet Medisinsk klinikk — kvotetallene oppdatert til venstre</figcaption>
</figure>

### 3. Tilordne andre student — "+"-ikonet i Available Quotas

I **Available Quotas**-panelet klikker du på **+ (Assign students)**-ikonet på en enhet — her **Vestmark sykehus**. Et **Quick Assign Students**-panel åpnes med de ikke-tilordnede studentene. Huk av **Kari Hansen** og klikk på **Assign 1 Student**.

<figure markdown="span">
  ![Quick Assign Students-panel](images/04-quick-assign.png)
  <figcaption>Quick Assign — velg ikke-tilordnede studenter for en enhet og tilordne i bulk</figcaption>
</figure>

### 4. Tilordne siste student — Diagram-visningen

Klikk på **Diagram** (over studenttabellen) for å åpne **Placement Network Diagram**. Den viser praksissteder til venstre og studenter til høyre; eksisterende tilordninger tegnes som forbindelseslinjer (hver med en **×** for å fjerne den), og ikke-tilordnede studenter vises som stiplede kort. Du tilordner en student ved å **dra en forbindelse fra en plass til studenten**.

Her er **Lars Johansen** den gjenværende ikke-tilordnede studenten — å koble ham til **Vestmark sykehus** fullfører fordelingen.

<figure markdown="span">
  ![Placement Network Diagram](images/05-diagram.png)
  <figcaption>Diagram-visning — dra fra en plass til en student for å tilordne (Lars fortsatt ikke tilordnet)</figcaption>
</figure>

---

## Sluttresultat

Når alle tre studentene er tilordnet, viser fremdriftsmerket **3/3**, og et grønt banner vises: **"All students assigned — ready to publish. Publishing will lock all assignments and notify the praksis places."** En **Publish assignments**-knapp blir tilgjengelig. Hver studentrad viser den tilordnede plassen sin, og Available Quotas-panelet gjenspeiler **3 tilordnet**.

Scenarioet slutter her — studentene er fullt fordelt, og plasseringen er klar til å publiseres.

<figure markdown="span">
  ![Alle studenter tilordnet](images/06-all-assigned.png)
  <figcaption>Alle 3 studentene plassert — klar til å publisere</figcaption>
</figure>

---

<div class="hc-feedback" data-scenario="TS-10-distribute-students"></div>
