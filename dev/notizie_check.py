#!/usr/bin/env python3
"""Controlla notizie.json prima di pubblicarlo: campi obbligatori, lunghezze, fonti con indirizzo https.
Uso: python3 dev/notizie_check.py   (esce con errore se c'è qualcosa da sistemare)"""
import json, os, re, sys

D = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(D, '..', 'notizie.json')


def parole_glossario():
    """Le parole che nell'app si possono toccare: chiavi e sinonimi del glossario in ordine/p10_data.js."""
    try:
        s = open(os.path.join(D, 'ordine', 'p10_data.js'), encoding='utf-8').read()
        a, b = s.index('const GLOSS_DEF'), s.index('const glossKey')
    except (OSError, ValueError):
        return None
    keys = re.findall(r"(?:'((?:[^'\\]|\\.)+)'|\b([a-z0-9/]+)): [\['\"]", s[a:b])
    return {(q or w).replace("\\'", "'").lower() for q, w in keys}


def norm(t):
    return re.sub(r'\s+', ' ', re.sub(r'[.,;:!?()«»“”]', '', t.lower())).strip()


def controlla(j):
    err, note = [], []
    def need(c, m):
        if not c: err.append(m)

    data = j.get('data', '')
    need(re.fullmatch(r'\d{4}-\d{2}-\d{2}', data), 'data: serve la forma AAAA-MM-GG')
    arts = j.get('articoli')
    need(isinstance(arts, list) and 1 <= len(arts) <= 6, 'articoli: da 1 a 6')
    gloss, ids = parole_glossario(), set()
    for k, a in enumerate(arts or []):
        w = f"articolo {k + 1} ({a.get('id', '?')})"
        i = a.get('id', '')
        need(re.fullmatch(r'\d{4}-\d{2}-\d{2}-[a-z0-9-]{2,40}', i) and i not in ids, w + ': id mancante, ripetuto o non nella forma AAAA-MM-GG-parola')
        need(i.startswith(a.get('data', data) + '-'), w + ': l\'id deve cominciare con la data dell\'articolo')
        ids.add(i)
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
        need(isinstance(fo, list) and len(fo) >= 2, w + ': servono almeno due fonti')
        for f in fo or []:
            need(isinstance(f.get('nome'), str) and f['nome'].strip() and str(f.get('url', '')).startswith('https://'), w + ': fonte senza nome o senza indirizzo https')
        testo = ' '.join([a.get('titolo', ''), a.get('sommario', ''), a.get('perche', '')] + (a.get('breve') or []) + [t for s in (a.get('corpo') or []) for t in [s.get('h', '')] + (s.get('p') or [])])
        need('"' not in testo and '—' not in testo, w + ': niente virgolette dritte doppie né lineette lunghe nei testi')
        need(testo.count('**') % 2 == 0, w + ': grassetti non chiusi')
        need(not re.search(r'\b(oggi|ieri|domani|stamattina|stasera)\b', ' '.join(t for s in (a.get('corpo') or []) for t in (s.get('p') or [])), re.I), w + ': nei paragrafi niente "oggi", "ieri", "domani": servono le date')
        if gloss is not None:
            fuori = sorted({b for b in re.findall(r'\*\*([^*]+)\*\*', testo) if norm(b) not in gloss})
            if fuori: note.append(f"{w}: in grassetto ma non nel glossario (non si potranno toccare): {', '.join(fuori)}")
        print(f"{w}: {len(testo.split())} parole, {len(fo or [])} fonti")
    return err, note


if __name__ == '__main__':
    j = json.load(open(P, encoding='utf-8'))
    err, note = controlla(j)
    for n in note: print('nota:', n)
    if err:
        print('DA SISTEMARE:\n- ' + '\n- '.join(err)); sys.exit(1)
    print(f"notizie.json ok: {len(j['articoli'])} articoli del {j['data']}")
