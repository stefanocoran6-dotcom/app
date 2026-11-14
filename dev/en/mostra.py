# Stampa il sorgente italiano delle lezioni A e B di un'unità (per copiarlo e tradurlo). Uso: python3 dev/en/mostra.py 7 [basi-7-3 ...]
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(H, '..', 'ordine', 'basi_src.py')
righe = open(SRC, encoding='utf-8').read().split('\n')
ETI = {x['key']: x['etichetta'] for x in json.load(open(os.path.join(H, 'lezioni.json'), encoding='utf-8'))}
n = sys.argv[1]; solo = sys.argv[2:]
ini = next(i for i, r in enumerate(righe) if r.startswith(f'U{n} = dict('))
fine = next((i for i, r in enumerate(righe) if i > ini and re.match(r'^U\d+ = dict\(', r)), len(righe))
for k in range(ini, fine):
    pass
starts = [(i, re.match(r"  LF?\('([^']+)'", righe[i]).group(1)) for i in range(ini, fine) if re.match(r"  LF?\('([^']+)'", righe[i])]
print(righe[ini])
for j, (i, key) in enumerate(starts):
    if solo and key not in solo: continue
    if ETI.get(key) not in ('A', 'B'): print(f'# {key} ({ETI.get(key)}): non si traduce'); continue
    e = starts[j + 1][0] if j + 1 < len(starts) else fine
    print(f'# ---- {key} ({ETI[key]})'); print('\n'.join(righe[i:e]).rstrip())
