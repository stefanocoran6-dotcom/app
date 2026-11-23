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

# ---- laboratorio «multipli» (capitolo «Costa tanto o poco?»): ogni conto per una strada diversa da quella del motore ----
def S(x): return D(str(x))
def capz(p):                  # tante azioni quante sono, sommate una alla volta sarebbe lungo: si passa dal valore di 1.000 azioni
    return S(p['P']) * 1000 * S(p['N']) / 1000
def eps(p):                   # l'utile per azione è il numero che, moltiplicato per le azioni, ridà l'utile
    e = S(p['U']) / S(p['N'])
    assert e * S(p['N']) == S(p['U']), ('utile per azione', p)
    return e
def pe(p):                    # quanti utili per azione stanno nel prezzo
    return S(p['P']) * 100 / (S(p['E']) * 100)
def petot(p):                 # passando dall'utile per azione
    return S(p['P']) / (S(p['U']) / S(p['N']))
def ey(p):                    # 100 diviso il P/E
    return C / (S(p['P']) / S(p['E']))
def pb(p):                    # con le cifre di tutta l'azienda: capitalizzazione diviso patrimonio netto
    return S(p['P']) * S(p['N']) / S(p['PN'])
def ps(p):                    # per azione: prezzo diviso ricavi per azione
    return S(p['P']) / (S(p['R']) / S(p['N']))
def ev(p):                    # capitalizzazione più debito netto
    return S(p['cap']) + (S(p['D']) - S(p['C']))
def confronto(p):             # metà del valore con un P/E, metà con l'altro
    return S(p['a']) * S(p['E']) / 2 + S(p['b']) * S(p['E']) / 2
def evebit(p):
    return (S(p['cap']) + (S(p['D']) - S(p['C']))) / S(p['E'])
def margsic(p):               # quello che manca al prezzo per arrivare a 100 di valore
    return C - S(p['P']) * C / S(p['V'])

# ---- ancora laboratorio «multipli»: i conti della seconda stesura ----
def epsdil(p):                # ogni opzione aggiunge solo la parte di azione che i soldi incassati non bastano a ricomprare
    parte = (S(p['Pm']) - S(p['K'])) / S(p['Pm'])
    return S(p['U']) / (S(p['N']) + S(p['n']) * parte)
def peatt(p):                 # il P/E passato, diviso per quanto crescono gli utili
    return (S(p['P']) / S(p['E'])) / (1 + S(p['g']) / C)
def pcf(p):                   # la cassa un passo alla volta, poi quante volte sta nella capitalizzazione
    cassa = S(p['U']); cassa += S(p['A']); cassa -= S(p['Wk'])
    return S(p['cap']) / cassa
def fcfe(p):                  # i debiti nuovi pagano una parte degli investimenti: il resto esce dalla cassa prodotta
    return S(p['CF']) - (S(p['I']) - S(p['dD']))
def evpieno(p):               # tutti quelli che vanno pagati, meno la cassa
    return sum(S(p[k]) for k in ('cap', 'D', 'Pr', 'Tz')) - S(p['C'])
def evebitda(p):              # capovolto: quanto EBITDA rende ogni 100 di valore d'impresa
    resa = (S(p['E']) + S(p['A'])) * C / (S(p['cap']) + S(p['D']) - S(p['C']))
    return C / resa
def evprezzo(p):              # per azione: valore dell'attività per azione, meno debito netto per azione
    return S(p['m']) * S(p['B']) / S(p['N']) - (S(p['D']) - S(p['C'])) / S(p['N'])

# ---- laboratorio «flussi» (i soldi che arriveranno) ----
def unanno(p):                # la cifra che, cresciuta al rendimento richiesto, dà dividendo più prezzo
    v = (S(p['D1']) + S(p['P1'])) * C / (C + S(p['r']))
    assert v + v * S(p['r']) / C == S(p['D1']) + S(p['P1']), ('un anno', p)
    return v
