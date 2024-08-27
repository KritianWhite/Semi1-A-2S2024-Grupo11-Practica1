import datetime
import bcrypt
from flask import request, jsonify
from database.database import consult
from config import config
import re
import base64
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"status": 404, "message": "Solicitud incorrecta. Por favor, rellene todos los campos"}), 404

        result = consult(f"SELECT * FROM usuario WHERE email = '{email}'")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            check_pass = bcrypt.checkpw(password.encode('utf-8'), result[0]['result'][0]['password'].encode('utf-8'))

            if check_pass:
                data_user = {
                    "iduser": result[0]['result'][0]['id'], 
                    "role": result[0]['result'][0]['id_tipo_usuario']
                }
                return jsonify({"status": 200, "iduser": data_user["iduser"], "role":data_user["role"]}), 200
            else:
                return jsonify({"status": 409, "message": "Password Incorrecto"}), 409
        else:
            return jsonify({"status": 500, "message": "usuario no existe"}), 500
    except Exception as e:
        return jsonify({"status": 500, "message": str(e)}), 500

def registro():
    try:
        data = request.json
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        imagen = data.get('imagen')
        email = data.get('email')
        password = data.get('password')
        nacimiento = data.get('nacimiento')

        if not all([nombre, apellido, imagen, email, password, nacimiento]):
            return jsonify({"status": 404, "message": "Solicitud incorrecta. Por favor, rellene todos los campos."}), 404


        check = consult(f"SELECT EXISTS(SELECT * FROM usuario WHERE email= '{email}') AS userExists;")

        if check[0]['status'] == 200 and check[0]['result'][0]['userExists'] == 0:
            #subir imagen a s3
            base64Data = re.sub(r'^data:image/\w+;base64,', '', imagen)
            buff = base64.b64decode(base64Data)
            fechaHoraActual = datetime.datetime.now()
            ano = str(fechaHoraActual.year)
            mes = str(fechaHoraActual.month).zfill(2)  # Se usa zfill para agregar ceros a la izquierda
            dia = str(fechaHoraActual.day).zfill(2)
            hora = str(fechaHoraActual.hour).zfill(2)
            minutos = str(fechaHoraActual.minute).zfill(2)
            segundos = str(fechaHoraActual.second).zfill(2)

            fechaHoraNumerica = f"{ano}{mes}{dia}{hora}{minutos}{segundos}"
            path = f"Fotos/{email + fechaHoraNumerica}.jpg"
            
            response = uploadImageS3(buff, path)

            if response is None:
                return jsonify({"status": 500, "message": "Error al subir la imagen en S3"}), 500

            url_imagen = f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path}"

            hash_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))

            xsql = (f"INSERT INTO usuario (nombre, apellido, url_imagen, email, password, nacimiento, id_tipo_usuario) "
                    f"VALUES ('{nombre}', '{apellido}', '{url_imagen}', '{email}', '{hash_pw.decode('utf-8')}', '{nacimiento}', 2);")
           
            result = consult(xsql)
            if result[0]['status'] == 200:
                return jsonify({"status":200, "message": "Usuario registrado"}), 200
            else:
                return jsonify({"status": 500, "message": result[0]['message']}), 500
        else:
            return jsonify({"status": 500, "message": "Email ya ha sido registrado"}), 500
    except Exception as e:
        print("entro a error")
        return jsonify({"status": 500, "message": str(e)}), 500

def getuser():
    try:
        data = request.json
        user_id = data.get('id')

        if not user_id:
            return jsonify({"status": 404, "message": "Solicitud incorrecta. Por favor, rellene todos los campos."}), 404

        xsql = f"SELECT * FROM usuario WHERE id = {user_id};"

        result = consult(xsql)

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            user_data = result[0]['result'][0]
            nacimiento = user_data['nacimiento'].strftime('%Y-%m-%d')
            data_user = {
                "nombre": user_data['nombre'],
                "apellido": user_data['apellido'],
                "url_imagen": user_data['url_imagen'],
                "email": user_data['email'],
                "nacimiento": nacimiento,
                "admin": user_data['id_tipo_usuario']
            }
            return jsonify(data_user), 200
        else:
            return jsonify({"status": 500, "message": "error usuario no existe"}), 500
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": str(e)}), 500

def update():
    try:
        data = request.json
        user_id = data.get('id')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        url_imagen = data.get('url_imagen')
        email = data.get('email')
        password = data.get('password')

        if not all([user_id, nombre, apellido, url_imagen, email, password]):
            return jsonify({"status": 404, "message": "Solicitud incorrecta. Por favor, rellene todos los campos."}), 404

        xsql = f"SELECT * FROM usuario WHERE id = '{user_id}'"
        result = consult(xsql)

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            check_pass = bcrypt.checkpw(password.encode('utf-8'), result[0]['result'][0]['password'].encode('utf-8'))

            if check_pass:
                xsql = (f"UPDATE usuario SET nombre = '{nombre}', apellido = '{apellido}', "
                        f"url_imagen = '{url_imagen}', email = '{email}' WHERE id = {user_id};")

                result = consult(xsql)

                if result[0]['status'] == 200:
                    return jsonify({"message": "Usuario actualizado"}), 200
                else:
                    return jsonify({"status": 500, "message": result[0]['message']}), 500
            else:
                return jsonify({"status": 500, "message": "Password Incorrecto"}), 500
        else:
            return jsonify({"status": 500, "message": "error usuario no existe"}), 500
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": str(e)}), 500
    
def uploadImageS3(buff, path):
    # Configuración del cliente S3
    s3_client = boto3.client(
        's3',
        region_name = config["region"], 
        aws_access_key_id = config["accessKeyId"],
        aws_secret_access_key = config["secretAccessKey"]
    )

    try:
        # Subir la imagen a S3
        response = s3_client.put_object(
            Bucket= config["bucket"],  # Reemplaza con el nombre de tu bucket
            Key=path,
            Body=buff,
            ContentType='image/jpeg'
        )
        return response
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("Error de credenciales:", e)
        return None
    except Exception as e:
        print("Error al subir la imagen:", e)
        return None
    
user = {
    "login": login,
    "registro": registro,
    "getuser": getuser,
    "update": update
}
