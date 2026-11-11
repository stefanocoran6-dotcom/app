#!/usr/bin/env python3
"""Incorpora i due caratteri dell'app in fonts.css (dopo: npm i @fontsource-variable/bricolage-grotesque @fontsource/ibm-plex-mono)."""
import base64, os
D = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(D, 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2')
M = os.path.join(D, 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-%d-normal.woff2')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
css = ("@font-face{font-family:'Bricolage Grotesque';font-style:normal;font-weight:200 800;font-stretch:75%% 100%%;"
       "font-display:block;src:url(data:font/woff2;base64,%s) format('woff2');}\n" % b64(B))
for w in (600, 700):
    css += ("@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:%d;font-display:block;"
            "src:url(data:font/woff2;base64,%s) format('woff2');}\n" % (w, b64(M % w)))
open(os.path.join(D, 'fonts.css'), 'w').write(css)
print('fonts.css', len(css) // 1024, 'KB')
