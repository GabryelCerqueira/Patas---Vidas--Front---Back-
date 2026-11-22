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

# Healthcheck interno do container para garantir disponibilidade do serviço
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api || exit 1

# Executa com Gunicorn para produção de alto desempenho
# Suporta a porta dinâmica $PORT definida automaticamente por Render, Railway, Fly.io, Cloud Run ou 8000 por padrão
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 2 --threads 4 server:app"]
