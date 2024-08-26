from dotenv import load_dotenv
import os

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Configuración
config = {
    "host": os.getenv("HOST", ""),
    "port": int(os.getenv("PORT", 0)),
    "database": os.getenv("DATABASE", ""),
    "userdatab": os.getenv("USERDATAB", ""),
    "password": os.getenv("PASSWORD", "")
}
