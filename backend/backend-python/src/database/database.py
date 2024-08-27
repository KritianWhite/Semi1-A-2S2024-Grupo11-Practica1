from mysql.connector import Error
from mysql.connector import pooling
from config import config


import mysql.connector
from mysql.connector import pooling
from config import config

# Configuración del pool de conexiones
db_config = {
    "host": config["host"],
    "port": config["port"],
    "user": config["userdatab"],
    "password": config["password"],
    "database": config["database"],
    "pool_name": "mypool",
    "pool_size": 10,
    "pool_reset_session": True
}

# Crear el pool de conexiones
pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)

def query_with_pool(pool, query):
    connection = pool.get_connection()
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query)
        consulta = cursor.fetchall()
        results = {
            "status": 200,
            "message": "Consulta exitosa",
            "result": consulta,
        }
        return results
    except mysql.connector.Error as error:
        results = {
            "status": 500,
            "message": str(error),
            "result": None,
        }
        return results
    finally:
        connection.commit()
        cursor.close() 
        connection.close()  

def consult(texto):
    queries = [texto]
    result = [query_with_pool(pool, query) for query in queries]
    return result
