# I numeri della storia di «Azioni» e gli attrezzi comuni a tutti i capitoli (la scheda di Velonda, le tabelle delle tre aziende).
# Ogni cifra delle lezioni esce da qui: se ne cambia una, i controlli sotto dicono dove i conti non tornano. La storia a parole è in AZIONI.md.
from fractions import Fraction as Fr
from lezioni_lib import SCHEDA

# =====================================================================================================
# I CONTI DELLE TRE AZIENDE (milioni di euro, tranne prezzo e azioni)
# AMM = ammortamenti · CFO = flusso di cassa operativo · DIV = dividendi pagati in tutto · G = crescita degli utili attesa dagli analisti per i prossimi anni (%)
# =====================================================================================================
AZ = dict(
    velonda=dict(P=12, N=20, R=300, EBIT=24, AMM=6, INT=4, U=15, PN=120, D=80, C=20, CFO=20, DIV=9, G=8),
    pedalta=dict(P=45, N=4, R=120, EBIT=12.5, AMM=2.5, INT=0.5, U=9, PN=45, D=10, C=20, CFO=10, DIV=2.25, G=15),
    nordciclo=dict(P=4.2, N=50, R=525, EBIT=38, AMM=9.5, INT=10, U=21, PN=300, D=200, C=30, CFO=30, DIV=15, G=2))
def conti(a):
    cap = a['P'] * a['N']; ev = cap + a['D'] - a['C']; eps = a['U'] / a['N']; ebitda = a['EBIT'] + a['AMM']
    return dict(cap=cap, eps=eps, pe=cap / a['U'], bvps=a['PN'] / a['N'], pb=cap / a['PN'], ps=cap / a['R'], ev=ev, evebit=ev / a['EBIT'], roe=a['U'] / a['PN'], marg=a['U'] / a['R'],
                ebitda=ebitda, evebitda=ev / ebitda, evs=ev / a['R'], pcf=cap / a['CFO'], cfps=a['CFO'] / a['N'], dps=a['DIV'] / a['N'], pay=a['DIV'] / a['U'], dy=a['DIV'] / cap,
                eps1=eps * (1 + a['G'] / 100), pe1=a['P'] / (eps * (1 + a['G'] / 100)), gsost=(1 - a['DIV'] / a['U']) * a['U'] / a['PN'])
K = {k: conti(v) for k, v in AZ.items()}
vicino = lambda a, b, e=1e-9: abs(a - b) < e
for k, a in AZ.items():   # il conto economico torna: (risultato operativo - interessi) meno il 25% di imposte = utile netto; interessi = 5% dei debiti
    assert vicino((a['EBIT'] - a['INT']) * 0.75, a['U']), k
    assert vicino(a['INT'], 0.05 * a['D']), k
    assert vicino(K[k]['pb'], K[k]['pe'] * K[k]['roe']) and vicino(K[k]['ps'], K[k]['pe'] * K[k]['marg']), k
