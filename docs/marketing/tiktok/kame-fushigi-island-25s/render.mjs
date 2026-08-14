#!/usr/bin/env node
/**
 * storyboard.html を 1080x1920 / 30fps の MP4 に書き出す。
 *
 *   node render.mjs [--fps 30] [--out kame-fushigi-island-25s.mp4] [--scale 1]
 *
 * 前提:
 *   npm i playwright        （ブラウザ本体は PLAYWRIGHT_BROWSERS_PATH の Chromium を使う）
 *   ffmpeg                  （見つからなければ Playwright 同梱／imageio-ffmpeg を自動探索）
 *
 * CSS アニメーションではなく storyboard.html の window.__seek(t) を
 * 1コマずつ呼んで描画するため、出力は毎回まったく同じになる（決定的）。
 */
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------- 引数 ----------
const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const FPS   = Number(arg('fps', 30));
const SCALE = Number(arg('scale', 1));
const OUT   = path.resolve(HERE, arg('out', 'kame-fushigi-island-25s.mp4'));
const W = 1080, H = 1920;

// ---------- ffmpeg を探す ----------
/** libx264 で H.264 を吐けるビルドかどうか。
 *  Playwright 同梱の ffmpeg は webm/VP8 専用の削減ビルドで libx264 を持たないため、
 *  必ずこの判定を通す。 */
function canEncodeH264(bin) {
  try {
    return execFileSync(bin, ['-hide_banner', '-encoders'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .includes('libx264');
  } catch { return false; }
}

function findFfmpeg() {
  const candidates = [];

  if (process.env.FFMPEG) candidates.push(process.env.FFMPEG);

  // PATH 上のフルビルド
  try {
    const p = execFileSync('bash', ['-lc', 'command -v ffmpeg'], { encoding: 'utf8' }).trim();
    if (p) candidates.push(p);
  } catch { /* noop */ }

  // imageio-ffmpeg（pip install imageio-ffmpeg）
  try {
    const p = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'],
      { encoding: 'utf8' }).trim();
    if (p) candidates.push(p);
  } catch { /* noop */ }

  // Playwright 同梱（最後の手段。libx264 が無ければ弾かれる）
  const pwRoot = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (existsSync(pwRoot)) {
    for (const d of readdirSync(pwRoot)) {
      if (d.startsWith('ffmpeg')) candidates.push(path.join(pwRoot, d, 'ffmpeg-linux'));
    }
  }

  for (const c of candidates) {
    if (c && existsSync(c) && canEncodeH264(c)) return c;
  }
  return null;
}

const FFMPEG = findFfmpeg();
if (!FFMPEG) {
  console.error('libx264 を持つ ffmpeg が見つかりません。`pip install imageio-ffmpeg` を実行してください。');
  process.exit(1);
}

// ---------- 書き込みのバックプレッシャー処理 ----------
const write = (stream, buf) =>
  stream.write(buf) ? Promise.resolve() : new Promise(r => stream.once('drain', r));

// ---------- 本体 ----------
// Playwright の同梱バージョンと環境の Chromium がずれていても動くように、
// 既存の Chromium があればそれを直接使う。
function findChromium() {
  if (process.env.CHROMIUM_PATH && existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const pwRoot = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  for (const p of [path.join(pwRoot, 'chromium'), '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (existsSync(p)) return p;
  }
  return undefined; // Playwright 管理のものにフォールバック
}

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none']
});
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: SCALE
});

const url = pathToFileURL(path.join(HERE, 'storyboard.html')).href;
await page.goto(url, { waitUntil: 'networkidle' });

// フォントと画像の読み込みを待つ（1コマ目からフォントが正しく出るように）
const fontState = await page.evaluate(async () => {
  await Promise.all([
    document.fonts.load('800 82px "M PLUS Rounded 1c"'),
    document.fonts.load('700 66px "M PLUS Rounded 1c"'),
    document.fonts.load('700 38px "Noto Sans JP"'),
    document.fonts.load('400 34px "Noto Sans JP"')
  ]);
  await document.fonts.ready;
  await Promise.all([...document.images].map(img =>
    img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })
  ));
  return [...document.fonts].map(f => `${f.family}/${f.weight}/${f.status}`);
});

// 同梱フォントが読めていないと IPAGothic 等にフォールバックし、
// 見た目がまるごと変わってしまう。黙って進めず落とす。
const wantedFonts = ['M PLUS Rounded 1c', 'Noto Sans JP'];
for (const w of wantedFonts) {
  if (!fontState.some(f => f.startsWith(w) && f.endsWith('/loaded'))) {
    console.error(`フォント「${w}」が読み込めていません。fonts/ が空の可能性があります。`);
    console.error('先に `node fetch-fonts.mjs` を実行してください。読み込み状況: ' + JSON.stringify(fontState));
    await browser.close();
    process.exit(1);
  }
}

const duration = await page.evaluate(() => window.__duration);
const missing  = await page.evaluate(() =>
  [...document.querySelectorAll('.cut.missing img')].map(i => i.getAttribute('src'))
);
if (missing.length) {
  console.warn('⚠ 未配置の写真（プレースホルダーで描画されます）:');
  for (const m of missing) console.warn('   - ' + m);
}

const total = Math.round(duration * FPS);
console.log(`▶ ${W * SCALE}x${H * SCALE} / ${FPS}fps / ${duration}s = ${total} frames`);
console.log(`  ffmpeg: ${FFMPEG}`);

const ff = spawn(FFMPEG, [
  '-y',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  // 無音トラックを付ける（編集アプリでの取り回しを良くするため）
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
  '-shortest',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '19',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  '-r', String(FPS),
  OUT
], { stdio: ['pipe', 'inherit', 'pipe'] });

let ffErr = '';
ff.stderr.on('data', d => { ffErr += d.toString(); });

const done = new Promise((resolve, reject) => {
  ff.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg exit ' + code + '\n' + ffErr.slice(-4000))));
});

for (let i = 0; i < total; i++) {
  const t = i / FPS;
  await page.evaluate(tt => window.__seek(tt), t);
  const png = await page.screenshot({ type: 'png', animations: 'disabled' });
  await write(ff.stdin, png);
  if (i % 30 === 0 || i === total - 1) {
    process.stdout.write(`\r  frame ${i + 1}/${total} (${t.toFixed(1)}s)   `);
  }
}
process.stdout.write('\n');

ff.stdin.end();
await done;
await browser.close();

console.log('✓ 書き出し完了: ' + OUT);
