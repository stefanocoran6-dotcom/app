#!/usr/bin/env python3
"""Pulisce le prese della voce prima di tempi.py: a volte il generatore aggiunge un rumore o qualche parola inventata
prima o dopo la battuta ("Point R." all'inizio, una frase senza senso o un colpo secco alla fine).

Uso: python3 pulisci.py <prese originali> <scene.json> <cartella uscita> [id ...]
Per ogni battuta il riconoscitore trova le parole del copione. Dopo l'ultima si taglia al primo silenzio vero
(0,3 s sotto -35 dB); prima della prima si taglia solo se il riconoscitore ha sentito parole in più, all'ultimo silenzio
che le separa dalla battuta. Scrive <uscita>/<id>.mp3 (le battute senza niente da togliere sono copiate uguali) e stampa i tagli."""
import difflib, json, os, shutil, subprocess, sys
import numpy as np
import tempi

src, scene_path, out = sys.argv[1:4]
scelte = set(sys.argv[4:])
os.makedirs(out, exist_ok=True)
M = tempi.model()
FR = 100                                                     # finestre da 10 ms


def energia(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32); w = 16000 // FR
    r = np.sqrt(np.mean(x[:len(x) // w * w].reshape(-1, w) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(r / r.max()), len(x) / 16000


def silenzio_dopo(db, t, minimo=.3, soglia=-35):
    """Il primo tratto di almeno minimo secondi sotto soglia dopo t: dove comincia."""
    n = int(minimo * FR); k = int(t * FR)
    while k + n <= len(db):
        if np.all(db[k:k + n] < soglia): return k / FR
        k += 1
    return None


def silenzio_prima(db, t, minimo=.3, soglia=-35):
    """L'ultimo tratto di almeno minimo secondi sotto soglia prima di t: dove finisce."""
    n = int(minimo * FR); k = int(t * FR)
    while k - n >= 0:
        if np.all(db[k - n:k] < soglia): return k / FR
        k -= 1
    return None


for s in json.load(open(scene_path, encoding='utf-8')):
    if scelte and s['id'] not in scelte: continue
    tempi.LINGUA = s.get('lingua', 'it')
    p = os.path.join(src, s['id'] + '.mp3'); q = os.path.join(out, s['id'] + '.mp3')
    db, dur = energia(p)
    segs, _ = M.transcribe(p, language=tempi.LINGUA, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    W = [w for sg in segs for w in (sg.words or [])]
    rif = ''.join(tempi.nrm(x) for x in s['dice'].split())
    a = [tempi.nrm(x) for x in s['dice'].split()]; b = tempi.nrm_sentite(W, rif)
    bl = [m for m in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks() if m.size]
    if not bl:
        print(f"[{s['id']}] NIENTE IN COMUNE CON IL COPIONE: «{' '.join(w.word.strip() for w in W)}» · da rifare"); shutil.copy(p, q); continue
    i0 = max(0, bl[0].b - bl[0].a)                            # parole del copione sentite in modo diverso all'inizio o alla fine
    i1 = min(len(W) - 1, bl[-1].b + bl[-1].size - 1 + len(a) - (bl[-1].a + bl[-1].size))
    da, a_ = 0.0, dur
    fine = silenzio_dopo(db, W[i1].end)
    if fine is not None and fine + .12 < dur and np.any(db[int((fine + .12) * FR):] > -30): a_ = fine + .12
    if i0 > 0:
        inizio = silenzio_prima(db, W[i0].start)
        if inizio is not None: da = max(0.0, inizio - .1)
    tolto = [f"prima {da:.2f} s («{' '.join(w.word.strip() for w in W[:i0])}»)"] if da > 0 else []
    if a_ < dur: tolto.append(f"dopo {dur - a_:.2f} s" + (f" («{' '.join(w.word.strip() for w in W[i1 + 1:])}»)" if i1 + 1 < len(W) else ' (rumore)'))
    if not tolto: shutil.copy(p, q); print(f"[{s['id']}] a posto"); continue
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', p, '-af', f'atrim={da:.3f}:{a_:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse',
                    '-codec:a', 'libmp3lame', '-q:a', '2', q], check=True)
    print(f"[{s['id']}] tolto: " + ' · '.join(tolto))
