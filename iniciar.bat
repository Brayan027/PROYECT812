@echo off
title Gestor de Proyectos y Bitacora
cd /d "%~dp0\server"
echo ===================================================
echo     Iniciando Control de Proyectos & Bitacora
echo ===================================================
echo.
echo Abriendo servidor en http://localhost:5000 ...
start http://localhost:5000
node server.js
pause
