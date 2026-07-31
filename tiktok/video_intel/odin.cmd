@echo off
REM ============================================================
REM  ODIN Video Research System - Windows launcher
REM  使い方:  odin.cmd analyze video.mp4
REM           odin.cmd serve
REM           odin.cmd research
REM  必要なもの: Python 3.9+ のみ（GPU不要・追加課金なし）
REM ============================================================
setlocal

REM 日本語出力が cp932 で落ちるのを防ぐ（Windows固有の対策）
set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8

where python >nul 2>&1
if errorlevel 1 (
  echo [ODIN] Python が見つかりません。https://www.python.org/downloads/ からインストールしてください。
  exit /b 1
)

REM 初回のみ依存を入れる（numpy / imageio-ffmpeg / Pillow）
python -c "import numpy, imageio_ffmpeg, PIL" >nul 2>&1
if errorlevel 1 (
  echo [ODIN] 依存パッケージを導入します...
  python -m pip install --quiet --disable-pip-version-check numpy imageio-ffmpeg Pillow
  if errorlevel 1 (
    echo [ODIN] 依存の導入に失敗しました。
    exit /b 1
  )
)

set "HERE=%~dp0"
python "%HERE%cli.py" %*
endlocal
