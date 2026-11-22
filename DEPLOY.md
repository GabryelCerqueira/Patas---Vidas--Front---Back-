# 🚀 Guia Oficial de Deploy com Docker — Patas & Vidas

Este guia contém instruções passo a passo para fazer o deploy do sistema **Patas & Vidas (Frontend & Backend)** em qualquer ambiente: localmente, em servidores VPS (Ubuntu/Debian, DigitalOcean, AWS, Linode) ou em serviços de nuvem gerenciados (Render, Railway, Fly.io, Google Cloud Run).

---

## 📁 Estrutura de Arquivos Docker Criada

| Arquivo | Finalidade | Onde Usar |
| :--- | :--- | :--- |
| `.github/workflows/docker-image.yml` | Pipeline de CI/CD automática do GitHub Actions | Compila, testa o healthcheck e publica a imagem no **GitHub Container Registry (GHCR)** a cada push |
| `Dockerfile` (raiz) | Container universal fullstack (Backend Flask + Frontend estático) | Deploy simples em **Render**, **Railway**, **Fly.io**, **Cloud Run** ou via **GHCR** |
| `docker-compose.yml` | Orquestração de 2 serviços separados (Nginx no front + Gunicorn no back) com persistência SQLite | Deploy em **VPS**, **Servidores Dedicados** ou **Ambiente Local** |
| `backend/Dockerfile` | Container exclusivo do Backend Python Flask / Gunicorn | Usado pelo `docker-compose.yml` |
| `frontend/Dockerfile` | Container do Frontend Nginx com proxy reverso e compressão | Usado pelo `docker-compose.yml` |
| `frontend/nginx.conf` | Configuração de proxy reverso e otimizações de cache | Integrado ao Nginx |
| `.dockerignore` | Evita envio de arquivos desnecessários ao build | Otimização de tempo e tamanho da imagem |

---

## 🤖 Integração Contínua (CI/CD) com GitHub Actions

O arquivo [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml) já está configurado para:
1. **Compilar e testar** a imagem Docker automaticamente a cada `git push` na branch `main`.
2. **Executar teste de Healthcheck**, garantindo que o servidor Flask e a API (`/api`) sobem sem falhas.
3. **Validar o build do Docker Compose** (Frontend Nginx + Backend Gunicorn).
4. **Publicar a imagem pronta** no **GitHub Container Registry (GHCR)**:
   ```bash
   ghcr.io/gabryelcerqueira/patas---vidas--front---back-:latest
   ```

### 🚀 Rodar a Imagem Pronta em Qualquer Servidor (sem precisar compilar):
```bash
docker run -d --name patas-vidas -p 8000:8000 ghcr.io/gabryelcerqueira/patas---vidas--front---back-:latest
```
Acesse imediatamente em `http://localhost:8000` ou no IP/domínio do seu servidor!

---

## 🖥️ Opção 1: Execução Local com Docker Compose

Requisito: ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

1. Abra o terminal na pasta raiz do projeto:
   ```bash
   cd "c:\Users\Gabryel Cerqueira\Documents\Patas & Vidas (Front & Back)"
   ```

2. Construa e inicie os containers:
   ```bash
   docker compose up --build
   ```

