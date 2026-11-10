#!/usr/bin/env python3
"""Mette in archivio le notizie del giorno.

Legge notizie.json (le notizie del giorno, quelle del nastro), lo controlla, poi:
- aggiunge gli articoli al file del mese, notizie/AAAA-MM.json (se il giorno c'era già, lo sostituisce);
- rifà notizie/indice.json, l'elenco leggero che l'app usa nella pagina «Tutte le notizie».
Si può rilanciare quante volte si vuole: non crea doppioni.

Uso: python3 dev/notizie_pubblica.py"""
import glob, json, os, re, sys

D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(D, '..'))
sys.path.insert(0, D)
from notizie_check import controlla   # noqa: E402


def leggi(p, vuoto):
    try:
        return json.load(open(p, encoding='utf-8'))
    except (OSError, ValueError):
        return vuoto


def scrivi(p, j):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(j, f, ensure_ascii=False, indent=1)
        f.write('\n')


def minuti(a):
    t = [a.get('sommario', '')] + (a.get('breve') or []) + [x for s in (a.get('corpo') or []) for x in [s.get('h', '')] + (s.get('p') or [])] + [a.get('perche', '')]
    return max(1, int(len(' '.join(t).split()) / 180 + 0.5))   # come Math.round nell'app


oggi = leggi(os.path.join(ROOT, 'notizie.json'), None)
if not oggi:
    sys.exit('notizie.json manca o non si legge')
err, note = controlla(oggi)
for n in note: print('nota:', n)
if err:
    sys.exit('DA SISTEMARE prima di pubblicare:\n- ' + '\n- '.join(err))

data = oggi['data']
nuovi = [dict(a, data=a.get('data') or data) for a in oggi['articoli']]
for mese in sorted({a['data'][:7] for a in nuovi}):
    p = os.path.join(ROOT, 'notizie', mese + '.json')
    m = leggi(p, {'v': 1, 'mese': mese, 'articoli': []})
    giorni_nuovi = {a['data'] for a in nuovi if a['data'][:7] == mese}
    ids_nuovi = {a['id'] for a in nuovi}
    vecchi = [a for a in m.get('articoli', []) if a.get('data') not in giorni_nuovi and a.get('id') not in ids_nuovi]
    tutti = [a for a in nuovi if a['data'][:7] == mese] + vecchi
    # dal giorno più recente; dentro lo stesso giorno resta l'ordine in cui sono stati scritti
    ordine = {a['id']: k for k, a in enumerate(tutti)}
    tutti.sort(key=lambda a: (-int(a['data'].replace('-', '')), ordine[a['id']]))
    scrivi(p, {'v': 1, 'mese': mese, 'articoli': tutti})
    print(f"notizie/{mese}.json: {len(tutti)} articoli")

# l'elenco di tutti gli articoli, dal più recente
voci, mesi = [], []
for p in sorted(glob.glob(os.path.join(ROOT, 'notizie', '[0-9][0-9][0-9][0-9]-[0-9][0-9].json')), reverse=True):
    m = leggi(p, None)
    if not m or not isinstance(m.get('articoli'), list):
        sys.exit(f'{os.path.basename(p)} non si legge: sistemarlo prima di pubblicare')
    mesi.append(os.path.basename(p)[:-5])
    for a in m['articoli']:
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', a.get('data', '')) or not a.get('id'):
            sys.exit(f"{os.path.basename(p)}: articolo senza data o senza id")
        voci.append({'id': a['id'], 'data': a['data'], 'cat': a.get('cat', ''), 'titolo': a.get('titolo', ''), 'nastro': a.get('nastro', ''), 'numero': a.get('numero', ''), 'min': minuti(a)})
ids = [v['id'] for v in voci]
if len(ids) != len(set(ids)):
    sys.exit('archivio: ci sono id ripetuti')
scrivi(os.path.join(ROOT, 'notizie', 'indice.json'), {'v': 1, 'aggiornato': data, 'mesi': mesi, 'articoli': voci})
print(f"notizie/indice.json: {len(voci)} articoli in {len(mesi)} mesi, ultimo giorno {voci[0]['data'] if voci else '-'}")
