@echo off
title CareMate 照護宝 - 本地與局域網測試伺服器
echo ========================================================
echo   CareMate 照護寶 - 長者居家照顧 APP 測試伺服器啟動中
echo ========================================================
echo.
set PATH=C:\Users\cesre\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
cd /d "%~dp0"
node node_modules/vite/bin/vite.js --host --port 3006
pause
