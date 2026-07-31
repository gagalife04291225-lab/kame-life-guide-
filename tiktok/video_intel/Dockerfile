# TITAN Video Intelligence Platform — 最小構成（GPU不要・追加課金なし）
# build: docker build -t titan -f tiktok/video_intel/Dockerfile .
# run  : docker run --rm -p 8765:8765 -v "$PWD":/work titan serve
FROM python:3.11-slim

# ffmpeg は imageio-ffmpeg が同梱バイナリを持つため apt 不要。
# OCR を使う場合のみ tesseract を入れる（既定では入れない＝イメージを軽く保つ）。
ARG WITH_OCR=0
RUN if [ "$WITH_OCR" = "1" ]; then \
      apt-get update && apt-get install -y --no-install-recommends \
        tesseract-ocr tesseract-ocr-jpn && rm -rf /var/lib/apt/lists/*; \
    fi

WORKDIR /work
COPY tiktok/video_intel/requirements.txt /tmp/req.txt
RUN pip install --no-cache-dir -r /tmp/req.txt

COPY tiktok/video_intel /work/tiktok/video_intel

ENV PYTHONPATH=/work/tiktok
EXPOSE 8765
ENTRYPOINT ["python3", "/work/tiktok/video_intel/cli.py"]
CMD ["serve", "--port", "8765"]
