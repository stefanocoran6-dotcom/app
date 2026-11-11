// Scheda dell'episodio del TG Rally: è l'unico file che cambia ogni giorno.
// scene: le battute ("dice", numeri in lettere) e i sottotitoli ("blocchi": [quante parole dette copre, testo]; tra asterischi la parola evidenziata)
// schermi: che cosa compare sullo schermo alle spalle di Rally, scelto tra i modelli di tg.js
// gesti, umori: che cosa fa Rally. Tutti i tempi sono appuntamenti "scena:parola" (vedi tg.js, funzione tc).
window.VIDEO = {
  id: '2026-11-10-bollette',
  rubrica: 'TG RALLY',
  data: '10 NOV',
  titolo: 'Decreto bollette: quanto si risparmia',
  nastro: ['DECRETO BOLLETTE', 'DA GENNAIO 2027', 'CHE COSA CAMBIA PER TE'],
  scene: [
    { id: 'gancio', dice: 'Bolletta della luce: da gennaio qualcosa cambia.',
      blocchi: [[3, 'Bolletta della *luce*:'], [2, 'da *gennaio*'], [2, 'qualcosa cambia.']] },
    { id: 'fatto', dice: "Il governo ha approvato il decreto bollette. Prime stime: una famiglia risparmierebbe da diciassette a trentasette euro l'anno.",
      blocchi: [[4, 'Il governo ha *approvato*'], [3, 'il decreto bollette.'], [2, 'Prime stime:'], [3, 'una famiglia risparmierebbe'], [2, 'da *17*'], [4, "a *37 €* l'anno."]] },
    { id: 'come', dice: 'Come funziona? Se il gas costa troppo, le centrali ricevono un rimborso e vendono la corrente a meno.',
      blocchi: [[2, 'Come funziona?'], [3, 'Se il *gas*'], [2, 'costa troppo,'], [3, 'le centrali ricevono'], [2, 'un *rimborso*'], [4, 'e vendono la corrente'], [2, '*a meno*.']] },
    { id: 'perte', dice: 'Vale solo se hai un contratto a prezzo variabile. Con il fisso non cambia nulla.',
      blocchi: [[4, 'Vale solo se hai'], [2, 'un contratto'], [3, 'a prezzo *variabile*.'], [3, 'Con il *fisso*'], [3, 'non cambia nulla.']] },
    { id: 'saluto', dice: 'Io sono Rally. Seguimi per la prossima notizia.',
      blocchi: [[3, 'Io sono *Rally*.'], [3, 'Seguimi per la'], [2, 'prossima notizia.']] }
  ],
  schermi: [
    { tipo: 'titolo', etichetta: 'LA NOTIZIA', righe: ['Decreto', 'bollette'], evid: 1, icona: 'lampadina',
      timbro: { testo: 'OK DEL GOVERNO', a: 'fatto:approvato', d: .12 } },
    { tipo: 'numero', da: 'fatto:Prime', d: -.12, etichetta: 'PRIME STIME',
      parti: [{ testo: '17', a: 'fatto:diciassette' }, { testo: '-37 €', a: 'fatto:trentasette' }],
      chips: [{ testo: 'una famiglia', icona: 'casa', a: 'fatto:famiglia' }, { testo: "in meno l'anno", colore: 'giallo', a: "fatto:l'anno" }],
      fonte: 'stime Ecco e Codacons' },
    { tipo: 'catena', da: 'come:@inizio', d: -.08, etichetta: 'COME FUNZIONA', zoom: [1.09, 1.12], fy: [520, 520],
      passi: [{ icona: 'fiamma', nome: 'GAS' }, { icona: 'centrale', nome: 'CENTRALE' }, { icona: 'lampadina', nome: 'LUCE' }],
      note: [{ testo: 'troppo caro', passo: 0, colore: 'rosa', a: 'come:costa', d: .1 },
        { testo: 'rimborso', passo: 1, colore: 'giallo', a: 'come:rimborso', d: .22 },
        { testo: 'a meno', passo: 2, colore: 'menta', lato: 'destra', a: 'come:meno', d: .1 }],
      fx: [{ tipo: 'cresce', passo: 0, a: 'come:costa', fino: 'come:meno' }, { tipo: 'moneta', passo: 1, a: 'come:rimborso' },
        { tipo: 'prezzo', passo: 2, su: 'come:costa', giu: 'come:meno' }, { tipo: 'accendi', passo: 2, a: 'come:meno' }] },
    { tipo: 'scelta', da: 'perte:@inizio', d: -.08, etichetta: 'PER CHI VALE', domanda: 'Che contratto hai?',
      carte: [{ titolo: 'Prezzo variabile', nota: 'sconto', colore: 'menta', segno: 'si', a: 'perte:prezzo', d: -.15 },
        { titolo: 'Prezzo fisso', nota: 'non cambia', colore: 'bianco', notaColore: 'grigio', segno: 'uguale', a: 'perte:Con', pulse: 'perte:non', pd: .25 }] },
    { tipo: 'saluto', da: 'saluto:@inizio', d: -.08, segui: { a: 'saluto:Seguimi' } }
  ],
  gesti: [
    { g: 'avanti', a: 'gancio:@inizio', d: .1, fino: 'fatto:@inizio' },
    { g: 'sporgi', a: 'gancio:da', fino: 'fatto:@inizio' },
    { g: 'salto', a: 'fatto:approvato', d: .12 },
    { g: 'gira', a: 'fatto:approvato', d: .22, durata: 1.12 },
    { g: 'bacchetta', a: 'fatto:Prime', fino: 'perte:@inizio', tocchi: ['fatto:diciassette', 'fatto:trentasette', { a: 'come:rimborso', d: .1 }, 'come:meno'] },
    { g: 'guarda', a: 'fatto:Prime', fino: 'fatto:trentasette', fd: .6, dx: 1.4, dy: -3.2 },
    { g: 'salto', a: 'fatto:diciassette' }, { g: 'salto', a: 'fatto:trentasette' },
    { g: 'inclina', a: 'come:@inizio', d: -.05, fino: 'come:Se', fd: -.08 },
    { g: 'segui', a: 'come:Se', fino: 'come:vendono', oltre: 'come:meno' },
    { g: 'orecchie', a: 'come:costa' },
    { g: 'salto', a: 'come:rimborso', d: .26, forza: .9 }, { g: 'salto', a: 'come:meno', d: .2 },
    { g: 'posa', nome: 'maniFianchi', a: 'perte:@inizio', d: .1, fino: 'perte:Con', fd: .1, sporgi: 'perte:hai' },
    { g: 'guarda', a: 'perte:prezzo', d: -.1, fino: 'perte:prezzo', fd: .6, dx: 0, dy: -3, rot: 0 },
    { g: 'spalle', a: 'perte:non', d: -.14, fino: 'perte:@fine', fd: .22 },
    { g: 'saluta', a: 'saluto:@inizio' }
  ],
  umori: [
    { u: 'surprised', a: 'gancio:@inizio', d: -.2 }, { u: 'happy', a: 'gancio:da', d: -.06 },
    { u: 'surprised', a: 'fatto:approvato', d: .14 }, { u: 'happy', a: 'fatto:approvato', d: .87 },
    { u: 'nervous', a: 'come:costa', d: -.1 }, { u: 'happy', a: 'come:rimborso', d: -.06 },
    { u: 'smug', a: 'perte:@inizio', d: .15 }, { u: 'happy', a: 'perte:prezzo', d: .7 }, { u: 'neutral', a: 'perte:non', d: -.1 },
    { u: 'happy', a: 'saluto:@inizio', d: -.1 }, { u: 'wink', a: 'saluto:@fine', d: .18 }
  ]
};
