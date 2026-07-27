@echo off
title CareMate 照護寶 - 一鍵發布至 GitHub
echo ========================================================
echo   CareMate 照護寶 - 自動發布至 GitHub & GitHub Pages
echo ========================================================
echo.
set PATH=C:\Users\cesre\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
cd /d "%~dp0"
node github_deploy.js
pause
