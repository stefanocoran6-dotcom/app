#!/usr/bin/env python3
"""Effetti sonori del TG Rally e mix con la voce. Gli effetti sono sintetizzati qui: niente scaricato, niente diritti di altri.

Uso: python3 sound.py <eventi.json> <voce.wav> <mix.wav>
eventi.json viene da `node render.cjs eventi eventi.json`: una sola fonte dei tempi, così ogni suono cade sul suo fotogramma.
Stampa i livelli: volume finale (LUFS), picco, di quanto gli effetti stanno sotto la voce."""
import json, re, subprocess, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
info = json.load(open(sys.argv[1], encoding='utf-8'))
sr, v = wavfile.read(sys.argv[2]); assert sr == SR, sr
out = sys.argv[3]
v = v.astype(np.float64) / 32768.0
N = max(len(v), int(info['total'] * SR) + 1)
voce = np.zeros(N); voce[:len(v)] = v
rng = np.random.default_rng(11)


def T(d): return np.arange(int(d * SR)) / SR
def env(n, a=.003, tau=.1):
    t = np.arange(n) / SR; e = np.exp(-t / tau); k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k); return e
def band(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
def noise(n): return rng.standard_normal(n)
def unit(y): return y / (np.max(np.abs(y)) + 1e-12)


# --- i suoni del TG: pochi e sempre gli stessi, pensati per l'altoparlante del telefono (300 Hz - 5 kHz) ---
def marimba(f, d=.6, tau=.2):
    t = T(d)
    y = np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .025) + .1 * np.sin(2 * np.pi * 9.8 * f * t) * np.exp(-t / .01)
    return y * env(len(t), .002, tau)
def glide(f0, f1, d):
    t = T(d); f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** .7
def whoosh(d=.32):
    n = int(d * SR); x = noise(n); u = np.arange(n) / n; y = np.zeros(n)
    B = [(450, 800), (800, 1400), (1400, 2500), (2500, 4500)]
    for i, (lo, hi) in enumerate(B):
        y += band(x, lo, hi) * np.exp(-((u - (i + .5) / len(B)) / .24) ** 2)
    return y * np.sin(np.pi * u) ** .6
def click(f=1500, d=.05):
    t = T(d); n = len(t)
    return np.sin(2 * np.pi * f * t) * env(n, .001, .01) + .6 * band(noise(n), 1800, 6000) * env(n, .0005, .005)
def pop(f=700, d=.12):
    t = T(d); fr = f * (1 + 1.3 * np.exp(-t / .01))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(t), .001, .028)
def thump():
    t = T(.28); n = len(t); fr = 230 * (1 + .9 * np.exp(-t / .018))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, .001, .055) + .8 * band(noise(n), 450, 3200) * env(n, .0005, .018)
def coin():
    t = T(.7)
    y = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / tau) for f, a, tau in ((2093, 1, .25), (2637, .45, .2), (3136, .55, .16), (4186, .3, .09)))
    return y * env(len(t), .001, 9)


sfx = np.zeros(N)
def put(t, y, g):
    i = int(round(t * SR)); y = unit(y)
    if i >= N: return
    if i < 0: y, i = y[-i:], 0
    j = min(N, i + len(y)); sfx[i:j] += g * y[:j - i]


nn = 0
for e in info['eventi']:
    t, k = e['t'], e['tipo']
    if k == 'apertura': put(t, whoosh(.38), .45); put(t + .40, pop(640), .5); put(t + .42, marimba(523.25, .55, .17), .45)
    elif k == 'timbro': put(t, thump(), .9); put(t + .01, click(1100, .04), .3)
    elif k == 'cambio': put(t, whoosh(.3), .4)
    elif k == 'numero':
        put(t + .01, pop(820 + 180 * nn), .35); put(t + .02, marimba((783.99, 1046.5)[min(nn, 1)], .45, .14), .35); nn += 1
    elif k == 'sale': put(t, glide(420, 980, .32), .35)
    elif k == 'moneta': put(t + .26, coin(), .6); put(t + .46, click(2600, .04), .25); put(t + .6, click(2600, .03), .15)
    elif k == 'scende': put(t, glide(980, 470, .34), .33); put(t + .2, click(1700), .35); put(t + .25, marimba(1318.5, .6, .2), .35)
    elif k == 'cartellino': put(t, click(1250, .06), .45); put(t + .005, pop(560, .1), .3)
    elif k == 'chiusura': put(t, pop(860, .1), .35)
    elif k == 'sigla':                                  # la firma sonora del TG, sempre uguale
        for i, f in enumerate((523.25, 659.25, 783.99, 1046.5)):
            put(t + i * .1, marimba(f, .8 if i == 3 else .5, .26 if i == 3 else .16), .5 if i < 3 else .62)

# --- livelli: comanda la voce ---
W = int(.4 * SR)
def wins(x):
    n = len(x) // W; return np.sqrt(np.mean(x[:n * W].reshape(n, W) ** 2, axis=1) + 1e-12)
k5 = int(.05 * SR); box = np.ones(k5) / k5
on = np.convolve(np.abs(voce), box, mode='same') > np.max(np.abs(voce)) * .03
sfx *= np.convolve(np.where(on, 10 ** (-4 / 20), 1.0), box, mode='same')     # dove parla Rally, effetti 4 dB più bassi
vr, act = wins(voce), None
act = vr > vr.max() * 10 ** (-30 / 20)
vref = np.median(vr[act])
sfx *= vref * 10 ** (-6 / 20) / (wins(sfx).max() + 1e-12)                    # l'effetto più forte resta 6 dB sotto la voce
sr_ = wins(sfx); n = min(len(sr_), len(vr))
marg = 20 * np.log10(np.max(sr_[:n][act[:n]] / vr[:n][act[:n]]) + 1e-12) if np.any(act[:n]) else -99
if marg > -10: sfx *= 10 ** ((-10 - marg) / 20); marg = -10.0                 # sotto la voce: almeno 10 dB
mix = voce + sfx
tmp = out.replace('.wav', '.grezzo.wav')
wavfile.write(tmp, SR, (np.clip(mix / max(1, np.max(np.abs(mix)) / .98), -1, 1) * 32767).astype(np.int16))

# --- volume finale: -14 LUFS, picco sotto -1 dB (loudnorm in due passate) ---
LN = 'loudnorm=I=-14:TP=-1.5:LRA=11'
p1 = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', LN + ':print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(p1[p1.rindex('{'):p1.rindex('}') + 1])
af = (f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', af, '-ar', str(SR), '-ac', '1', out], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', out, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', r); P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)
print(f"mix: {I[-1] if I else '?'} LUFS · picco {P[-1] if P else '?'} dB · effetti sotto la voce di {-marg:.1f} dB · {len(info['eventi'])} eventi")
