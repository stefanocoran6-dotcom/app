#!/usr/bin/env python3
"""Secondo conto delle domande di calcolo, scritto a parte e in un altro linguaggio.
Rifà ogni risposta giusta con numeri decimali esatti e, dove si può, per un'altra strada (anno per anno invece della potenza):
se il motore dell'app sbaglia una formula, qui il risultato non torna.
Uso: python3 dev/giochi/ricalcola.py [file dei conti scritto da collauda.mjs]"""
import json, sys, os
from decimal import Decimal as D, ROUND_HALF_UP, getcontext
getcontext().prec = 50
C = D(100)

def giro(x, d):
    return x.quantize(D(1).scaleb(-d), rounding=ROUND_HALF_UP)

def cresci(c, r, n):          # interesse composto, un anno alla volta
    for _ in range(n):
        c = c + c * r / C
    return c

def semplice(p):              # ogni anno gli stessi interessi, sommati
    return sum(D(p['C']) * D(p['r']) / C for _ in range(p['n']))
def composto(p):
    return cresci(D(p['C']), D(p['r']), p['n'])
def attuale(p):               # la cifra che, fatta crescere, dà F
    return D(p['F']) / cresci(D(1), D(p['r']), p['n'])
def reale(p):                 # 100 diventano 100+i; quante "ceste" da 100+f ci compri
    return ((C + D(p['i'])) / (C + D(p['f'])) - 1) * C
def variazione(p):
    return (D(p['B']) / D(p['A']) - 1) * C
def recupero(p):              # dal prezzo dopo la perdita a quello di prima
    dopo = D(p['P']) * (C - D(p['x'])) / C
    assert dopo == D(str(p['Q'])), ('prezzo dopo la perdita', p)
    return (D(p['P']) / dopo - 1) * C
def raddoppio(p):             # si conta: primo anno in cui il capitale ha almeno raddoppiato, poi la parte di anno che manca
    c, n, r = D(1), 0, D(p['r'])
    while c * (1 + r / C) < 2:
        c = c * (1 + r / C); n += 1
    # frazione dell'ultimo anno, con il logaritmo
    resto = (D(2) / c).ln() / (1 + r / C).ln()
    return D(n) + resto
def dividendo(p):
    return D(str(p['D'])) * C / D(p['P'])
def cedola(p):
    return D(p['c']) * C / D(p['P'])
def portafoglio(p):           # su 100 di portafoglio: w in azioni, il resto in obbligazioni
    az, ob = D(p['w']), C - D(p['w'])
    return (az * (C + D(p['a'])) / C + ob * (C + D(p['b'])) / C) - C
def totale(p):
    return (D(str(p['B'])) + D(str(p['D']))) * C / D(p['A']) - C
def margine(p):
    return C - D(p['C']) * C / D(p['R'])

CONTI = dict(semplice=(semplice, 0), composto=(composto, 0), attuale=(attuale, 0), reale=(reale, 1), variazione=(variazione, 1), recupero=(recupero, 1),
             raddoppio=(raddoppio, 0), dividendo=(dividendo, 1), cedola=(cedola, 2), portafoglio=(portafoglio, 2), totale=(totale, 1), margine=(margine, 1))

def main(f):
    n, guai, visti = 0, [], {}
    for r in open(f, encoding='utf-8'):
        x = json.loads(r); n += 1
        if x['t'] not in CONTI:
            guai.append(f"{x['t']}: manca il secondo conto"); continue
        fn, d = CONTI[x['t']]
        mio = giro(fn(x['p']), d)
        visti[x['t']] = visti.get(x['t'], 0) + 1
        if mio != giro(D(str(x['ok'])), d):
            guai.append(f"{x['t']} seme {x['s']}: l'app dice {x['ok']}, il secondo conto {mio} · {x['p']}")
    for g in guai[:40]: print('GUAIO', g)
    print('secondo conto:', ', '.join(f'{k} {v}' for k, v in sorted(visti.items())))
    print(f'conti rifatti {n} · non tornano {len(guai)}')
    sys.exit(1 if guai else 0)

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'conti.jsonl'))
