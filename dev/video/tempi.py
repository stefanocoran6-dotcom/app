#!/usr/bin/env python3
"""Voce del TG Rally: taglia i silenzi, trova i tempi di ogni parola e prepara la traccia della voce.

Uso: python3 tempi.py <cartella con <id>.mp3> <scene.json> [cartella di uscita]
Con PAUSA=0.6 i silenzi dentro una battuta più lunghi di 0,6 s si accorciano a 0,6 s (alcune voci si fermano troppo dopo i due punti).
Scrive tempi.js (window.TEMPI, letto da tg.js), tempi.json e voce.wav (mono, 48 kHz),
e stampa il controllo: che cosa ha capito il riconoscitore vocale e quali parole del copione non ha sentito.
La lingua (it o en) arriva da scene.json, cioè da VIDEO.lingua della scheda."""
import difflib, json, os, re, subprocess, sys, unicodedata
import numpy as np
from scipy.io import wavfile

SR, FPS, START, ARIA, HOLD = 48000, 30, .2, .3, 1.4      # come tg.js: inizio, aria tra le battute, fermo finale
TEMPO = float(os.environ.get('TEMPO', '1'))             # sopra 1 la voce va più veloce, con lo stesso tono
PAUSA = float(os.environ.get('PAUSA', '0'))             # se più di 0: la pausa più lunga dentro una battuta, in secondi

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


EN_U = ('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen '
        'seventeen eighteen nineteen').split()
EN_D = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']


def num_en(n):
    if n < 20: return EN_U[n]
    if n < 100: return EN_D[n // 10] + (EN_U[n % 10] if n % 10 else '')
    for v, nome in ((10 ** 12, 'trillion'), (10 ** 9, 'billion'), (10 ** 6, 'million'), (1000, 'thousand'), (100, 'hundred')):
        if n >= v:
            q, r = divmod(n, v)
            return num_en(q) + nome + (num_en(r) if r else '')


def varianti_en(n):
    """I modi di leggere un numero in inglese: 1993 nineteen ninety three, 2007 two thousand seven, 128 one twenty eight."""
    v = [num_en(n)]
    if 1100 <= n <= 9999 and n % 100 >= 10 and not 2000 <= n <= 2009: v.insert(0, num_en(n // 100) + num_en(n % 100))
    if 100 <= n <= 999 and n % 100: v.append(num_en(n // 100) + num_en(n % 100))
    return v


LINGUA = 'it'


def nrm(w, rif=''):
    """Una parola ridotta a sole lettere, per confrontare copione e trascrizione (17 -> diciassette, o seventeen).
    rif: il copione già ridotto, per scegliere tra più letture di un numero quella che c'è nel copione."""
    w = w.lower().replace('’', "'")
    if LINGUA == 'en':
        w = re.sub(r'(?<=\d),(?=\d{3})', '', w).replace('%', ' percent ').replace('$', '').replace('€', ' euros ')
        def n_en(m):
            v = varianti_en(int(m.group()))
            return next((x for x in v if x in rif), v[0])
        w = re.sub(r'\d+', n_en, w)
    else:
        w = w.replace('€', ' euro ').replace('%', ' percento ')
        w = re.sub(r'\d+', lambda m: num(int(m.group())), w)
    w = ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z]', '', w)


GRANDI = {'million', 'billion', 'trillion', 'millions', 'billions', 'trillions'}


def nrm_sentite(words, rif):
    """Le parole riconosciute, ridotte. In inglese "$5 trillion" diventa five / trillion dollars, come si dice."""
    out = [nrm(w.word, rif) for w in words]
    if LINGUA == 'en':
        for i, w in enumerate(words):
            if '$' in w.word:
                j = i + 1 if i + 1 < len(words) and nrm(words[i + 1].word) in GRANDI else i
                out[j] += 'dollars'
    return out


def load(p):
    af = ['-af', f'atempo={TEMPO}'] if TEMPO != 1 else []
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, *af, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
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


def stringi(x, massimo, rel_db=-38):
    """Accorcia i silenzi interni più lunghi di massimo secondi: ne tiene metà all'inizio e metà alla fine."""
    w = int(.01 * SR); r = 20 * np.log10(rms_win(x, w) / rms_win(x, w).max())
    zitto = r < rel_db; pezzi, i, tolti = [], 0, 0.0
    k = 0
    while k < len(zitto):
        if not zitto[k]: k += 1; continue
        j = k
        while j < len(zitto) and zitto[j]: j += 1
        if k > 0 and j < len(zitto) and (j - k) * .01 > massimo:      # solo dentro la battuta, non all'inizio o alla fine
            a, b = (k + int(massimo * 50)) * w, (j - int(massimo * 50)) * w
            pezzi.append(x[i:a]); i = b; tolti += (b - a) / SR
        k = j
    pezzi.append(x[i:])
    return np.concatenate(pezzi), tolti


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


def align(dice, words, nw, dur):
    """Tempo d'inizio e fine di ogni parola del copione, a partire dalle parole riconosciute (confronto lettera per lettera)."""
    sw = dice.split()
    S, Sk = [], []
    for k, w in enumerate(sw):
        for ch in nrm(w): S.append(ch); Sk.append(k)
    Wc, Wt, Wd = [], [], []
    for w, n in zip(words, nw):
        step = (w.end - w.start) / max(1, len(n))
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


def main():
  global LINGUA
  vdir, scene_path = sys.argv[1], sys.argv[2]
  out = sys.argv[3] if len(sys.argv) > 3 else '.'
  scene = json.load(open(scene_path, encoding='utf-8'))
  M = model()
  T, clips, t, ok = {'fps': FPS}, [], START, True
  for s in scene:
    LINGUA = s.get('lingua', 'it')
    t += s.get('pausa', 0)                              # respiro in più (prima di un capitolo): lo calcola scene.cjs come tg.js
    x = level(trim(load(os.path.join(vdir, s['id'] + '.mp3'))))
    tolti = 0.0
    if PAUSA > 0: x, tolti = stringi(x, PAUSA)
    path = os.path.join(out, 'voce_' + s['id'] + '.wav')
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    dur = len(x) / SR
    segs, _ = M.transcribe(path, language=LINGUA, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    words = [w for sg in segs for w in (sg.words or [])]
    rif = ''.join(nrm(w) for w in s['dice'].split())
    b = nrm_sentite(words, rif)
    st, en, found = align(s['dice'], words, b, dur)
    heard = ' '.join(w.word.strip() for w in words)
    a = [nrm(w) for w in s['dice'].split()]
    ratio = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
    missing = [w for w in s['dice'].split() if nrm(w) and nrm(w) not in ''.join(b)]
    if ratio < .8 or missing: ok = False
    print(f"[{s['id']}] {dur:.2f} s" + (f" (pause accorciate di {tolti:.2f} s)" if tolti else '') + f" · parole uguali {ratio:.0%} · trovate {found}/{len(st)}" + (f" · NON SENTITE: {missing}" if missing else ''))
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


if __name__ == '__main__':
  main()
