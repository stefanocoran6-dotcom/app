#!/usr/bin/env python3
"""Unisce due prese della stessa battuta: l'inizio da una, il resto dall'altra, tagliando nel silenzio tra due parole.
Serve quando ogni presa sbaglia una parola diversa: rifarla ancora costerebbe crediti senza garanzie.

Uso: python3 giunta.py <presa A> <presa B> <ultima parola da A> <prima parola da B> <uscita.mp3> [lingua: it o en]
Esempio: python3 giunta.py voce/c5d.mp3 prova/c5d.mp3 dollari bastano voce/c5d.mp3
Poi si rifà tempi.py, che ricontrolla le parole della battuta unita."""
import subprocess, sys
from faster_whisper import WhisperModel


def modello():
    try:
        return WhisperModel('small', device='cpu', compute_type='int8', download_root='/opt/whisper-models', local_files_only=True)
    except Exception:
        return WhisperModel('small', device='cpu', compute_type='int8')


M = modello()


def parole(p):
    segs, _ = M.transcribe(p, language=LINGUA, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    return [(w.word.strip().lower().strip('.,:;!?'), w.start, w.end) for s in segs for w in (s.words or [])]


a, b, wa, wb, out = sys.argv[1:6]
LINGUA = sys.argv[6] if len(sys.argv) > 6 else 'it'
A, B = parole(a), parole(b)
ea = [w for w in A if w[0] == wa][0][2]; dopo = [w for w in A if w[1] > ea]
ea = min(ea + 0.12, (dopo[0][1] - 0.02) if dopo else ea + 0.12)          # un attimo dopo la parola, prima della successiva
sb = [w for w in B if w[0] == wb][0][1]; prima = [w for w in B if w[2] < sb]
sb = max(sb - 0.1, (prima[-1][2] + 0.02) if prima else 0)                 # un attimo prima della parola, dopo la precedente
print(f'A fino a {ea:.2f} s · B da {sb:.2f} s')
F = 'aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a, '-i', b, '-filter_complex',
                f'[0:a]atrim=0:{ea:.3f},afade=t=out:st={ea - 0.03:.3f}:d=0.03,{F}[x];anullsrc=r=44100:cl=mono,atrim=0:0.22,{F}[s];'
                f'[1:a]atrim=start={sb:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,{F}[y];[x][s][y]concat=n=3:v=0:a=1[o]',
                '-map', '[o]', '-codec:a', 'libmp3lame', '-q:a', '2', out], check=True)
