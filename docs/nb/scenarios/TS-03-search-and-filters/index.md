---
title: Testscenario 08 — Kvoteforespørsel - Søk og filtre
---

# Testscenario 08 — Kvoteforespørsel - Søk og filtre

!!! info "Scenariooversikt"

    - **Side:** Capacity planning
    - **Rolle:** Praksiskoordinator (PK)
    - **Mål:** Bruk søkefeltet og filterkontrollene til å avgrense Quota Requests-listen, og fjern dem deretter.
    - **Forutsetning:** Noen kvoteforespørsler finnes på tvers av ulike programmer, steder og statuser. Dette scenarioet bruker tre:

| Forespørsel | Praksis Place | Program | Status |
|---|---|---|---|
| Autumn cohort A | Oslo University Hospital HF | Nursing | Approved |
| Spring cohort B | Oslo University Hospital HF | Physiotherapy | Pending |
| Bergen cohort C | Bergen Kommune | Nursing | Pending |


## Kontrollene

-   **Period** — avgrens listen til ett eller flere semestre, utløpte forespørsler eller et egendefinert datointervall. **Aktivert som standard** (se nedenfor).
-   **Search** (forstørrelsesglass-ikonet) — fritekstsøk på tvers av studium, program og praksisstedsnavn.
-   **Study / Program** — velg et studium, og gå deretter ned til et bestemt program.
-   **All Emne** — filtrer på emnekode.
-   **Praksis Place** — velg et sted, og deretter eventuelt en bestemt enhet.
-   **All Statuses** — Pending / Approved / Rejected / Fulfilled.
-   **Clear filters** — vises når et nedtrekksfilter er aktivt; tilbakestiller alle (endrer ikke Period-valget).
---

## Trinn

### 1. Merk deg standardvalget for periode

Siden starter **ikke** ufiltrert. Som standard er **Period**-filteret forhåndsinnstilt til
 **This Semester** + **Next Semester** — vist med **2**-merket på Period-knappen og de to
 chipene under verktøylinjen (*"Showing: This Semester · … · Next Semester · …"*). Forespørsler med datoer
 utenfor begge semestrene skjules til du endrer dette.

<figure markdown="span">
  ![Standardvalg for periode — dette + neste semester](images/01-default-period.png)
  <figcaption>Standardtilstand — Period = This Semester + Next Semester (merke "2", to chips)</figcaption>
</figure>

### 2. Åpne Period-filteret

Klikk på **Period**-knappen for å åpne det. De to standardsemestrene er avkrysset. Herfra kan du:

-   Slå av/på **Previous / This / Next Semester** eller **Expired Requests** (flervalg).
-   Bytte til **Custom Date Range** og velge en bestemt fra-/til-dato.
-   Bruke **Clear** for å fjerne alle periodebegrensninger (vise alle perioder), eller **Done** for å ta valgene i bruk.

Du kan også fjerne en periode direkte ved å klikke på **×** på chipen dens under verktøylinjen.

<figure markdown="span">
  ![Period-nedtrekksmenyen åpen](images/02-period-dropdown.png)
  <figcaption>Period-nedtrekksmenyen — This Semester og Next Semester avkrysset som standard</figcaption>
</figure>

### 3. Søk etter navn

Klikk på **magnifier**-ikonet (forstørrelsesglasset) for å åpne søkefeltet, og skriv inn et søkeord — her `Bergen`.
 Listen avgrenses til forespørsler der studium, program eller praksissted samsvarer. Klikk på **Close** for å avslutte søket.

<figure markdown="span">
  ![Søk etter Bergen](images/03-search.png)
  <figcaption>Søk "Bergen" → kun Bergen Kommune-forespørselen</figcaption>
</figure>

### 4. Filtrer på status

Åpne nedtrekksmenyen **Statuses** og velg **Approved**. Bare godkjente forespørsler blir igjen.

<figure markdown="span">
  ![Statusfilter = Approved](images/04-status-approved.png)
  <figcaption>Status = Approved → kun "Autumn cohort A"</figcaption>
</figure>

### 5. Filtrer på studium/program

Åpne **Study / Program**, hold pekeren over studiet (*Helse-, sosial og idrettsfag*), og velg deretter et
 program — her **Physiotherapy**. Listen viser kun forespørslene for dette programmet.

<figure markdown="span">
  ![Study/Program-filter = Physiotherapy](images/05-program-filter.png)
  <figcaption>Study / Program = Physiotherapy → kun "Spring cohort B"</figcaption>
</figure>

### 6. Fjern filtrene

Klikk på **Clear filters** (eller **×**) for å tilbakestille nedtrekksfiltrene og gå tilbake til listen
 (Period-valget beholdes slik det er satt).

<figure markdown="span">
  ![Filtre fjernet](images/06-cleared.png)
  <figcaption>Filtre fjernet — listen gjenopprettet (standardperioden gjelder fortsatt)</figcaption>
</figure>

---

<div class="hc-feedback" data-scenario="TS-03-search-and-filters"></div>