3. Acesse no navegador:
   - **Frontend (Web):** [http://localhost:3000](http://localhost:3000)
   - **Backend (API):** [http://localhost:8000/api](http://localhost:8000/api)
   - **Lista de Animais:** [http://localhost:8000/animais](http://localhost:8000/animais)

4. Para parar os containers:
   ```bash
   docker compose down
   ```

> 💡 **Nota:** Seus dados cadastrados no banco SQLite são persistidos automaticamente no volume Docker `backend_data`, então nenhum dado é perdido ao reiniciar ou rebuildar os containers.

---

## ☁️ Opção 2: Deploy Gratuito no Render (1-Clique via GitHub)

O [Render.com](https://render.com) permite hospedar containers Docker gratuitamente.

1. Suba o código do projeto para um repositório no seu GitHub.
2. Acesse [dashboard.render.com](https://dashboard.render.com) e clique em **New +** -> **Web Service**.
3. Conecte sua conta do GitHub e selecione o repositório **Patas & Vidas**.
4. Configure as opções básicas:
   - **Name:** `patas-e-vidas` (ou o nome que preferir)
   - **Language / Runtime:** Selecione **Docker**
   - **Branch:** `main` (ou a branch onde subiu o código)
   - **Region:** Selecione a mais próxima (ex: Ohio - US East)
   - **Plan:** Free
5. Em **Advanced**, configure as variáveis de ambiente (Environment Variables):
   - `PORT`: `8000`
6. Clique em **Create Web Service**.
7. O Render fará o build do `Dockerfile` raiz automaticamente. Em 2 a 3 minutos sua aplicação estará online com HTTPS gratuito:
   - Exemplo de URL: `https://patas-e-vidas.onrender.com`

---

## 🚂 Opção 3: Deploy no Railway

O [Railway.app](https://railway.app) detecta automaticamente o Dockerfile e sobe a aplicação em segundos.

1. Acesse [railway.app](https://railway.app) e crie uma conta.
2. Clique em **New Project** -> **Deploy from GitHub repo**.
3. Selecione o repositório.
4. O Railway detectará o `Dockerfile` automaticamente e iniciará o build.
5. Em **Settings** do projeto:
   - Vá na seção **Networking** -> clique em **Generate Domain**.
6. Pronto! Sua aplicação estará no ar com link público HTTPS.

---

## 🪶 Opção 4: Deploy no Fly.io

1. Instale o CLI do Fly.io ([instruções](https://fly.io/docs/hands-on/install-flyctl/)).
2. No terminal do projeto, faça login:
   ```bash
   fly auth login
   ```
3. Inicialize a aplicação:
   ```bash
   fly launch
   ```
4. Faça o deploy:
   ```bash
   fly deploy
   ```

---

## 🐧 Opção 5: Deploy em Servidor VPS (Ubuntu / Debian / AWS EC2 / DigitalOcean)

Se você tem um servidor Linux na nuvem (VPS):

### 1. Instalar Docker e Docker Compose no servidor
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### 2. Clonar o projeto
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git /var/www/patas-e-vidas
cd /var/www/patas-e-vidas
```

### 3. Iniciar a aplicação em background (Daemon)
```bash
docker compose up -d --build
```

A aplicação já estará rodando na porta 3000 (front) e 8000 (back).

### 4. Configurar Domínio com SSL HTTPS Gratuito (Let's Encrypt / Certbot)

Para expor seu domínio (ex: `adocao.seusite.com.br`) na porta 80/443:

Instale o Nginx no host:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Crie o arquivo de configuração `/etc/nginx/sites-available/patasevidas`:
```nginx
server {
    server_name adocao.seusite.com.br;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative o site e gere o certificado SSL gratuito:
```bash
sudo ln -s /etc/nginx/sites-available/patasevidas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d adocao.seusite.com.br
```

Agora seu site estará protegido com cadeado verde HTTPS e renovação automática!

---

## 💾 Gestão e Backup do Banco SQLite

O banco de dados SQLite fica salvo no volume persistente do Docker.

- **Fazer backup do banco do container para o seu computador:**
  ```bash
  docker cp patas-backend:/app/data/patas_vidas.db ./backup_patas.db
  ```

- **Restaurar um backup:**
  ```bash
  docker cp ./backup_patas.db patas-backend:/app/data/patas_vidas.db
  ```

---

## 🛠️ Comandos Úteis do Docker

- **Ver logs em tempo real:**
  ```bash
  docker compose logs -f
  ```
- **Reiniciar os serviços:**
  ```bash
  docker compose restart
  ```
- **Reconstruir após alterações no código:**
  ```bash
  docker compose up -d --build
  ```
- **Verificar uso de CPU e memória:**
  ```bash
  docker stats
  ```
