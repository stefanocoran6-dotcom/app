// Scheda del video: tutto quello che cambia da un giorno all'altro sta qui.
// "dice" è il testo detto (numeri in lettere); "blocchi" sono i sottotitoli:
// [quante parole dette copre, testo mostrato]. Tra asterischi la parola da evidenziare.
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
  ]
};
