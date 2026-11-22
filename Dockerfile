# =====================================================================
# Dockerfile Universal Full-Stack (Backend Flask + Frontend Estático)
# Ideal para deploy com 1 comando em:
# Render, Railway, Fly.io, Cloud Run, Heroku, AWS App Runner, VPS
# =====================================================================

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    HOST=0.0.0.0

WORKDIR /app

# Instalação de utilitários
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências do backend
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copia backend e frontend
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Cria diretório para persistência do banco SQLite
RUN mkdir -p /app/backend/data

WORKDIR /app/backend

EXPOSE 8000

# Executa com Gunicorn para produção de alto desempenho
# O servidor Flask integrado no server.py serve tanto as rotas da API (/api, /animais, etc.)
# quanto as páginas web do frontend (/principal.html, adocao.html, etc.)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "4", "server:app"]
