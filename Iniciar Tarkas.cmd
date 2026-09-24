@echo off
setlocal
cd /d "%~dp0"
title Projeto Tarkas
if not exist "node_modules\electron\dist\electron.exe" (
  echo [Tarkas] Dependencias ausentes. Instalando...
  call npm install
  if errorlevel 1 (
    echo.
    echo Nao foi possivel preparar o Tarkas.
    pause
    exit /b 1
  )
)
start "" "node_modules\electron\dist\electron.exe" .
exit /b 0