V, PD, NC = K['velonda'], K['pedalta'], K['nordciclo']
assert (V['cap'], PD['cap'], NC['cap']) == (240, 180, 210)
assert (V['eps'], PD['eps'], round(NC['eps'], 2)) == (0.75, 2.25, 0.42)
assert [round(x['pe'], 6) for x in (V, PD, NC)] == [16, 20, 10]
assert [round(x['pb'], 6) for x in (V, PD, NC)] == [2, 4, 0.7]
assert [round(x['ps'], 6) for x in (V, PD, NC)] == [0.8, 1.5, 0.4]
assert (V['ev'], PD['ev'], NC['ev']) == (300, 170, 380)
assert [round(x['evebit'], 6) for x in (V, PD, NC)] == [12.5, 13.6, 10]
assert [round(x['roe'], 6) for x in (V, PD, NC)] == [0.125, 0.2, 0.07]
assert [round(x['marg'], 6) for x in (V, PD, NC)] == [0.05, 0.075, 0.04]
# ---- i numeri nati con la seconda stesura del capitolo 5 ----
assert (V['ebitda'], PD['ebitda'], NC['ebitda']) == (30, 15, 47.5)
assert [round(x['evebitda'], 2) for x in (V, PD, NC)] == [10, 11.33, 8]
assert [round(x['evs'], 1) for x in (V, PD, NC)] == [1.0, 1.4, 0.7]
assert [round(x['pcf'], 6) for x in (V, PD, NC)] == [12, 18, 7]                       # prezzo su flusso di cassa operativo
assert [round(x['cfps'], 6) for x in (V, PD, NC)] == [1, 2.5, 0.6]
assert [round(x['dps'], 4) for x in (V, PD, NC)] == [0.45, 0.5625, 0.3]               # dividendo per azione
assert [round(x['pay'], 4) for x in (V, PD, NC)] == [0.6, 0.25, 0.7143]               # payout
assert [round(x['dy'] * 100, 2) for x in (V, PD, NC)] == [3.75, 1.25, 7.14]           # rendimento del dividendo
assert [round(x['gsost'], 6) for x in (V, PD, NC)] == [0.05, 0.15, 0.02]              # crescita sostenibile = quota trattenuta x ROE
assert [round(x['eps1'], 4) for x in (V, PD, NC)] == [0.81, 2.5875, 0.4284]           # utile per azione atteso tra un anno
assert [round(x['pe1'], 1) for x in (V, PD, NC)] == [14.8, 17.4, 9.8]                 # P/E atteso
# il flusso di cassa di Velonda: utile 15 + ammortamenti 6 - 1 di magazzino e crediti in più = 20; meno 14 di investimenti, più 3 di debiti nuovi = 9, cioè i dividendi
VCASSA = dict(ccn=1, inv=14, debiti=3)
assert AZ['velonda']['U'] + AZ['velonda']['AMM'] - VCASSA['ccn'] == AZ['velonda']['CFO'] == 20
assert AZ['velonda']['CFO'] - VCASSA['inv'] + VCASSA['debiti'] == AZ['velonda']['DIV'] == 9
assert AZ['pedalta']['U'] + AZ['pedalta']['AMM'] - 1.5 == AZ['pedalta']['CFO'] and AZ['nordciclo']['U'] + AZ['nordciclo']['AMM'] - 0.5 == AZ['nordciclo']['CFO']
# tutto cresce del 5%: utili trattenuti 6 su 120 di patrimonio; debito netto da 60 a 63
assert vicino((15 - 9) / 120, 0.05) and vicino((80 + 3 - 20) / 60, 1.05)
# ---- la prima strada (i soldi che arriveranno): Nora chiede il 9% (3% senza rischio + 6% per il rischio) ----
R9 = Fr(9, 100); G5 = Fr(5, 100)
DIVN = [Fr(48, 100), Fr(51, 100), Fr(54, 100)]                                          # i dividendi annunciati per i prossimi tre anni
assert (DIVN[0] + Fr(1260, 100)) / (1 + R9) == 12                                       # un anno: dividendo 0,48 e rivendita a 12,60
PVD = [DIVN[k] / (1 + R9) ** (k + 1) for k in range(3)]
assert [round(float(x), 2) for x in PVD] == [0.44, 0.43, 0.42] and round(float(sum(PVD)), 2) == 1.29
assert round(float(sum(PVD) + 14 / (1 + R9) ** 3), 2) == 12.10                          # tre anni, rivendita a 14
assert round(float((DIVN[2] + 14) / (1 + R9) ** 3), 2) == 11.23
assert DIVN[0] / (R9 - G5) == 12                                                        # Gordon: 0,48 / (9% - 5%)
assert [float(DIVN[0] / (R9 - Fr(g, 100))) for g in (4, 5, 6, 7)] == [9.6, 12, 16, 24]
assert [float(DIVN[0] / (Fr(r, 100) - G5)) for r in (8, 9, 10, 11)] == [16, 12, 9.6, 8]
assert DIVN[0] / 12 + G5 == R9                                                          # il rendimento nascosto nel prezzo: 4% + 5%
P3 = DIVN[2] * (1 + G5) / (R9 - G5)                                                     # due fasi: il valore finale tra tre anni
assert P3 == Fr(14175, 1000) and round(float(P3 / (1 + R9) ** 3), 2) == 10.95 and round(float(sum(PVD) + P3 / (1 + R9) ** 3), 2) == 12.23
assert Fr(60, 100) / (R9 - G5) == 15                                                    # il P/E giusto di Velonda sugli utili attesi
assert round(0.30 * 1.02 / (0.10 - 0.02), 3) == 3.825 and round((15 / 21) / (0.10 - 0.02), 1) == 8.9   # Nordciclo, per cui Nora chiede il 10%
assert round(0.306 / 4.2 * 100, 1) == 7.3
# ---- la seconda strada (il confronto) ----
media = lambda a, b: (a + b) / 2
assert vicino(media(PD['pe'], NC['pe']) * V['eps'], 11.25)
assert vicino(media(PD['pcf'], NC['pcf']) * V['cfps'], 12.5)
assert vicino(media(PD['pb'], NC['pb']) * V['bvps'], 14.1) and vicino(media(PD['ps'], NC['ps']) * 15, 14.25)
assert vicino(media(PD['evebitda'], NC['evebitda']) * V['ebitda'], 290) and vicino((290 - 60) / 20, 11.5)
assert vicino(14 * V['eps'], 10.5)                                                      # contro la sua storia: P/E medio di dieci anni 14
# ---- la terza strada (i pezzi) e la liquidazione ----
PEZZI = [('Fabbriche e terreni', 110, 140), ('Marchio', 0, 20), ('Magazzino', 70, 62), ('Crediti verso i clienti', 50, 48), ('Cassa', 20, 20)]
assert sum(p[1] for p in PEZZI) == 250 and sum(p[2] for p in PEZZI) == 290 and 250 - 130 == AZ['velonda']['PN']
assert vicino((290 - 130) / 20, 8) and vicino((200 - 130) / 20, 3.5)
# ---- l'utile per azione diluito (ipotesi di scuola: Velonda non ha né convertibili né opzioni) ----
assert vicino((15 + 20 * 0.05 * 0.75) / (20 + 2.5), 0.70)                               # prestito convertibile da 20 milioni al 5%, in 2,5 milioni di azioni
assert vicino(3 - 3 * 8 / 12, 1) and round(15 / 21, 2) == 0.71                          # 3 milioni di opzioni a 8 euro, con l'azione a 12
assert vicino(15 / 22, 0.6818181818181818)                                              # media pesata: 20 milioni per sei mesi, 24 per gli altri sei

# la scheda di Velonda: in ogni pagina si mettono in evidenza le voci che servono lì
RIGHE = [("Prezzo di un'azione", '12 €'), ('Numero di azioni', '20 milioni'), ('Ricavi', '300 milioni'), ('Risultato operativo', '24 milioni'), ('Utile netto', '15 milioni'),
         ('Patrimonio netto', '120 milioni'), ('Debiti finanziari', '80 milioni'), ('Cassa', '20 milioni')]
def scheda(*hl, cap=None, tutta=False):
    d = SCHEDA('Velonda', 'Bici da città ed elettriche', RIGHE, hl, cap)
    if tutta: d['full'] = 1
    return d
