@ECHO OFF

:run
cls
bun run ./src/Server.js
pause
goto run