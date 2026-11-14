# Controlla le unità tradotte in inglese (unita/uNN.py) contro l'originale italiano (../ordine/basi.json).
# Uso: python3 dev/en/controlla.py            tutte le unità presenti
#      python3 dev/en/controlla.py u1 u7      solo quelle
# ERRORE = la lezione non può entrare nell'app così (struttura o numeri diversi dall'originale, testo troppo lungo, caratteri vietati).
# AVVISO = da guardare a mano (termine del glossario mancante, numeri diversi nel testo, frase rimasta in italiano).
# Scrive basi_en.json con le lezioni che non hanno errori.
import json, os, re, sys, glob
H = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(H, '..', 'ordine', 'basi_src.py')
src = open(SRC, encoding='utf-8').read(); aiuti = src[:re.search(r'^U\d+ = dict\(', src, re.M).start()]
IT = {u['id']: u for u in json.load(open(os.path.join(H, '..', 'ordine', 'basi.json'), encoding='utf-8'))}
TERM = json.load(open(os.path.join(H, 'termini.json'), encoding='utf-8'))['termini']
ETI = {x['key']: x['etichetta'] for x in json.load(open(os.path.join(H, 'lezioni.json'), encoding='utf-8'))}
p10 = open(os.path.join(H, '..', 'ordine', 'p10_data.js'), encoding='utf-8').read()
ALIAS = dict((a or b, c.replace("\\'", "'")) for a, b, c in re.findall(r"(?:'([^']+)'|([a-zàèéìòù]+)): '((?:[^'\\]|\\.)+)'", p10[p10.index('const GLOSS_ALIAS'):p10.index('};', p10.index('const GLOSS_ALIAS'))]))
FISSE = {'key', 'id', 'sid', 'type', 'model', 'unit', 'sym', 'widget', 'cond', 'params', 'ans', 'i', 'minutes'}   # devono restare identiche all'originale
err, avv = [], []
IN_US = False   # vero mentre si controllano le varianti americane (variante_us.py): lì il $ è giusto
def chiave(s): return re.sub(r'[.,;:!?()«»“”]', '', s).strip().lower()
def grassetti(s): return [chiave(x) for x in re.findall(r'\*\*(.+?)\*\*', s)]
def numeri(s, lingua):
    s = s.replace('{,}', ',').replace('{.}', '.'); out = [1.0] * len(re.findall(r'\b(?:un|ogni) euro\b', s, re.I)) if lingua == 'it' else []   # "un euro" / "ogni euro" = €1
    for n in re.findall(r'\d[\d.,]*\d|\d', s):
        n = n.replace('.', '').replace(',', '.') if lingua == 'it' else n.replace(',', '')
        try: out.append(round(float(n), 6))
        except ValueError: pass
    return sorted(out)
