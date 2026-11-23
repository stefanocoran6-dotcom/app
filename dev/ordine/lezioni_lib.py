# Attrezzi per scrivere le lezioni dei corsi nuovi (Azioni e i prossimi): stessi pezzi di basi_src.py, più quelli nati con i capitoli a domanda.
# basi_src.py resta com'è, con le sue copie: qui si aggiunge senza toccare le Basi.
# Nel testo: **grassetto**, righe che iniziano con "• ", tabelle con |, formule tra $$ ... $$ (su una riga a sé) o \( ... \).
import re, collections

def Q(q, options, ans, exp): return dict(type='mcq', q=q.strip('\n'), options=options, ans=ans, exp=exp.strip('\n'))
def M(*pairs): return dict(type='match', pairs=[list(p) for p in pairs])

def P(t, x, fig=None, deep=None):              # pagina di spiegazione; "[fig]" su una riga a sé dice dove va il disegno; deep = (titolo, testo) del riquadro «Per andare a fondo»
    d = dict(type='page', t=t, x=x.strip('\n'))
    if fig: d['fig'] = fig
    if deep: d['deep'] = dict(t=deep[0], x=deep[1].strip('\n'))
    return d
# ---- disegni ----
def F(rows, cap=None):                         # barre: righe (etichetta, valore, pezzi); ogni pezzo è (peso, nome, colore, cifra)
    d = dict(rows=[dict(lab=l, val=v, segs=[list(x) for x in segs]) for (l, v, segs) in rows])
    if cap: d['cap'] = cap
    return d
def SCHEDA(name, sub, rows, hl=(), cap=None):  # la scheda dell'azienda: righe (voce, cifra); hl = le voci da mettere in evidenza in questa pagina
    assert all(h in [r[0] for r in rows] for h in hl), ('voce in evidenza che non esiste', hl)
    d = dict(kind='card', name=name, sub=sub, rows=[[r[0], r[1], 1 if r[0] in hl else 0] for r in rows])
    if cap: d['cap'] = cap
    return d
def PONTE(rows, unit, cap=None):               # ponte: (voce, valore, tipo) con tipo base | plus | minus | tot; ogni barra parte dove finisce quella prima
    d = dict(kind='bridge', unit=unit, rows=[list(r) for r in rows])
    if cap: d['cap'] = cap
    return d
def TACCHE(n, lab, val, each, cap=None):       # una barra divisa in n tacche uguali (il prezzo come tanti anni di utili)
    d = dict(kind='ticks', n=n, lab=lab, val=val, each=each)
    if cap: d['cap'] = cap
    return d
# ---- passi da fare ----
def G(q, after, lo=None, hi=None, step=None, truth=None, near=None, unit='€', options=None, ans=None):   # stima prima di leggere: cursore, oppure scelta tra risposte
    d = dict(type='guess', q=q.strip('\n'), after=after.strip('\n'))
    if options: d.update(options=options, ans=ans)
    else: d.update(min=lo, max=hi, step=step, truth=truth, near=near, unit=unit)
    return d
def LV(t, x, model, params, sliders, goals, after):   # leve da muovere fino a un obiettivo; il conto sta nell'app (LEVERS in p35_steps.js)
    return dict(type='lever', t=t, x=x, model=model, params=params, sliders=sliders, goals=goals, after=after)
def BK(t, buckets, items, after=None):                # metti ogni voce al posto giusto: (testo, numero del contenitore, perché)
    d = dict(type='bucket', t=t, buckets=buckets, items=[list(i) for i in items])
    if after: d['after'] = after
    return d
def OR(t, items, x=None, after=None):                 # metti in ordine: le voci sono scritte già nell'ordine giusto
    d = dict(type='order', t=t, items=items)
    if x: d['x'] = x
    if after: d['after'] = after
    return d
def N(q, ans, unit, exp, tol=0.5, dec=0):             # calcola tu: risposta con il tastierino, entro una tolleranza
    return dict(type='num', q=q.strip('\n'), ans=ans, unit=unit, tol=tol, dec=dec, exp=exp.strip('\n'))
def LF(key, sym, title, minutes, flow, note):         # lezione a passi: domande e abbinamenti finiscono anche in "ex", che serve a verifiche e allenamento
    ex = []; fl = []
    for s in flow:
        if s['type'] in ('mcq', 'match'): fl.append(dict(type='ex', i=len(ex))); ex.append(s)
        else: fl.append(s)
    return dict(key=key, sym=sym, title=title, minutes=minutes, flow=fl, note=note, ex=ex, pages=[])

COLORI = ('az', 'pesca', 'menta', 'giallo', 'lilla', 'rosa', 'bianco')
UNITA_NUM = ('€', '%', '', 'anni', 'mln €')
PAGINA_MAX = 1000   # caratteri: una pagina si legge senza perdere il filo
FONDO_MAX = 900

