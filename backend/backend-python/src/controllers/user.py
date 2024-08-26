import bcrypt
from flask import request, jsonify
from database.database import consult

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
                data_user = {"iduser": result[0]['result'][0]['id']}
                return jsonify(data_user), 200
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
        url_imagen = data.get('url_imagen')
        email = data.get('email')
        password = data.get('password')
        nacimiento = data.get('nacimiento')

        if not all([nombre, apellido, url_imagen, email, password, nacimiento]):
            return jsonify({"status": 404, "message": "Solicitud incorrecta. Por favor, rellene todos los campos."}), 404

        hash_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        check = consult(f"SELECT EXISTS(SELECT * FROM usuario WHERE email= '{email}') AS userExists;")

        if check[0]['status'] == 200 and check[0]['result'][0]['userExists'] == 0:
            xsql = (f"INSERT INTO usuario (nombre, apellido, url_imagen, email, password, nacimiento, id_tipo_usuario) "
                    f"VALUES ('{nombre}', '{apellido}', '{url_imagen}', '{email}', '{hash_pw.decode('utf-8')}', '{nacimiento}', 2);")
           
            result = consult(xsql)
            if result[0]['status'] == 200:
                return jsonify({"message": "Usuario registrado"}), 200
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
    
user = {
    "login": login,
    "registro": registro,
    "getuser": getuser,
    "update": update
}