def dueanni(p):               # un anno alla volta, tornando indietro: prima il valore tra un anno, poi quello di oggi
    k = 1 + S(p['r']) / C
    tra_un_anno = S(p['D1']) + (S(p['D2']) + S(p['P2'])) / k
    return tra_un_anno / k
VISTI_G = [0]
def serie(d1, r, g):          # la somma dei dividendi scontati, un anno dopo l'altro, finché i pezzi diventano trascurabili
    v, pezzo, q = D(0), d1 / (1 + r), (1 + g) / (1 + r)
    while pezzo > D('1e-30'):
        v += pezzo; pezzo *= q
    return v
def gordon(p):                # il valore di oggi è dividendo più valore tra un anno (cresciuto di g), scontati di un anno
    r, g, d1 = S(p['r']) / C, S(p['g']) / C, S(p['D1'])
    v = d1 / (r - g)
    assert v * (1 + r) == d1 + v * (1 + g), ('gordon', p)
    VISTI_G[0] += 1
    if VISTI_G[0] % 200 == 1: assert abs(serie(d1, r, g) - v) < D('1e-20'), ('gordon, somma anno per anno', p)   # ogni tanto anche la somma lunga
    return v
def gordon0(p):
    r, g = S(p['r']) / C, S(p['g']) / C
    d1 = S(p['D0']) + S(p['D0']) * g
    v = d1 / (r - g)
    assert v * (1 + r) == d1 + v * (1 + g), ('gordon0', p)
    return v
def rimpl(p):                 # il rendimento che, messo in Gordon, ridà il prezzo
    r = S(p['D1']) * C / S(p['P']) + S(p['g'])
    assert S(p['D1']) * C / (r - S(p['g'])) == S(p['P']), ('rendimento offerto', p)
    return r
def gsost(p):                 # su 100 di patrimonio: l'utile è il ROE, e quello che resta in azienda fa crescere il patrimonio
    utile = S(p['roe'])
    return utile - utile * S(p['pay']) / C
def pegiusto(p):              # il valore di Gordon di un'azione con 1 di utile atteso
    d1 = S(p['pay']) / C
    return d1 / ((S(p['r']) - S(p['g'])) / C)
def priv(p):                  # il capitale che, al rendimento richiesto, dà ogni anno quel dividendo
    v = S(p['D']) * C / S(p['r'])
    assert v * S(p['r']) / C == S(p['D']), ('privilegiata', p)
    return v
def duefasi(p):               # indietro di un anno alla volta, partendo dal valore finale
    r, g = S(p['r']) / C, S(p['g']) / C
    finale = S(p['D2']) * (1 + g) / (r - g)
    tra_un_anno = (S(p['D2']) + finale) / (1 + r)
    return (S(p['D1']) + tra_un_anno) / (1 + r)

CONTI = dict(semplice=(semplice, 0), composto=(composto, 0), attuale=(attuale, 0), reale=(reale, 1), variazione=(variazione, 1), recupero=(recupero, 1),
             raddoppio=(raddoppio, 0), dividendo=(dividendo, 1), cedola=(cedola, 2), portafoglio=(portafoglio, 2), totale=(totale, 1), margine=(margine, 1),
             capz=(capz, 0), eps=(eps, 2), pe=(pe, 1), petot=(petot, 1), ey=(ey, 2), pb=(pb, 1), ps=(ps, 1), ev=(ev, 0), confronto=(confronto, 2), evebit=(evebit, 1), margsic=(margsic, 1),
             epsdil=(epsdil, 2), peatt=(peatt, 1), pcf=(pcf, 1), fcfe=(fcfe, 0), evpieno=(evpieno, 0), evebitda=(evebitda, 1), evprezzo=(evprezzo, 2),
             unanno=(unanno, 2), dueanni=(dueanni, 2), gordon=(gordon, 2), gordon0=(gordon0, 2), rimpl=(rimpl, 1), gsost=(gsost, 1), pegiusto=(pegiusto, 1), priv=(priv, 2), duefasi=(duefasi, 2))

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
