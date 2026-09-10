#!/usr/bin/env bash
# SadTalker を CPU で動かし、MINA_MASTER + 音声 → mp4 を作る。
#
# GPU が無い前提。--cpu で実行し、size 256 に落として現実的な時間に収める。
# GFPGAN エンハンサーは使わない: 肌が過度に均されて「陶器肌」になり、
# brand/mina-image-rules.md の ANTI-AI PATTERN に反するため。
set -euo pipefail

OUT_DIR="${OUT_DIR:-qc-evidence/mina-intro-001}"
ANIM_SPEAKER="${ANIM_SPEAKER:-16}"
WORK=/tmp/sadtalker
SRC_IMG="$(pwd)/brand/assets/mina/mina-master.png"
SRC_WAV="$(pwd)/${OUT_DIR}/audio/mina-intro-speaker${ANIM_SPEAKER}.wav"

echo "=== inputs ==="
ls -la "$SRC_IMG" "$SRC_WAV"

# ── 依存 ─────────────────────────────────────────────
echo "=== install torch (CPU) ==="
python -m pip install --quiet --upgrade pip
python -m pip install --quiet \
  torch==2.2.2 torchvision==0.17.2 torchaudio==2.2.2 \
  --index-url https://download.pytorch.org/whl/cpu

echo "=== install SadTalker deps ==="
# numpy 2.x は旧来の C 拡張を軒並み壊すので 1.x に固定する。
python -m pip install --quiet \
  "numpy<2" \
  face_alignment==1.3.5 \
  imageio==2.34.1 imageio-ffmpeg==0.4.9 \
  librosa==0.10.1 numba resampy==0.4.3 pydub==0.25.1 \
  scipy==1.11.4 kornia==0.7.2 tqdm yacs==0.1.8 pyyaml joblib \
  scikit-image==0.22.0 basicsr==1.4.2 facexlib==0.3.0 \
  gfpgan==1.3.8 av safetensors

# basicsr 1.4.2 は torchvision>=0.17 で消えた
# torchvision.transforms.functional_tensor を import して落ちる。既知の不具合。
BASICSR_DIR="$(python -c 'import basicsr, os; print(os.path.dirname(basicsr.__file__))')"
if grep -q "functional_tensor" "$BASICSR_DIR/data/degradations.py"; then
  sed -i 's/torchvision\.transforms\.functional_tensor/torchvision.transforms.functional/' \
    "$BASICSR_DIR/data/degradations.py"
  echo "patched basicsr degradations.py (functional_tensor -> functional)"
fi

# ── SadTalker 本体 ───────────────────────────────────
echo "=== clone SadTalker ==="
rm -rf "$WORK"
git clone --depth 1 https://github.com/OpenTalker/SadTalker.git "$WORK"
cd "$WORK"

echo "=== download checkpoints ==="
mkdir -p checkpoints gfpgan/weights
BASE=https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2-rc
FX=https://github.com/xinntao/facexlib/releases/download/v0.1.0
dl() { echo "  -> $2"; curl -sSL --retry 3 --retry-delay 3 -o "$2" "$1"; }

dl "$BASE/mapping_00109-model.pth.tar"          checkpoints/mapping_00109-model.pth.tar
dl "$BASE/mapping_00229-model.pth.tar"          checkpoints/mapping_00229-model.pth.tar
dl "$BASE/SadTalker_V0.0.2_256.safetensors"     checkpoints/SadTalker_V0.0.2_256.safetensors
# 顔検出・パースは enhancer を使わなくても必要
dl "$FX/detection_Resnet50_Final.pth"           gfpgan/weights/detection_Resnet50_Final.pth
dl "$FX/parsing_parsenet.pth"                   gfpgan/weights/parsing_parsenet.pth
dl "$FX/alignment_WFLW_4HG.pth"                 gfpgan/weights/alignment_WFLW_4HG.pth
ls -la checkpoints gfpgan/weights

# ── 実行 ─────────────────────────────────────────────
# 表情と首の動きの設計（初対面の照れ）:
#   expression_scale 0.85 … 大げさに笑わせない。片側の口角がわずかに上がる程度
#   pose_style       12   … 正面固定にせず、軽い首の揺れを入れる
#   size             256  … CPU で現実的な時間に収めるため
#   preprocess full       … 元画像の構図・背景・服を保つ（顔だけ切り出さない）
#   enhancer 無し         … 陶器肌化を避ける
echo "=== run SadTalker (CPU) ==="
mkdir -p results
time python inference.py \
  --driven_audio "$SRC_WAV" \
  --source_image "$SRC_IMG" \
  --result_dir results \
  --preprocess full \
  --size 256 \
  --expression_scale 0.85 \
  --pose_style 12 \
  --cpu

echo "=== collect output ==="
find results -name '*.mp4' -print
MP4="$(find results -name '*.mp4' | sort | tail -1)"
if [ -z "$MP4" ]; then
  echo "::error::SadTalker produced no mp4"
  exit 1
fi

cd - >/dev/null
mkdir -p "$OUT_DIR"
# 9:16 に整えて配置（TikTok 想定）。音声はそのまま載せ替えない。
ffmpeg -v error -y -i "$MP4" \
  -vf "scale=864:-2,pad=864:1536:(ow-iw)/2:(oh-ih)/2:color=white" \
  -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 128k \
  "$OUT_DIR/mina-intro-001.mp4"

echo "=== done ==="
ls -la "$OUT_DIR/mina-intro-001.mp4"
