#!/bin/bash

#Dar permisos de ejecución al script con chmod +x install_requirements.sh y luego ejecútarlo con ./install_requirements.sh.

# Verifica si Python está instalado
if ! command -v python3 &> /dev/null
then
    echo "Python3 no está instalado. Por favor, instala Python3 antes de continuar."
    exit 1
fi

# Crea el entorno virtual
python3 -m venv .venv

# Activa el entorno virtual
source .venv/bin/activate

# Verifica si la activación fue exitosa
if [ $? -ne 0 ]; then
    echo "No se pudo activar el entorno virtual."
    exit 1
fi

# Instala los paquetes desde requirements.txt
pip install -r requirements.txt

# Verifica si la instalación fue exitosa
if [ $? -eq 0 ]; then
    echo "Instalación completada."
else
    echo "Ocurrió un error durante la instalación."
    exit 1
fi

# Desactiva el entorno virtual
deactivate
