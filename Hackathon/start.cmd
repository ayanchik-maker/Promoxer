@echo off
REM Promoxer one-click launcher
start "" http://localhost:5173
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
