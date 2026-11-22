@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Patas e Vidas - Inicializador do Sistema

echo ======================================================================
echo    PATAS ^& VIDAS - REDE SOLIDARIA DE PROTECAO ANIMAL
echo    Projeto Integrador FIPP - Unoeste
echo ======================================================================
echo.
echo [1/4] Procurando interpretador Python funcional...

set "PY_CMD="

if exist "%LOCALAPPDATA%\Python\pythoncore-3.15-64\python.exe" (
    "%LOCALAPPDATA%\Python\pythoncore-3.15-64\python.exe" --version >nul 2>nul
    if not errorlevel 1 (
        set "PY_CMD=%LOCALAPPDATA%\Python\pythoncore-3.15-64\python.exe"
        goto PYTHON_ENCONTRADO
    )
)

for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%D\python.exe" (
        "%%D\python.exe" --version >nul 2>nul
        if not errorlevel 1 (
            set "PY_CMD=%%D\python.exe"
            goto PYTHON_ENCONTRADO
        )
    )
)

for /d %%D in ("C:\Program Files\Python*") do (
    if exist "%%D\python.exe" (
        "%%D\python.exe" --version >nul 2>nul
        if not errorlevel 1 (
            set "PY_CMD=%%D\python.exe"
            goto PYTHON_ENCONTRADO
        )
    )
)

py --version >nul 2>nul
if not errorlevel 1 (
    set "PY_CMD=py"
    goto PYTHON_ENCONTRADO
)

python --version >nul 2>nul
if not errorlevel 1 (
    set "PY_CMD=python"
    goto PYTHON_ENCONTRADO
)

echo.
echo [ERRO] Nenhum interpretador Python funcional foi detectado.
echo Certifique-se de que o Python esteja instalado no computador.
echo.
pause
exit /b 1

:PYTHON_ENCONTRADO
echo Python detectado: %PY_CMD%
echo.

echo [2/4] Verificando dependencias (Flask e Flask-CORS)...
"%PY_CMD%" -c "import flask, flask_cors" >nul 2>nul
if errorlevel 1 (
    echo Instalando dependencias necessarias via pip...
    "%PY_CMD%" -m pip install flask flask-cors
) else (
    echo Dependencias Flask e Flask-CORS prontas!
)
echo.

echo [3/4] Iniciando Servidor Backend (Flask na porta 8000)...
start "Patas e Vidas - Backend API (Porta 8000)" cmd /k ""%PY_CMD%" backend\server.py"

echo [4/4] Iniciando Servidor Frontend (HTTP na porta 3000)...
start "Patas e Vidas - Frontend Web (Porta 3000)" cmd /k ""%PY_CMD%" -m http.server 3000 --directory frontend"

echo.
echo Aguardando inicializacao dos servidores...
ping 127.0.0.1 -n 4 >nul

echo.
echo ======================================================================
echo    SISTEMA PATAS ^& VIDAS INICIADO COM SUCESSO!
echo ======================================================================
echo  - Frontend Web : http://127.0.0.1:3000/principal.html
echo  - Backend API  : http://127.0.0.1:8000/api
echo  - Banco SQLite : BancodeDadosGrupo6AlexsanderPedroHenriqueMuriloLemosGabryelCerqueira.db
echo  - Tabela CRUD  : animais (1. Identificacao Basica do Animal Resgatado)
echo ======================================================================
echo Abrindo o navegador padrao...
echo.

start "" "http://127.0.0.1:3000/principal.html"

echo.
echo Os servidores estao em execucao nas janelas abertas.
echo Voce pode fechar esta janela quando quiser.
pause
