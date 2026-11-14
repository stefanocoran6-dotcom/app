#!/usr/bin/env python3
"""Unisce le traduzioni di lavoro (lavoro/t_*.txt, righe "hash | English") al dizionario ui_en.txt ("Italiano ⇒ English").
Le frasi italiane si prendono da lavoro/chiavi.json (le scrive compila.mjs --scheletro), così non si ricopiano a mano.
Se la traduzione è "=" la frase resta com'è. Una traduzione nuova per una frase già presente la sostituisce."""
import json, glob, os, sys
H = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(H)
chiavi = json.load(open(os.path.join(H, 'chiavi.json'), encoding='utf8'))
diz_path = os.path.join(D, 'ui_en.txt')
diz = {}
if os.path.exists(diz_path):
    for r in open(diz_path, encoding='utf8').read().split('\n'):
        if not r.strip() or r.startswith('#'): continue
        k = r.index(' ⇒ '); diz[r[:k]] = r[k + 3:]
nuove = 0; manca = []
for f in sorted(glob.glob(os.path.join(H, 't_*.txt'))):
    for n, r in enumerate(open(f, encoding='utf8').read().split('\n'), 1):
        if not r.strip() or r.startswith('#'): continue
        if ' | ' not in r: print(f'{os.path.basename(f)}:{n}: riga senza " | ": {r[:60]}'); continue
        h, en = r.split(' | ', 1); h = h.strip(); kind = ''
        if '@' in h: h, kind = h.split('@', 1)   # "hash@html" = vale solo per quel tipo di punto del codice (html, lit, tpl, attr)
        if h not in chiavi: manca.append(f'{os.path.basename(f)}:{n} {h}'); continue
        it = (kind + '|' if kind else '') + chiavi[h].replace('\n', '\\n')
        en = en.strip().replace('\n', '\\n')
        if diz.get(it) != en: nuove += 1
        diz[it] = en
with open(diz_path, 'w', encoding='utf8') as o:
    o.write('# Dizionario dell\'interfaccia: frase italiana ⇒ English phrase. {0} {1} sono i valori che il codice mette nel testo. "=" lascia la frase com\'è.\n')
    for it, en in diz.items(): o.write(f'{it} ⇒ {en}\n')
print(f'dizionario: {len(diz)} frasi ({nuove} nuove o cambiate)')
if manca: print('hash sconosciuti:', ', '.join(manca[:20]))
