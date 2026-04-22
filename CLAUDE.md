# Progetto Genogramma — CLAUDE.md

Documentazione di progetto per Claude Code. Aggiornare a ogni sessione significativa.

---

## Panoramica

App desktop (**Electron + React + TypeScript**) per costruire genogrammi trigenerazionali, basata sullo standard di McGoldrick & Gerson. Permette di disegnare alberi familiari su tre generazioni con simboli clinici, relazioni, annotazioni e fasce generazionali cromatiche.

**Cartella app:** `genogramma-app/`  
**Stack:** Electron 29 · Vite (electron-vite) · React 18 · TypeScript · ReactFlow 11 · Tailwind CSS · jsPDF · html-to-image

---

## Architettura

```
genogramma-app/
  src/
    main/          → processo principale Electron
    preload/       → bridge IPC (preload script)
    renderer/
      App.tsx      → root, gestisce stato globale (nodi, archi, pannelli)
      nodes/       → componenti SVG per ogni tipo di simbolo
        ageUtils.ts    → calcAge() e calcAgeAtDeath() condivise
      edges/       → componenti SVG per ogni tipo di relazione
      components/
        Canvas/    → ReactFlow canvas + BandBackground + drag&drop
        Toolbar/   → pannello simboli (drag o click per aggiungere)
        PropertiesPanel/ → form dati persona (nome, date, professione, aggettivi, note, tipo animale)
        EdgePanel/       → form tipo relazione + anno + elimina
        ExportMenu/      → salva/carica JSON, esporta PDF/PNG
      utils/layout.ts    → auto-layout trigenerazionale con ordinamento fratelli per età
    shared/types.ts      → tipi condivisi (NodeType, EdgeType, PersonData, Band)
```

### Tipi di nodo (`NodeType`)
| Tipo | Simbolo | Note |
|------|---------|------|
| `male` | Quadrato | Età calcolata dentro il simbolo |
| `female` | Cerchio | Età calcolata dentro il simbolo |
| `unknown` | Rombo | Età calcolata dentro il simbolo |
| `deceased-male/female/unknown` | Stessa forma + X | Età alla morte nell'angolo superiore |
| `twins-male/female` | Due simboli collegati in cima | Età nel simbolo sinistro |
| `foster-child` | Cerchio con linea sopra | Età calcolata dentro il simbolo |
| `abortion-unknown/male/female` | Forma piena nera | — |
| `system-boundary` | Ellisse tratteggiata | z-index negativo, ridimensionabile |
| `pet` | Zampa (paw print) | Selector Cane/Gatto/Altro nel pannello |

### Tipi di arco (`EdgeType`)
| Tipo | Simbolo visivo | Anno |
|------|---------------|------|
| `parent-child` | Barra comune → drop ai figli | — |
| `married` | Doppia linea parallela | Sì |
| `separated` | Linea + slash | Sì |
| `divorced` | Linea + 2 slash | Sì |
| `cohabiting` | Tratteggiata | Sì |
| `separated-cohabiting` | Tratteggiata + slash | Sì |

### Logica barra comune (parent-child)
`ParentChildEdge` usa `useStore(ReactFlow)` per leggere tutte le edge e i nodeInternals:
1. Trova tutti i figli dello stesso genitore (stessa `source`)
2. Trova il partner di coppia del genitore (se esiste)
3. Disegna il **tronco** dal centro coppia verso il basso fino a `barY = sourceY + 45%`
4. Disegna la **barra orizzontale** da `minChildX` a `maxChildX` a `barY`
5. L'edge del figlio più a sinistra (primary) disegna tronco + barra; tutti disegnano il drop verticale

### Ordinamento fratelli (layout.ts)
Dopo il BFS generazionale, i fratelli (stesso set di genitori) vengono ordinati per `birthYear` **decrescente** prima di calcolare le posizioni X → il più giovane (anno più recente) è più a sinistra.

### Età nei nodi
- **Nodi vivi**: `calcAge(birthYear)` = `annoCorrente − birthYear`
- **Nodi deceduti**: `calcAgeAtDeath(birthYear, deathYear)` = `deathYear − birthYear`
- Testo SVG centrato dentro la forma; assente se `birthYear` non è impostato

### Fasce generazionali (`Band`)
- `origin` — famiglia d'origine (banda superiore)
- `nuclear` — famiglia nucleare (banda centrale)
- `derived` — famiglia derivata / figli (banda inferiore)

---

## Funzionalità implementate