# ---- controlli di forma: stesse regole delle Basi, più i pezzi nuovi ----
def controlla(units, leve):
    """leve: { nome del modello: (id dei cursori, nomi dei risultati usabili negli obiettivi) }"""
    keys = [l['key'] for u in units for l in u['lessons']]
    assert len(keys) == len(set(keys)), 'chiavi doppie'
    pos = collections.Counter(); steps = collections.Counter(); nq = 0
    def testo(s, dove):
        assert '—' not in s and '"' not in s, (dove, 'lineetta lunga o virgolette doppie')
        assert s.count('$$') % 2 == 0 and s.count('\\(') == s.count('\\)'), (dove, 'formula non chiusa')
        assert s.count('**') % 2 == 0, (dove, 'grassetto non chiuso')
    def figura(f, dove):
        k = f.get('kind', 'bars')
        if k == 'bars':
            for r in f['rows']: assert r['segs'] and all(x[0] > 0 and x[2] in COLORI for x in r['segs']), dove
        elif k == 'card': assert f['name'] and len(f['rows']) >= 3, dove
        elif k == 'bridge':
            tot = 0
            for (lab, v, tipo) in f['rows']:
                assert tipo in ('base', 'plus', 'minus', 'tot') and v > 0, dove
                if tipo == 'tot': assert abs(tot - v) < 1e-9, (dove, 'il ponte non arriva al totale', tot, v)
                else: tot += -v if tipo == 'minus' else v
        elif k == 'ticks': assert 2 <= f['n'] <= 40, dove
        else: raise AssertionError((dove, 'disegno sconosciuto', k))
    for u in units:
        assert u['id'] and u['sid'] and u['name'] and u['lessons'], u.get('id')
        for l in u['lessons']:
            fl = l['flow']; K = l['key']
            assert fl and l['note'] and l['ex'] and l['sym'] and len(l['sym']) <= 5, K
            assert any(e['type'] == 'mcq' for e in l['ex']), 'manca la domanda in ' + K
            testo(l['note'], (K, 'in breve')); testo(l['title'], (K, 'titolo'))
            for s in fl:
                T = s['type']; assert T in ('page', 'guess', 'lever', 'bucket', 'order', 'num', 'ex'), (K, T); steps[T] += 1
                for k in ('q', 'x', 'after', 'exp', 't'):
                    if isinstance(s.get(k), str): testo(s[k], (K, T, k))
                if T == 'page':
                    assert len(s['x']) < PAGINA_MAX, (K, s['t'], len(s['x']), 'pagina troppo lunga')
                    assert ('[fig]' in s['x']) == bool(s.get('fig')), (K, s['t'], 'disegno e segnaposto non coincidono')
                    if s.get('fig'): figura(s['fig'], (K, s['t']))
                    if s.get('deep'): testo(s['deep']['x'], (K, s['t'], 'a fondo')); assert s['deep']['t'] and len(s['deep']['x']) < FONDO_MAX, (K, s['t'], len(s['deep']['x']), 'riquadro troppo lungo')
                elif T == 'guess' and 'options' in s: assert len(s['options']) == 3 and 0 <= s['ans'] < 3, K
                elif T == 'guess': assert s['min'] < s['truth'] < s['max'] and s['near'] > 0 and (s['max'] - s['min']) % s['step'] == 0, K
                elif T == 'lever':
                    assert s['model'] in leve, (K, s['model'])
                    ids, outs = leve[s['model']]
                    assert [x['id'] for x in s['sliders']] == list(ids), (K, 'cursori diversi da quelli del modello')
                    assert all(x['min'] <= x['start'] <= x['max'] and x['step'] > 0 and x['label'] for x in s['sliders']), K
                    assert s['goals'] and all(g['label'] and g['cond'] and all(c[0] in outs and c[1] in ('<', '<=', '>', '>=') for c in g['cond']) for g in s['goals']), (K, 'obiettivo che usa un risultato sconosciuto')
                elif T == 'bucket': assert 2 <= len(s['buckets']) <= 3 and len(s['items']) >= 3 and set(i[1] for i in s['items']) == set(range(len(s['buckets']))), K
                elif T == 'order': assert len(s['items']) >= 3 and len(set(s['items'])) == len(s['items']), K
                elif T == 'num': assert isinstance(s['ans'], (int, float)) and s['tol'] >= 0 and s['unit'] in UNITA_NUM, K
                elif T == 'ex': assert 0 <= s['i'] < len(l['ex']), K
            assert sorted(s['i'] for s in fl if s['type'] == 'ex') == list(range(len(l['ex']))), K
            for e in l['ex']:
                if e['type'] == 'mcq':
                    assert len(e['options']) == 3 and 0 <= e['ans'] < 3 and len(set(e['options'])) == 3, K
                    testo(e['q'], (K, 'domanda')); testo(e['exp'], (K, 'spiegazione')); [testo(o, (K, 'risposta')) for o in e['options']]
                    pos[e['ans']] += 1; nq += 1
                else: assert len(e['pairs']) == 4, K
    def apici(o, dove=''):
        if isinstance(o, str): assert "\\'" not in o, ('barra rovesciata davanti a un apice', dove, o[:60])
        elif isinstance(o, list): [apici(x, dove) for x in o]
        elif isinstance(o, dict): [apici(v, o.get('key') or dove) for v in o.values()]
    apici(units)
    return dict(lezioni=len(keys), domande=nq, giusta=[pos[i] for i in range(3)], minuti=sum(l['minutes'] for u in units for l in u['lessons']), passi=dict((k, v) for k, v in steps.items() if k not in ('page', 'ex')))

# spazio che non va a capo tra la cifra e la valuta ("150 €" resta sulla stessa riga)
FERMI = ('key', 'id', 'sid', 'sym', 'type', 'widget', 'model', 'unit', 'cond', 'params', 'kind', 'lab_id', 'course')
def nb(o):
    if isinstance(o, str): return re.sub(r'(?<=\\\)) (?=[€$])', ' ', re.sub(r'(?<=\d) (?=[€$])', ' ', o))
    if isinstance(o, list): return [nb(x) for x in o]
    if isinstance(o, dict): return {k: (v if k in FERMI else nb(v)) for k, v in o.items()}
    return o
