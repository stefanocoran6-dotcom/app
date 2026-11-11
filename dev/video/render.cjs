// Render del TG Rally (Playwright + ffmpeg). Ogni fotogramma è disegnato da tg.js a partire dal tempo t.
//   node render.cjs info                              -> durata, fotogrammi, scene
//   node render.cjs eventi <eventi.json>              -> eventi per i suoni (sound.py)
//   node render.cjs still <out.jpg> <t> [scala]        -> un fotogramma da controllare
//   node render.cjs frames <out.mp4> <scala> <da> <a>  -> un pezzo di video (fotogrammi da..a-1)
// Legge render.html: rally4.js, video.js (la scheda del giorno), tempi.js (i tempi veri della voce), tg.js.
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs'); const { spawn } = require('child_process');
const FPS = 30;
(async () => {
  const [, , mode, out, a3, a4, a5] = process.argv;
  const sc = mode === 'frames' ? (+a3 || 1) : mode === 'still' ? (+a4 || 1) : 1;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: sc });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + path.resolve(__dirname, 'render.html'));
  await p.evaluate(() => window.ready);
  if (errs.length) { console.error('ERRORI', errs.slice(0, 5)); process.exit(1); }
  const info = await p.evaluate(() => ({ total: TG.T.total, eventi: TG.T.events, reali: !!window.TEMPI,
    scene: TG.T.sc.map((s) => ({ id: s.id, t0: +s.t0.toFixed(3), t1: +s.t1.toFixed(3) })) }));
  info.frames = Math.ceil(info.total * FPS);
  if (mode === 'info') console.log(JSON.stringify({ total: info.total, frames: info.frames, reali: info.reali, scene: info.scene }));
  else if (mode === 'eventi') { fs.writeFileSync(out, JSON.stringify(info)); console.log('eventi', info.eventi.length, 'totale', info.total.toFixed(2)); }
  else if (mode === 'still') {
    await p.evaluate((t) => draw(t), +a3);
    await p.screenshot({ path: out, type: 'jpeg', quality: 88 }); console.log('ok', out);
  } else if (mode === 'frames') {
    const f0 = +a4 || 0, f1 = Math.min(a5 != null ? +a5 : info.frames, info.frames), tmp = out.replace(/\.mp4$/, '.tmp.mp4');
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = f0; f < f1; f++) {
      await p.evaluate((t) => draw(t), f / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    const code = await new Promise((r) => ff.on('close', r));
    if (code !== 0) { console.error('ffmpeg', code); process.exit(1); }
    fs.renameSync(tmp, out); console.log('ok', out, f1 - f0, 'fotogrammi');
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
