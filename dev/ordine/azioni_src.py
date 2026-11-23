# Contenuti della materia "Azioni". Scrive azioni.json, che build.sh inserisce in ordine.js come AZIONI_UNITS.
# Ogni capitolo è una domanda che si fa Nora, che vuole investire in Velonda (azienda inventata): la storia, i numeri e le regole di scrittura stanno in AZIONI.md.
# I testi sono scritti da zero. Gli argomenti sono quelli di ogni manuale di valutazione; esempi, numeri, ordine e parole sono nostri.
# Un capitolo lungo è diviso in parti, e ogni parte ha il suo file: azioni_c5a.py ... azioni_c5f.py. I numeri della storia e i loro controlli sono in azioni_dati.py.
# Uso: python3 dev/ordine/azioni_src.py   (lo lancia build.sh)
import json, os
from lezioni_lib import controlla, bilancia, nb
import azioni_dati   # all'import controlla che tutti i numeri della storia tornino
import azioni_c5a as A, azioni_c5b as B, azioni_c5c as C, azioni_c5d as D, azioni_c5e as E, azioni_c5f as F
H = os.path.dirname(os.path.abspath(__file__))

# =====================================================================================================
# CAPITOLO 5 · COSTA TANTO O POCO?  (18 lezioni in 5 parti; due laboratori di calcolo, alla fine della parte 3 e della parte 4)
# Le chiavi delle lezioni (az-5-01 ... az-5-18) non cambiano più: i progressi di chi studia sono legati a quelle.
# =====================================================================================================
C5 = dict(id='az-c5', name='Costa tanto o poco?', num=5,
  pre=[dict(course='basi', unit='basi-u5', name="Leggere un'azienda"), dict(course='basi', unit='basi-u1', name='I soldi nel tempo')],
  parts=[
    dict(sid='az-5-p1', name='Prezzo e valore', lessons=A.LEZIONI),
    dict(sid='az-5-p2', name='I multipli', lessons=B.LEZIONI + C.LEZIONI),
    dict(sid='az-5-p3', name="Il valore d'impresa", lab='multipli', lessons=D.LEZIONI),
    dict(sid='az-5-p4', name='I soldi che arriveranno', lab='flussi', lessons=E.LEZIONI),
    dict(sid='az-5-p5', name='I pezzi, e il verdetto', lessons=F.LEZIONI)])

UNITS = [C5]
# cursori e risultati dei modelli delle leve (il conto è in LEVERS, dentro p35_steps.js)
LEVE = dict(pecresc=(('g', 'anni'), ('g', 'anni', 'pe10')), leva=(('D',), ('D', 'pe10')), unanno=(('p1', 'rr'), ('Vc', 'rr')),
            gordon=(('g', 'rr'), ('Vc', 'g10', 'r10')), sostenibile=(('pay', 'roe'), ('pay', 'roe10', 'g10', 'pe10')))
bilancia(UNITS)
r = controlla(UNITS, LEVE)
assert [l['key'] for p in C5['parts'] for l in p['lessons']] == ['az-5-%02d' % k for k in range(1, 19)], 'le chiavi devono essere az-5-01 ... az-5-18, in ordine'
# il caso deve stare sotto le due linguette: testo lungo, con la domanda nell'ultimo capoverso
for e in F.LEZIONI[-1]['ex']: assert len(e['q']) > 260 and e['q'].startswith(F.CASO), 'domanda del caso senza i dati'
with open(H + '/azioni.json', 'w', encoding='utf-8') as f: json.dump(nb(UNITS), f, ensure_ascii=False, separators=(',', ':'))
print('azioni: capitoli', len(UNITS), '| parti', sum(len(u['parts']) for u in UNITS), '| lezioni', r['lezioni'], '| domande', r['domande'], '| risposta giusta in A/B/C:', r['giusta'], '| minuti', r['minuti'], '| passi nuovi:', r['passi'])
