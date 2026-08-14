# カメふしぎ島 TikTok 25秒 — 書き出し手順

9:16 / 1080×1920 / 30fps / 25.0秒 の MP4 を、この場で書き出せる。
映像は `storyboard.html`（HTML + CSS）で作り、Chromium で1コマずつ描いて ffmpeg で繋いでいる。

- 台本・文言・注意点 → `script.md`
- 素材の生成条件 → `../red-eared-slider-family-concept.md`

## 1. 写真を置く

`photos/` に4枚。ファイル名は固定。

```
photos/01-turtle-case.jpg          0〜3秒   透明ケースのカメ
photos/02-parent-child-phone.jpg   3〜7秒   親子でスマホをのぞく
photos/03-searching.jpg            7〜11秒  検索している
photos/05-family-smile.jpg         17〜22秒 親子が笑顔
```

9:16 に近い縦長が望ましい。横長でも中央基準で切り抜かれる（寄せ位置は `CUTS` の `focus` で調整可）。
写真が無いカットは「PHOTO 未配置」と表示されるだけで、書き出しは通る。

11〜17秒と22〜25秒は `assets/kids/` の既存画像を使うので、用意するものは無い。

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

- `text` … 改行は `\n`。**自動折り返しはしない**ので、改行位置は自分で決める
- `cls`  … `xl`(82px) / `lg`(66px) / `md`(58px) / `sm`(44px) / `chip`(58px・角丸の札)
- `top`  … 上からの位置(px)
- `at` / `out` … 表示開始・終了(秒)

### はみ出さないための決まり

テロップの左端は 72px、幅は 836px。TikTok の右側アイコン列と下部のキャプション欄を避けている。

- 1行の最大文字数 × `font-size` が **836px を超えないこと**
  （例: `lg`=66px なら全角12文字まで）
- 縦は **1500px より下に置かない**

`--fps 6` で試し焼きして目視するのが早い。

## 注意

- **Google Fonts を `storyboard.html` から読み込ませないこと。**
  書き出し用の Chromium は外部ネットワークに出られず、失敗すると
  黙って別のフォント（IPAGothic 等）に落ちて見た目がまるごと変わる。
  フォントは `fonts/` から読む。`render.mjs` は読み込めていない場合エラーで止まる。
- Playwright 同梱の ffmpeg は webm/VP8 専用の削減ビルドで H.264 を吐けない。
  `render.mjs` は libx264 を持つ ffmpeg を自動で選ぶ。
- 出力 MP4 は `.gitignore` 済み。書き出したものをリポジトリに入れない。
