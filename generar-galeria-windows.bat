@echo off
REM ============================================================
REM  BUJUTSU - Generador de galeria (Windows)
REM  Doble clic. Requiere una carpeta  fotos-galeria  con
REM  subcarpetas por categoria (BJJ, Muay Thai, Eventos, ...).
REM ============================================================
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0generar-galeria.ps1"
