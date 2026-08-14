# カメふしぎ島 TikTok 25秒 — 書き出し手順

9:16 / 1080×1920 / 30fps / 25.0秒 の MP4 を、この場で書き出せる。
映像は `storyboard.html`（HTML + CSS）で作り、Chromium で1コマずつ描いて ffmpeg で繋いでいる。

- 台本・文言・注意点 → `script.md`
- 素材の生成条件 → `../red-eared-slider-family-concept.md`

## 1. 写真

`photos/` に配置済み（5枚・コミット済み）。差し替えるときは同じファイル名で上書きする。

```
photos/01-turtle-case.jpg          0〜3秒   カメに寄って始まるカット
photos/02-parent-child-phone.jpg   3〜7秒   母がスマホを指す
photos/03-searching.jpg            7〜11秒  親子でのぞき込む
photos/04-alt-smile.jpg            予備（未使用）
photos/05-family-smile.jpg         17〜22秒 親子が笑顔
```

9:16 より横長の写真は中央基準で左右が切り落とされる。
写真が無いカットは「PHOTO 未配置」と表示されるだけで、書き出しは通る。

11〜17秒と22〜25秒は `assets/kids/` の既存画像を使う。

## 2. 準備（初回のみ）

```bash
npm install playwright        # ブラウザ本体は環境の Chromium を使うのでダウンロード不要
pip install imageio-ffmpeg    # ffmpeg が入っていない場合
node fetch-fonts.mjs          # fonts/ にフォントを取り込む
```

`fonts/` はコミット済みなので、通常 `fetch-fonts.mjs` の再実行は不要。
**テロップに新しい漢字を足したときだけ** `fetch-fonts.mjs` の `KANJI` に追記して再実行する
（かな・英数・記号は全部入っているので、かなだけの修正なら不要）。

## 3. 書き出す

```bash
node render.mjs
# → kame-fushigi-island-25s.mp4
```

オプション:

```bash
node render.mjs --fps 60                    # なめらかさ優先（書き出し時間は倍）
node render.mjs --fps 6                     # 動作確認用の速い試し焼き
node render.mjs --out draft.mp4             # 出力先を変える
```

## 4. 動きだけブラウザで見る

```
storyboard.html?play=1
```

ウィンドウに合わせて縮小表示され、25秒でループする。左下に再生位置が出る。

## 文言・尺を直したいとき

`storyboard.html` の先頭にある `CUTS` 配列だけを触る。CSS もロジックも触らなくてよい。

```js
{ text: '何を食べる？', cls: 'lg', top: 300, at: 3.55, out: 7.3 }
```

映像の寄り・引きは同じ `CUTS` の各カットで指定する。

```js
focus: '50% 50%',        // 切り抜き位置（object-position）
origin: '72% 84%',       // ズームの基準点（transform-origin）。省略時は中心
zoom: [2.30, 1.30],      // 開始倍率 → 終了倍率
```

`scale()` は要素の中心を基準に拡大するので、**寄り先を変えたいときは `focus` ではなく
`origin` を動かす**。`focus` は切り抜き位置しか変えられない。

- `text` … 改行は `\n`。**1行＝1枚のプレート**になる。
  **自動折り返しはしない**ので、改行位置は自分で決める。
  `[[…]]` で囲んだ部分は金色の強調になる（**1画面につき1箇所まで**）
- `cls`  … `xl`(76px・フック) / `lg`(64px・本文) / `md`(56px) / `sm`(42px)
- `top`  … 上からの位置(px)
- `at` / `out` … 表示開始・終了(秒)

### はみ出さないための決まり

テロップの左端は 86px。TikTok の右側アイコン列と下部のキャプション欄を避けるため、
`tiktok/DESIGN-SYSTEM.md` v1.0 の保守値 **x:86〜950 / y:288〜1382** に収める。

- 1行の最大文字数 × `font-size` ＋ **左右パディング 68px** が **864px を超えないこと**
  （例: `lg`=64px なら全角12文字まで）
- プレート1枚の高さは `font-size × 1.25 + 34px`。複数行はこれに行間 14px を足して
  下端が **1382px を超えないこと**

`--fps 6` で試し焼きして目視するのが早い。

## 注意

- **Google Fonts を `storyboard.html` から読み込ませないこと。**
  書き出し用の Chromium は外部ネットワークに出られず、失敗すると
  黙って別のフォント（IPAGothic 等）に落ちて見た目がまるごと変わる。
  フォントは `fonts/` から読む。`render.mjs` は読み込めていない場合エラーで止まる。
- Playwright 同梱の ffmpeg は webm/VP8 専用の削減ビルドで H.264 を吐けない。
  `render.mjs` は libx264 を持つ ffmpeg を自動で選ぶ。
- 出力 MP4 は `.gitignore` 済み。書き出したものをリポジトリに入れない。
