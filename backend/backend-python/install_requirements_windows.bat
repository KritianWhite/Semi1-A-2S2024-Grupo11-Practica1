@echo off
REM Verifica si Python está instalado
py -3 --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python no está instalado. Por favor, instala Python antes de continuar.
    exit /b 1
)

REM Crea el entorno virtual
py -3 -m venv .venv

REM Activa el entorno virtual
call .venv\Scripts\activate

REM Verifica si la activación fue exitosa
IF %ERRORLEVEL% NEQ 0 (
    echo No se pudo activar el entorno virtual.
    exit /b 1
)

REM Instala los paquetes desde requirements.txt
pip install -r requirements.txt

REM Verifica si la instalación fue exitosa
IF %ERRORLEVEL% EQU 0 (
    echo Instalación completada.
) ELSE (
    echo Ocurrió un error durante la instalación.
    exit /b 1
)

REM Desactiva el entorno virtual
deactivate
