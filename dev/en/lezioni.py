# Etichetta ogni lezione delle Basi per la versione inglese. Scrive lezioni.json.
#   A = si traduce così com'è
#   B = si traduce, ma contiene esempi o regole italiane: restano uguali, con il Paese detto in chiaro (vedi LEGGIMI.md)
#   E = regole europee con dettagli italiani: secondo giro, dopo la scelta del Paese
#   C = vale solo in Italia: per ora non si traduce
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
SOLO_ITALIA = {'basi-u12': 'tutta', 'basi-u14': 'tutta', 'basi-13-3': 1, 'basi-13-4': 1, 'basi-13-5': 1, 'basi-4-7': 1, 'basi-8-7': 1}
EUROPA = {'basi-u11': 'tutta'}
SEGNI = ['ISTAT', 'IRPEF', 'INPS', "Banca d'Italia", 'CONSOB', 'Consob', 'IVASS', 'COVIP', 'BTP', 'BOT', 'FTSE MIB', 'bollo', 'Consap', 'ABF', 'ACF', 'TFR', 'ISEE', 'in Italia', 'italian',
         'Italia', 'Agenzia delle Entrate', 'CRIF', 'AGCOM', 'ARERA', 'Poste', 'SPID', 'codice fiscale', 'Polizia Postale', '26%', '12,5%', 'Piazza Affari', 'Milano']
def testo(o, skip=('key', 'id', 'sid', 'type', 'model', 'sym', 'unit', 'cond', 'params', 'widget')):
    if isinstance(o, str): yield o
    elif isinstance(o, list):
        for x in o: yield from testo(x)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in skip: yield from testo(v)
units = json.load(open(os.path.join(H, '..', 'ordine', 'basi.json'), encoding='utf-8'))
out, conta = [], dict(A=0, B=0, E=0, C=0)
for u in units:
    for l in u['lessons']:
        t = ' '.join(testo(l)); segni = [s for s in SEGNI if re.search(r'(?<![A-Za-zÀ-ú])' + re.escape(s) + r'(?![A-Za-zÀ-ú])', t)]
        segni = [s for s in segni if not (s == 'Italia' and 'in Italia' in segni)]
        e = 'C' if (u['id'] in SOLO_ITALIA or l['key'] in SOLO_ITALIA) else 'E' if u['id'] in EUROPA else 'B' if segni else 'A'
        conta[e] += 1; out.append(dict(unita=u['id'], nome_unita=u['name'], key=l['key'], titolo=l['title'], etichetta=e, parole=len(re.findall(r'\w+', t)), segni_italiani=segni))
json.dump(out, open(os.path.join(H, 'lezioni.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(conta, '| parole A+B:', sum(x['parole'] for x in out if x['etichetta'] in 'AB'))
for x in out:
    if x['etichetta'] == 'B': print(' B', x['key'], x['titolo'], x['segni_italiani'])
