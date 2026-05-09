@echo off
setlocal EnableDelayedExpansion

:: Resolve project root (folder of this script)
set "SCRIPT_DIR=%~dp0"
set "WINSCP_PATH="

echo ========================================================
echo   ALONI'S BARBER SHOP - DEPLOYMENT SCRIPT
echo ========================================================
echo.
echo Loading environment from .env...
echo.

set "ENV_FILE=%SCRIPT_DIR%.env"
if not exist "%ENV_FILE%" (
    echo [ERROR] .env file not found at: "%ENV_FILE%"
    echo Create a .env file in the project root with deployment credentials.
    echo See README for the required variables.
    echo.
    pause
    exit /b 1
)

:: Simple .env loader: KEY=VALUE lines, '#' for comments
for /f "usebackq tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
    set "line=%%A"
    if not "!line!"=="" if /I not "!line:~0,1!"=="#" (
        set "key=%%A"
        set "value=%%B"
        set "!key!=!value!"
    )
)

:: WinSCP path must be supplied via .env (no machine-specific paths in this repo)
if not "%DEPLOY_WINSCP_EXE%"=="" set "WINSCP_PATH=%DEPLOY_WINSCP_EXE%"
if "%WINSCP_PATH%"=="" (
    echo [ERROR] DEPLOY_WINSCP_EXE is not set in .env
    echo Set it to the full path of WinSCP.com, for example:
    echo   DEPLOY_WINSCP_EXE=C:\Program Files ^(x86^)\WinSCP\WinSCP.com
    echo.
    pause
    exit /b 1
)

:: Basic sanity check for required variables
if "%DEPLOY_SFTP_HOST%"=="" (
    echo [ERROR] DEPLOY_SFTP_HOST is not set in .env
    echo.
    pause
    exit /b 1
)
if "%DEPLOY_SFTP_USER%"=="" (
    echo [ERROR] DEPLOY_SFTP_USER is not set in .env
    echo.
    pause
    exit /b 1
)
if "%DEPLOY_SFTP_PASS%"=="" (
    echo [ERROR] DEPLOY_SFTP_PASS is not set in .env
    echo.
    pause
    exit /b 1
)
if "%DEPLOY_SFTP_HOSTKEY%"=="" (
    echo [WARN] DEPLOY_SFTP_HOSTKEY not set in .env, using wildcard "*".
    set "DEPLOY_SFTP_HOSTKEY=*"
)

if "%DEPLOY_SFTP_REMOTE_DIR%"=="" set "DEPLOY_SFTP_REMOTE_DIR=."

echo Environment loaded successfully.
echo.
echo Starting synchronization...
echo.

if not exist "%WINSCP_PATH%" (
    echo [ERROR] WinSCP not found at: "%WINSCP_PATH%"
    echo Check DEPLOY_WINSCP_EXE in your .env file.
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