- [x] Canvas interattivo ReactFlow (zoom, pan, drag&drop nodi dalla toolbar)
- [x] 14 tipi di nodi con simboli SVG (13 standard + animale domestico)
- [x] Età calcolata automaticamente dentro ogni simbolo (vivi e deceduti)
- [x] 6 tipi di relazioni con stili SVG differenziati
- [x] Barra comune genitore-figli (trunk → barra orizzontale → drop individuali)
- [x] Anno relazione visualizzato sopra la linea di coppia (editabile in EdgePanel)
- [x] Auto-layout trigenerazionale con ordinamento fratelli per età (più giovane a sinistra)
- [x] PropertiesPanel: nome, data nascita/morte, professione, aggettivi, note, tipo animale
- [x] EdgePanel: cambio tipo relazione, anno relazione, eliminazione
- [x] Fasce generazionali cromatiche (BandBackground)
- [x] Salvataggio/caricamento JSON del progetto
- [x] Esportazione PDF e PNG (`jsPDF` + `html-to-image`)
- [x] Tasto `Delete` per rimuovere nodi/archi selezionati
- [x] MiniMap e Controls ReactFlow
- [x] Repository GitHub: `github.com/Lumakeo/progetto-genogramma`

---

## Evoluzione del progetto

### Sessione 1 — 19 aprile 2026
- Setup iniziale con `electron-vite`, React, TypeScript, Tailwind
- Struttura base: Canvas, Toolbar, PropertiesPanel, EdgePanel, ExportMenu
- Definizione tipi: NodeType (13), EdgeType (6), PersonData, Band
- Tutti i nodi SVG e gli archi personalizzati
- BandBackground con fasce cromatiche trigenerazionali
- Auto-layout trigenerazionale (BFS + centering bottom-up)
- Export JSON / PDF / PNG

### Sessione 2 — 22 aprile 2026
- Creazione CLAUDE.md, `.gitignore`, inizializzazione Git
- Prima sincronizzazione con GitHub (`Lumakeo/progetto-genogramma`)
- Installazione `gh` CLI (v2.91.0) in `~/bin/`
- **Ordinamento fratelli**: `layout.ts` ordina i figli per `birthYear` desc (più giovane a sinistra)
- **Nodo animale domestico** (`pet`): simbolo paw-print SVG, selector Cane/Gatto/Altro nel pannello
- **Età dentro il simbolo**: testo SVG calcolato da `birthYear`; deceduti mostrano età alla morte
- **Barra comune genitore-figli**: `ParentChildEdge` riscritta con `useStore` per tronco + barra orizzontale
- **Anno sulla linea di coppia**: campo in EdgePanel, label SVG sopra la linea
- `NodeLabel` semplificato: mostra solo nome, professione, data di morte (†)
- `ageUtils.ts`: utility condivisa per calcolo età

---

## Decisioni di design (riferimenti visivi)

I genogrammi di riferimento clinici usati come modello (`gen alice 2.jpg`, `gen jessica.jpg`, `Picsart_22-03-30_18-41-43-563.jpg`) definiscono:
- Età dentro il simbolo (non nel label)
- Barra orizzontale condivisa per fratelli
- Anno relazione sopra la linea di coppia
- Simbolo stella per animali (scelto di mantenere zampa per maggiore chiarezza)
- Confine sistema come ellisse tratteggiata (nodo ridimensionabile)

---

## Prossimi sviluppi potenziali

- [ ] Salvataggio automatico (autosave) con localStorage o file system Electron
- [ ] Undo/Redo (history stack)
- [ ] Colori personalizzati per nodi (es. evidenziare sottosistemi)
- [ ] Legenda interattiva dei simboli
- [ ] Stampa diretta (senza passare da PDF)
- [ ] Multilingua (IT/EN)
- [ ] Versione web (senza Electron)
- [ ] Template predefiniti (es. famiglia con divorzi, adozioni)
- [ ] Connessione parent-child anche da entrambi i genitori verso stesso figlio con barra unificata

---

## Comandi utili

```bash
# Avvia in development
cd genogramma-app && npm run dev

# Build
cd genogramma-app && npm run build

# Distribuibile (.dmg / .exe / .AppImage)
cd genogramma-app && npm run dist

# Push su GitHub (gh CLI in ~/bin)
~/bin/gh auth setup-git && git push
```

---

## Riferimenti

- [McGoldrick & Gerson — Genograms in Family Assessment](https://www.genogram.org/)
- [ReactFlow docs](https://reactflow.dev/)
- [electron-vite](https://electron-vite.org/)
- GitHub: `https://github.com/Lumakeo/progetto-genogramma`


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
