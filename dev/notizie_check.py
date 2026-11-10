#!/usr/bin/env python3
"""Controlla notizie.json prima di pubblicarlo: campi obbligatori, lunghezze, fonti con indirizzo https.
Uso: python3 dev/notizie_check.py"""
import json, os, re, sys

P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'notizie.json')
j = json.load(open(P, encoding='utf-8'))
err = []
def need(c, m):
    if not c: err.append(m)

need(re.fullmatch(r'\d{4}-\d{2}-\d{2}', j.get('data', '')), 'data: serve la forma AAAA-MM-GG')
arts = j.get('articoli')
need(isinstance(arts, list) and 1 <= len(arts) <= 6, 'articoli: da 1 a 6')
ids = set()
for k, a in enumerate(arts or []):
    w = f"articolo {k + 1} ({a.get('id', '?')})"
    need(re.fullmatch(r'[a-z0-9-]{4,60}', a.get('id', '')) and a.get('id') not in ids, w + ': id mancante, ripetuto o con caratteri strani')
    ids.add(a.get('id'))
    for f in ('cat', 'nastro', 'titolo', 'sommario', 'numero', 'didascalia', 'perche'):
        need(isinstance(a.get(f), str) and a[f].strip(), f'{w}: manca "{f}"')
    need(len(a.get('nastro', '')) <= 44, w + ': titolo del nastro oltre 44 caratteri')
    need(len(a.get('titolo', '')) <= 70, w + ': titolo oltre 70 caratteri')
    need(len(a.get('numero', '')) <= 9, w + ': numero di copertina oltre 9 caratteri')
    need(not a.get('evid') or a['evid'] in a.get('titolo', ''), w + ': "evid" deve essere un pezzo esatto del titolo')
    need(isinstance(a.get('breve'), list) and 1 <= len(a['breve']) <= 4, w + ': "breve" da 1 a 4 punti')
    need(isinstance(a.get('corpo'), list) and a['corpo'], w + ': "corpo" vuoto')
    for s in a.get('corpo') or []:
        need(isinstance(s.get('h'), str) and s['h'].strip(), w + ': una sezione senza titolo')
        need(isinstance(s.get('p'), list) and s['p'] and all(isinstance(t, str) and t.strip() for t in s['p']), w + f": sezione «{s.get('h')}» senza testo")
    fo = a.get('fonti')
    need(isinstance(fo, list) and fo, w + ': serve almeno una fonte')
    for f in fo or []:
        need(isinstance(f.get('nome'), str) and f['nome'].strip() and str(f.get('url', '')).startswith('https://'), w + ': fonte senza nome o senza indirizzo https')
    testo = ' '.join([a.get('titolo', ''), a.get('sommario', ''), a.get('perche', '')] + (a.get('breve') or []) + [t for s in (a.get('corpo') or []) for t in [s.get('h', '')] + (s.get('p') or [])])
    need('"' not in testo and '—' not in testo, w + ': niente virgolette dritte doppie né lineette lunghe nei testi')
    need(testo.count('**') % 2 == 0, w + ': grassetti non chiusi')
    print(f"{w}: {len(testo.split())} parole, {len(fo or [])} fonti")
if err:
    print('DA SISTEMARE:\n- ' + '\n- '.join(err)); sys.exit(1)
print(f"notizie.json ok: {len(arts)} articoli del {j['data']}")
