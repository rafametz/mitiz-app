@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
set "NODE_OPTIONS=--use-system-ca"
cd /d "%~dp0"
call npm run dev
