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
      edges/       → componenti SVG per ogni tipo di relazione
      components/
        Canvas/    → ReactFlow canvas + BandBackground + drag&drop
        Toolbar/   → pannello simboli (drag o click per aggiungere)
        PropertiesPanel/ → form dati persona (nome, date, professione, aggettivi, note)
        EdgePanel/       → form tipo relazione + elimina
        ExportMenu/      → salva/carica JSON, esporta PDF/PNG
      utils/layout.ts    → auto-layout trigenerazionale
    shared/types.ts      → tipi condivisi (NodeType, EdgeType, PersonData, Band)
```

### Tipi di nodo (`NodeType`)
| Tipo | Simbolo |
|------|---------|
| `male` | Quadrato |
| `female` | Cerchio |
| `unknown` | Rombo |
| `deceased-male/female/unknown` | Stessa forma + X |
| `twins-male/female` | Due simboli collegati in cima |
| `foster-child` | Cerchio con linea tratteggiata sopra |
| `abortion-unknown/male/female` | Forma piena nera |
| `system-boundary` | Ellisse tratteggiata |

### Tipi di arco (`EdgeType`)
| Tipo | Significato |
|------|------------|
| `parent-child` | Genitore → Figlio |
| `married` | Sposati (`=`) |
| `separated` | Separati (`//`) |
| `divorced` | Divorziati (`//=`) |
| `cohabiting` | Conviventi (`---`) |
| `separated-cohabiting` | Separati da convivenza |

### Fasce generazionali (`Band`)
- `origin` — famiglia d'origine (banda superiore)
- `nuclear` — famiglia nucleare (banda centrale)
- `derived` — famiglia derivata / figli (banda inferiore)

Ogni persona può essere assegnata a una fascia; `BandBackground` disegna le bande colorate dietro il canvas.

---

## Funzionalità implementate

- [x] Canvas interattivo ReactFlow (zoom, pan, drag&drop nodi dalla toolbar)
- [x] 13 tipi di nodi con simboli SVG conformi allo standard
- [x] 6 tipi di relazioni con stili SVG differenziati
- [x] PropertiesPanel: nome, data nascita/morte (giorno/mese/anno separati), professione, lista aggettivi, note
- [x] EdgePanel: cambio tipo relazione al volo, eliminazione
- [x] Fasce generazionali cromatiche (BandBackground)
- [x] Auto-layout trigenerazionale (`utils/layout.ts`)
- [x] Salvataggio/caricamento JSON del progetto
- [x] Esportazione PDF e PNG (`jsPDF` + `html-to-image`)
- [x] Tasto `Delete` per rimuovere nodi/archi selezionati
- [x] MiniMap e Controls ReactFlow

---

## Evoluzione del progetto

### Sessione 1 — 19 aprile 2025
- Setup iniziale progetto con `electron-vite`, React, TypeScript, Tailwind
- Implementazione struttura base: Canvas, Toolbar, PropertiesPanel
- Definizione tipi (`shared/types.ts`): NodeType, EdgeType, PersonData, Band
- Creazione di tutti i nodi SVG (13 tipi)
- Implementazione archi personalizzati (6 tipi)
- Aggiunta BandBackground con fasce cromatiche trigenerazionali
- PropertiesPanel completo (dati anagrafici, aggettivi, note)
- EdgePanel per gestione relazioni
- ExportMenu: salva/carica JSON, esporta PDF/PNG
- Auto-layout trigenerazionale

### Sessione 2 — 22 aprile 2025
- Creazione CLAUDE.md per documentazione e tracciamento evoluzione
- Inizializzazione repository Git
- Prima sincronizzazione con GitHub

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

---

## Comandi utili

```bash
# Avvia in development
cd genogramma-app && npm run dev

# Build
cd genogramma-app && npm run build

# Distribuibile (.dmg / .exe / .AppImage)
cd genogramma-app && npm run dist
```

---

## Riferimenti

- [McGoldrick & Gerson — Genograms in Family Assessment](https://www.genogram.org/)
- [ReactFlow docs](https://reactflow.dev/)
- [electron-vite](https://electron-vite.org/)