def testo(dove, it, en):
    if not en.strip(): err.append(f'{dove}: testo vuoto'); return
    for c, nome in (('"', 'virgolette doppie'), ('—', 'lineetta lunga'), ("\\'", "barra prima dell'apostrofo")):
        if c in en: err.append(f'{dove}: {nome} nel testo')
    for m in ('$$', '\\(', '\\)', '[fig]', '|---'):
        if it.count(m) != en.count(m): err.append(f'{dove}: "{m}" compare {en.count(m)} volte, nell\'originale {it.count(m)}')
    if it.count('\n• ') != en.count('\n• '): avv.append(f'{dove}: punti elenco {en.count(chr(10) + "• ")} invece di {it.count(chr(10) + "• ")}')
    if en == it and len(re.findall(r'[a-zàèéìòù]{4,}', it)) > 2: avv.append(f'{dove}: uguale all\'italiano, forse non tradotto')
    if numeri(it, 'it') != numeri(en, 'en'): avv.append(f'{dove}: numeri diversi dall\'originale: {sorted(set(numeri(en, "en")) ^ set(numeri(it, "it")))[:8]}')
    for m in re.findall(r'\b(instalment\w*|behaviour\w*|colour\w*|favour\w*|organis\w*|realis\w*|recognis\w*|authoris\w*|capitalis\w*|programme\w*|whilst|cheque\w*|centre\w*|licence|defence|neighbour\w*|travell\w*|cancell\w*|labour|honour|analys[ei]\w*|catalogue|trolley|holiday\w*|petrol|mobile phone|autumn|queue\w*|tariff\w*|excess|estate agent|current account|towards|amongst|learnt|spelt|euros?|cents?)\b', en, re.I):
        if m.lower() in ('euro', 'euros') and re.search(r'\beuro\b', it, re.I): continue      # la lezione parla proprio dell'euro
        avv.append(f'{dove}: parola britannica "{m}", serve l\'americano')
    if not IN_US and re.search(r'(?<!\$)\$(?!\$)', en.replace('$$', '')) and '$' not in it.replace('$$', '') and en.count('$') % 2 == 0 and en.count('$$') == 0: avv.append(f'{dove}: simbolo $ nel testo, per i soldi si scrive sempre €')
    gen = grassetti(en)
    for g in grassetti(it):
        k = g if g in TERM else ALIAS.get(g)
        if k in TERM and not any(chiave(x) in gen for x in [TERM[k]['en']] + TERM[k]['anche']):
            avv.append(f'{dove}: manca in grassetto il termine "{TERM[k]["en"]}" (in italiano: {g})')
def confronta(dove, it, en, k=None):
    if k in FISSE:
        if it != en: err.append(f'{dove}: "{k}" deve restare {it!r}, trovato {en!r}')
    elif isinstance(it, bool) or isinstance(it, (int, float)) or it is None:
        if it != en: err.append(f'{dove}: valore {en!r} invece di {it!r}')
    elif isinstance(it, str):
        if not isinstance(en, str): err.append(f'{dove}: atteso un testo')
        else: testo(dove, it, en)
    elif isinstance(it, list):
        if not isinstance(en, list) or len(it) != len(en): err.append(f'{dove}: {len(en) if isinstance(en, list) else "?"} elementi invece di {len(it)}'); return
        for n, (a, b) in enumerate(zip(it, en)):
            if k == 'segs' and isinstance(a, list):      # pezzo di un disegno: (peso, nome, colore, cifra): il colore non si traduce
                for j, (x, y) in enumerate(zip(a, b)): confronta(f'{dove}[{n}]', x, y, 'id' if j == 2 else None)
            else: confronta(f'{dove}[{n}]', a, b, k if k in ('segs',) else None)
    elif isinstance(it, dict):
        if not isinstance(en, dict) or set(it) != set(en): err.append(f'{dove}: campi {sorted(en) if isinstance(en, dict) else "?"} invece di {sorted(it)}'); return
        for kk in it: confronta(f'{dove}.{kk}', it[kk], en[kk], kk)
def lezione(l_it, l_en):
    d = l_en['key']; prima = len(err); confronta(d, l_it, l_en)
    for n, s in enumerate(l_en.get('flow', [])):
        if s.get('type') == 'page' and len(s['x']) >= 1000: err.append(f'{d} passo {n + 1}: pagina di {len(s["x"])} caratteri, il massimo è 999')
        if s.get('type') == 'bucket' and len(s['buckets']) == 3:
            for it in s['items']:
                lunghe = [w for w in re.findall(r'\w+', it[0]) if len(w) > 11]
                if lunghe: avv.append(f'{d} passo {n + 1}: parola lunga in una colonna stretta: {lunghe}')
    for n, pg in enumerate(l_en.get('pages', [])):
        if len(pg['x']) >= 1800: avv.append(f'{d} pagina {n + 1}: {len(pg["x"])} caratteri')
    return len(err) == prima
