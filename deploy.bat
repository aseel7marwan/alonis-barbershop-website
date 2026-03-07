@echo off
setlocal

:: Path to WinSCP executable (adjust if WinSCP is installed elsewhere)
set "WINSCP_PATH=%USERPROFILE%\AppData\Local\Programs\WinSCP\WinSCP.com"

echo ========================================================
echo   ALONI'S BARBER SHOP - DEPLOYMENT SCRIPT
echo ========================================================
echo.
echo Statring synchronization...
echo.

if not exist "%WINSCP_PATH%" (
    echo [ERROR] WinSCP not found at: "%WINSCP_PATH%"
    echo Please install WinSCP or update the path in this .bat file.
    pause
    exit /b
)

"%WINSCP_PATH%" /script="winscp_deploy.txt" /log="deploy.log"

if %errorlevel% neq 0 (
    echo.
    echo [FAILED] Deployment encountered errors. 
    echo Please check 'deploy.log' for details.
) else (
    echo.
    echo [SUCCESS] Files synchronized successfully!
)

echo.
pause
