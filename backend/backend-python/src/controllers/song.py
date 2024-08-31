from datetime import timedelta
import datetime
from flask import request, jsonify
from database.database import consult
from config import config
from s3 import uploadImageS3, uploadMP3S3, deleteObjectS3
import base64

def convert_timedelta_to_string(timedelta_obj):
    """Convert a timedelta object to a string in the format HH:MM:SS."""
    total_seconds = int(timedelta_obj.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"

def serialize_timedelta(result):
    """Convert any timedelta objects in the result to a serializable format."""
    for row in result:
        for key, value in row.items():
            if isinstance(value, timedelta):
                row[key] = convert_timedelta_to_string(value)
    return result

def create():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        imagen = data.get('imagen')
        duracion = data.get('duracion')
        artista = data.get('artista')
        mp3 = data.get('mp3')

        if not all([nombre, imagen, duracion, artista, mp3]):
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404

        check_query = f"""
            SELECT EXISTS (
                SELECT 1 FROM cancion 
                WHERE nombre = '{nombre}' AND duracion = '{duracion}' AND artista = '{artista}'
            ) AS songExists;
        """
        check_result = consult(check_query)
        if check_result[0]['status'] == 200 and check_result[0]['result'][0]['songExists'] == 0:

            base64_data = imagen.split(",")[1]
            buffer = base64.b64decode(base64_data)
            fecha_hora_actual = datetime.datetime.now()
            fecha_hora_numerica = fecha_hora_actual.strftime('%Y%m%d%H%M%S')

            nombre_sin_espacios = nombre.replace(" ", "").replace(".", "")
            path_image = f"Fotos/{nombre_sin_espacios}{fecha_hora_numerica}.jpg"

            if not uploadImageS3(buffer, path_image):
                return jsonify({'status':500, 'message':'Error al subir imagen en S3'}), 500

            base64_data_mp3 = mp3.split(",")[1]
            buffer_mp3 = base64.b64decode(base64_data_mp3)
            path_mp3 = f"Canciones/{nombre_sin_espacios}{fecha_hora_numerica}.mp3"
   
            if not uploadMP3S3(buffer_mp3, path_mp3):
                return jsonify({'status':500, 'message':'Error al subir mp3 en S3'}), 500

            url_caratula = f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path_image}"
            url_mp3 = f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path_mp3}"


            insert_query = f"""
                INSERT INTO cancion (nombre, url_caratula, duracion, artista, url_mp3)
                VALUES ('{nombre}', '{url_caratula}', '{duracion}', '{artista}', '{url_mp3}');
            """
            insert_result = consult(insert_query)
            if insert_result[0]['status'] == 200:
                id_cancion = consult(f"select id from cancion where nombre = '{nombre}' and duracion = '{duracion}' and artista = '{artista}';") 
                if id_cancion[0]['status'] != 200:
                    return jsonify({
                        'status': 500,
                        'message': 'Error al obtener el id de la canción'
                    }), 500
                return jsonify({'status':200, 'message': 'Canción creada', 'id_cancion': id_cancion[0]['result'][0]['id']}), 200
            else:
                return jsonify({
                    'status': 500,
                    'message': insert_result[0]['message']
                }), 500
        else:
            return jsonify({
                'status': 500,
                'message': 'Canción ya existe'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

def list_songs():
    try:
        list_query = "SELECT * FROM cancion;"
        list_result = consult(list_query)
        if list_result[0]['status'] == 200:
            serialized_result = serialize_timedelta(list_result[0]['result'])

            return jsonify(serialized_result), 200
        else:
            return jsonify({
                'status': 500,
                'message': list_result[0]['message']
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

def modify():
    try:
        data = request.get_json()
        idcancion = data.get('idcancion')
        nombre = data.get('nombre')
        duracion = data.get('duracion')
        artista = data.get('artista')

        if not all([idcancion, nombre, duracion, artista]):
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404

        select_query = f"SELECT * FROM cancion WHERE id = '{idcancion}';"
        select_result = consult(select_query)

        if select_result[0]['status'] == 200 and len(select_result[0]['result']) > 0:
            update_query = f"""
                UPDATE cancion 
                SET nombre = '{nombre}', duracion = '{duracion}', artista = '{artista}' 
                WHERE id = {idcancion};
            """
            update_result = consult(update_query)

            if update_result[0]['status'] == 200:
                return jsonify({'status':200, 'message': 'Canción actualizada'}), 200
            else:
                return jsonify({
                    'status': 500,
                    'message': update_result[0]['message']
                }), 500
        else:
            return jsonify({
                'status': 500,
                'message': 'Canción no existe'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

def updateImage():
    try:
        data = request.get_json()
        idcancion = data.get('idcancion')
        imagen = data.get('imagen')

        if not all([idcancion, imagen]):
            return jsonify({'status':404, 'message':'Solicitud incorrecta. Por favor, rellene todos los campos.'}), 404

        result = consult(f"SELECT * FROM cancion WHERE id = '{idcancion}';")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            base64_data = imagen.split(",")[1]
            buffer = base64.b64decode(base64_data)
            fecha_hora_actual = datetime.datetime.now()
            fecha_hora_numerica = fecha_hora_actual.strftime('%Y%m%d%H%M%S')

            nombre_sin_espacios = result[0]['result'][0]['nombre'].replace(" ", "").replace(".", "")
            path = f"Fotos/{nombre_sin_espacios}{fecha_hora_numerica}.jpg"

            if not uploadImageS3(buffer, path):
                return jsonify({'status':500, 'message':"Error al subir imagen en S3"}), 500

            url_caratula = f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path}"
            
            response = consult(f"UPDATE cancion SET url_caratula = '{url_caratula}' WHERE id = {idcancion};")

            if response[0]['status'] == 200:

                modify = deleteObjectS3(result[0]['result'][0]['url_caratula'])
                if not modify:
                    return jsonify({'status':401, 'message': 'Error al eliminar imagen anterior'}), 500

                return jsonify({'status':200, 'message': 'Imagen de canción actualizada', 'url': url_caratula}), 200

        return jsonify({'status':500, 'message':'Error, canción no existe'}), 500

    except Exception as e:
        return jsonify({'status':500, 'message':str(e)}), 500

def updateMp3():
    try:
        data = request.get_json()
        idcancion = data.get('idcancion')
        mp3 = data.get('mp3')

        if not all([idcancion, mp3]):
            return jsonify({'status':404, 'message':'Solicitud incorrecta. Por favor, rellene todos los campos.'}), 404

        result = consult(f"SELECT * FROM cancion WHERE id = '{idcancion}';")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            base64_data = mp3.split(",")[1]
            buffer = base64.b64decode(base64_data)
            fecha_hora_actual = datetime.datetime.now()
            fecha_hora_numerica = fecha_hora_actual.strftime('%Y%m%d%H%M%S')

            nombre_sin_espacios = result[0]['result'][0]['nombre'].replace(" ", "").replace(".", "")
            path = f"Canciones/{nombre_sin_espacios}{fecha_hora_numerica}.mp3"

            if not uploadMP3S3(buffer, path):
                return jsonify({'status':500, 'message':'Error al subir mp3 en S3'}), 500

            url_mp3  = f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path}"
            
            response = consult(f"UPDATE cancion SET url_mp3 = '{url_mp3}' WHERE id = {idcancion};")

            if response[0]['status'] == 200:

                modify = deleteObjectS3(result[0]['result'][0]['url_mp3'])
                if not modify:
                    return jsonify({'status':401, 'message': 'Error al eliminar mp3 anterior'}), 500

                return jsonify({'status':200, 'message': 'MP3 de la canción actualizado', 'url': url_mp3 }), 200

        return jsonify({'status':500, 'message':'Error, canción no existe'}), 500

    except Exception as e:
        return jsonify({'status':500, 'message':str(e)}), 500

def remove():
    try:
        data = request.get_json()
        idcancion = data.get('idcancion')

        if idcancion is None:
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404

        check = consult(f"select * from cancion where id = '{idcancion}';")
        if check[0]['status'] == 200 and len(check[0]['result']) > 0:

            modify = deleteObjectS3(check[0]['result'][0]['url_caratula'])
            if not modify:
                return jsonify({'status':401, 'message': 'Error al eliminar imagen anterior'}), 500
            
            modify = deleteObjectS3(check[0]['result'][0]['url_mp3'])
            if not modify:
                return jsonify({'status':401, 'message': 'Error al eliminar mp3 anterior'}), 500

            consult(f"DELETE FROM favorito WHERE id_cancion = '{idcancion}';")
            consult(f"DELETE FROM cancionplaylist WHERE id_cancion = '{idcancion}';")
            delete_result = consult(f"DELETE FROM cancion WHERE id = '{idcancion}';")

            if delete_result[0]['status'] == 200:
                return jsonify({'status':200, 'message': 'Canción eliminada'}), 200
            else:
                return jsonify({
                    'status': 500,
                    'message': 'Error, canción no se pudo eliminar'
                }), 500
        else:
            return jsonify({
                'status': 500,
                'message': 'Canción no existe' 
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

def lastest():
    try:
        data = request.get_json()
        idusuario = data.get('idusuario')

        if idusuario is None:
            return jsonify({'status':404, 'message':"Ocurrió un error interno"}), 404

        xsql = f"""
        SELECT c.*, 
               IF(f.id_usuario IS NOT NULL, 1, 0) AS es_favorito 
        FROM cancion c 
        LEFT JOIN favorito f ON c.id = f.id_cancion AND f.id_usuario = '{idusuario}' 
        ORDER BY c.id DESC 
        LIMIT 10;
        """

        result = consult(xsql)
        if result[0]['status'] == 200:
            return jsonify(serialize_timedelta(result[0]['result'])), 200
        else:
            return jsonify({'status':500, 'message':'Error al obtener las últimas canciones'}), 500

    except Exception as e:
        return jsonify({'status':500, 'message':str(e)}), 500

def get_all():
    try:
        data = request.get_json()
        idusuario = data.get('idusuario')
        if not idusuario:
            return jsonify({'status':404, 'message':'Solicitud incorrecta.'}), 404

        xsql = f"SELECT c.*, IF(f.id_usuario IS NOT NULL, 1, 0) as es_favorito FROM cancion c LEFT JOIN favorito f ON c.id = f.id_cancion AND f.id_usuario = '{idusuario}';"
        result = consult(xsql)
        if result[0]['status'] == 200:
            return jsonify(serialize_timedelta(result[0]['result'])), 200
        else:
            return jsonify({'status':500, 'message':result[0]['message']}), 500
        
    except Exception as e:
        return jsonify({'status':500, 'message':str(e)}), 500

song = {
    'create': create,
    'list': list_songs,
    'modify': modify,
    'updateimage': updateImage,
    'updatemp3': updateMp3,
    'remove': remove,
    'lastest': lastest,
    'search': get_all
}