quali = [a.lower() for a in sys.argv[1:]]; buone, fatte, tot = [], 0, 0
for f in sorted(glob.glob(os.path.join(H, 'unita', 'u*.py')), key=lambda x: int(re.search(r'u(\d+)\.py', x).group(1))):
    nome = os.path.basename(f)[:-3]
    if quali and nome not in quali: continue
    ns = {'__file__': SRC}; exec(aiuti, ns)
    try: exec(open(f, encoding='utf-8').read(), ns)
    except Exception as e: err.append(f'{nome}.py: non si legge ({type(e).__name__}: {e})'); continue
    u = next((v for k, v in ns.items() if re.fullmatch(r'U\d+', k) and isinstance(v, dict)), None)
    if not u or u.get('id') not in IT: err.append(f'{nome}.py: manca la variabile U... con l\'id di un\'unità esistente'); continue
    it = IT[u['id']]; per = {l['key']: l for l in it['lessons']}; ok = []
    if u.get('sid') != it['sid']: err.append(f'{nome}: sid deve restare {it["sid"]!r}')
    for l in u['lessons']:
        tot += 1
        if l['key'] not in per: err.append(f'{nome}: lezione {l["key"]} non esiste nell\'originale'); continue
        if ETI.get(l['key']) in ('C', 'E'): avv.append(f'{l["key"]}: è etichettata {ETI[l["key"]]} in lezioni.json, per ora non andava tradotta')
        if lezione(per[l['key']], l): ok.append(l); fatte += 1
    ordine = [k for k in per if k in [l['key'] for l in u['lessons']]]
    if ordine != [l['key'] for l in u['lessons'] if l['key'] in per]: err.append(f'{nome}: le lezioni non sono nello stesso ordine dell\'originale')
    manca = [k for k in per if ETI.get(k) in ('A', 'B') and k not in [l['key'] for l in u['lessons']]]
    print(f'{nome} "{u["name"]}": {len(ok)} lezioni a posto su {len(u["lessons"])}' + (f' | ancora da tradurre: {", ".join(manca)}' if manca else ''))
    buone.append(dict(id=u['id'], sid=it['sid'], name=u['name'], lessons=ok))
# varianti per gli Stati Uniti: stesse regole di struttura delle lezioni normali, poi finiscono nel campo "us" della lezione inglese
TUTTE = {l['key']: l for u in IT.values() for l in u['lessons']}; vus = 0
vf = os.path.join(H, 'variante_us.py')
if os.path.exists(vf):
    ns = {'__file__': SRC}; exec(aiuti, ns)
    try: exec(open(vf, encoding='utf-8').read(), ns)
    except Exception as e: err.append(f'variante_us.py: non si legge ({type(e).__name__}: {e})'); ns['US'] = []
    IN_US = True
    for v in ns.get('US', []):
        base = next((l for u in buone for l in u['lessons'] if l['key'] == v['key']), None)
        if base is None:
            if not quali: err.append(f"variante_us.py: {v['key']} non ha la lezione inglese di base")
            continue
        if v['key'] not in TUTTE: err.append(f"variante_us.py: {v['key']} non esiste nell'originale"); continue
        if lezione(TUTTE[v['key']], v): base['us'] = {k: v[k] for k in v if k not in ('key', 'sym', 'minutes')}; vus += 1
    IN_US = False
if not quali:
    fatte_k = {l['key'] for u in buone for l in u['lessons']}; tutte = [k for k, e in ETI.items() if e in ('A', 'B')]
    print(f'DA TRADURRE ANCORA: {len([k for k in tutte if k not in fatte_k])} lezioni su {len(tutte)}' + (' -> ' + ', '.join(k for k in tutte if k not in fatte_k) if len([k for k in tutte if k not in fatte_k]) < 40 else ''))
for a in avv: print('  AVVISO', a)
for e in err: print('  ERRORE', e)
json.dump(buone, open(os.path.join(H, 'basi_en.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print(f'lezioni controllate {tot} | a posto {fatte} | varianti USA {vus} | errori {len(err)} | avvisi {len(avv)}')
sys.exit(1 if err else 0)
