#!/usr/bin/env python3
"""Voce del TG Rally: taglia i silenzi, trova i tempi di ogni parola e prepara la traccia della voce.

Uso: python3 tempi.py <cartella con <id>.mp3> <scene.json> [cartella di uscita]
Scrive tempi.js (window.TEMPI, letto da tg.js), tempi.json e voce.wav (mono, 48 kHz),
e stampa il controllo: che cosa ha capito il riconoscitore vocale e quali parole del copione non ha sentito."""
import difflib, json, os, re, subprocess, sys, unicodedata
import numpy as np
from scipy.io import wavfile

SR, FPS, START, ARIA, HOLD = 48000, 30, .2, .3, 1.4      # come tg.js: inizio, aria tra le battute, fermo finale
vdir, scene_path = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else '.'
scene = json.load(open(scene_path, encoding='utf-8'))

UNI = ('zero uno due tre quattro cinque sei sette otto nove dieci undici dodici tredici quattordici quindici '
       'sedici diciassette diciotto diciannove').split()
DEC = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta']


def num(n):
    if n < 20: return UNI[n]
    if n < 100:
        d, u = DEC[n // 10], n % 10
        return d if not u else (d[:-1] if u in (1, 8) else d) + UNI[u]
    if n < 1000:
        c, r = divmod(n, 100)
        return ('' if c == 1 else UNI[c]) + 'cento' + (num(r) if r else '')
    if n < 1000000:
        m, r = divmod(n, 1000)
        return ('mille' if m == 1 else num(m) + 'mila') + (num(r) if r else '')
    return str(n)


def nrm(w):
    """Una parola ridotta a sole lettere, per confrontare copione e trascrizione (17 -> diciassette)."""
    w = w.lower().replace('’', "'").replace('€', ' euro ').replace('%', ' percento ')
    w = re.sub(r'\d+', lambda m: num(int(m.group())), w)
    w = ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z]', '', w)


def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def rms_win(x, w):
    n = len(x) // w
    return np.sqrt(np.mean(x[:n * w].reshape(n, w) ** 2, axis=1) + 1e-12)


def trim(x, rel_db=-38, pad=.035):
    w = int(.01 * SR); r = rms_win(x, w)
    idx = np.where(20 * np.log10(r / r.max()) > rel_db)[0]
    a = max(0, idx[0] * w - int(pad * SR)); b = min(len(x), (idx[-1] + 1) * w + int(pad * SR))
    return x[a:b]


def level(x, target_db=-20.0):
    """Stesso volume per tutte le battute: il parlato (finestre attive) a -20 dBFS."""
    r = rms_win(x, int(.02 * SR)); act = r[r > r.max() * 10 ** (-35 / 20)]
    g = 10 ** (target_db / 20) / (np.sqrt(np.mean(act ** 2)) + 1e-12)
    y = x * g; pk = np.max(np.abs(y))
    return y * (.89 / pk) if pk > .89 else y


def model():
    from faster_whisper import WhisperModel
    try:
        return WhisperModel('small', device='cpu', compute_type='int8', download_root='/opt/whisper-models', local_files_only=True)
    except Exception:
        return WhisperModel('small', device='cpu', compute_type='int8')


def align(dice, words, dur):
    """Tempo d'inizio e fine di ogni parola del copione, a partire dalle parole riconosciute (confronto lettera per lettera)."""
    sw = dice.split()
    S, Sk = [], []
    for k, w in enumerate(sw):
        for ch in nrm(w): S.append(ch); Sk.append(k)
    Wc, Wt, Wd = [], [], []
    for w in words:
        n = nrm(w.word); step = (w.end - w.start) / max(1, len(n))
        for j, ch in enumerate(n): Wc.append(ch); Wt.append(w.start + j * step); Wd.append(step)
    st, en = [None] * len(sw), [None] * len(sw)
    for a, b, size in difflib.SequenceMatcher(None, ''.join(S), ''.join(Wc), autojunk=False).get_matching_blocks():
        for i in range(size):
            k, t = Sk[a + i], Wt[b + i]
            if st[k] is None: st[k] = t
            en[k] = t + Wd[b + i]
    found = sum(1 for x in st if x is not None)
    k = 0
    while k < len(sw):                                   # parole non sentite: tra le vicine, in proporzione alla lunghezza
        if st[k] is not None: k += 1; continue
        j = k
        while j < len(sw) and st[j] is None: j += 1
        t0 = en[k - 1] if k else 0.0
        t1 = st[j] if j < len(sw) else dur
        L = [max(1, len(nrm(sw[i]))) for i in range(k, j)]; acc = t0
        for i, li in zip(range(k, j), L):
            d = (t1 - t0) * li / sum(L); st[i], en[i] = acc, acc + d; acc += d
        k = j
    for k in range(len(sw)):
        if k and st[k] < st[k - 1] + .04: st[k] = st[k - 1] + .04
    for k in range(len(sw)):
        if k + 1 < len(sw): en[k] = min(en[k], st[k + 1])
        en[k] = max(en[k], st[k] + .05)
    return st, en, found


M = model()
T, clips, t, ok = {'fps': FPS}, [], START, True
for s in scene:
    x = level(trim(load(os.path.join(vdir, s['id'] + '.mp3'))))
    path = os.path.join(out, 'voce_' + s['id'] + '.wav')
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    dur = len(x) / SR
    segs, _ = M.transcribe(path, language='it', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    words = [w for sg in segs for w in (sg.words or [])]
    st, en, found = align(s['dice'], words, dur)
    heard = ' '.join(w.word.strip() for w in words)
    a, b = [nrm(w) for w in s['dice'].split()], [nrm(w.word) for w in words]
    ratio = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
    missing = [w for w in s['dice'].split() if nrm(w) and nrm(w) not in ''.join(b)]
    if ratio < .8 or missing: ok = False
    print(f"[{s['id']}] {dur:.2f} s · parole uguali {ratio:.0%} · trovate {found}/{len(st)}" + (f" · NON SENTITE: {missing}" if missing else ''))
    print('   sentito:', heard)
    T[s['id']] = {'t0': round(t, 3), 'dur': round(dur, 3),
                  'parole': [{'t': round(t + p, 3), 'end': round(t + q, 3)} for p, q in zip(st, en)]}
    clips.append((t, x)); t += dur + ARIA
total = t - ARIA + HOLD
voce = np.zeros(int(round(total * SR)) + 1)
for t0, x in clips:
    i = int(round(t0 * SR)); voce[i:i + len(x)] += x
w = SR // FPS; nf = int(np.ceil(total * FPS)) + 1
pad = np.concatenate([np.zeros(w // 2), voce, np.zeros(w * 2)])
r = np.array([np.sqrt(np.mean(pad[f * w:f * w + w] ** 2)) for f in range(nf)])
ref = np.percentile(r[r > 1e-4], 95) if np.any(r > 1e-4) else 1
T['env'] = [round(float(min(1, v / ref)), 3) for v in r]
T['total'] = round(total, 3)
wavfile.write(os.path.join(out, 'voce.wav'), SR, (np.clip(voce, -1, 1) * 32767).astype(np.int16))
json.dump(T, open(os.path.join(out, 'tempi.json'), 'w'))
open(os.path.join(out, 'tempi.js'), 'w').write('window.TEMPI=' + json.dumps(T) + ';\n')
print(f"totale {total:.2f} s · {'parole a posto' if ok else 'DA CONTROLLARE: qualche parola non torna'}")
