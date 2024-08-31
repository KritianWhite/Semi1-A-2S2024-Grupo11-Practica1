from datetime import timedelta
import datetime
from flask import request, jsonify
from database.database import consult
from s3 import uploadImageS3, deleteObjectS3
import base64
from config import config

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
        iduser = data.get('iduser')
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        portada = data.get('portada')

        if not all([iduser, nombre, descripcion, portada]):
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404
        
        base64_data = portada.split(",")[1]
        buffer = base64.b64decode(base64_data)
        fecha_hora_actual = datetime.datetime.now()
        fecha_hora_numerica = fecha_hora_actual.strftime('%Y%m%d%H%M%S')

        nombre_sin_espacios = nombre.replace(" ", "").replace(".", "")
        path_image = f"Playlist/{nombre_sin_espacios}{fecha_hora_numerica}.jpg"

        if not uploadImageS3(buffer, path_image):
            return jsonify({'status':500, 'message':'Error al subir imagen en S3'}), 500
        
        url_portada = f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path_image}"

        query = f"""
        INSERT INTO playlist (nombre, descripcion, url_portada, id_user, eliminada) 
        VALUES ('{nombre}', '{descripcion}', '{url_portada}', '{iduser}', 0);
        """
        result = consult(query)

        if result[0]['status'] == 200:
            # aqui no se puede hacer: const idplaylist = result[0].result.insertId;
            response = consult(f"SELECT id FROM playlist WHERE nombre = '{nombre}' AND url_portada = '{url_portada}' AND id_user = '{iduser}' AND eliminada = 0;")
            return jsonify({'status':200, 'message': "Playlist creada", 'id': response[0]['result'][0]['id'] }), 200
        else:
            return jsonify({ 'status': 500, 'message': result[0]['message'] }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def getall():
    try:
        data = request.get_json()
        iduser = data.get('iduser')

        if iduser is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404


        check = consult(f"SELECT EXISTS (SELECT 1 FROM usuario WHERE id = '{iduser}') AS songExists;")
        if check[0]['status'] == 200 and check[0]['result'][0]['songExists'] == 0:
            return jsonify({ 'status': 500, 'message': "Usuario no existe" }), 500
        

        query = f"""
        select id, nombre, descripcion, url_portada
        from playlist where id_user = '{iduser}' and eliminada = 0;
        """
        result = consult(query)

        if result[0]['status'] == 200:
            return jsonify(result[0]['result']), 200
        else:
            return jsonify({ 'status': 500, 'message': result[0]['message'] }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def modify():
    try:
        data = request.get_json()
        iduser = data.get('iduser')
        idplaylist = data.get('idplaylist')
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')

        if not all([iduser, idplaylist, nombre, descripcion]):
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404

        check_query = f"""
        SELECT * FROM playlist 
        WHERE id = '{idplaylist}' AND id_user = '{iduser}';
        """
        result = consult(check_query)

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            update_query = f"""
            UPDATE playlist 
            SET nombre = '{nombre}', descripcion = '{descripcion}' 
            WHERE id = '{idplaylist}' AND id_user = '{iduser}';
            """
            result = consult(update_query)

            if result[0]['status'] == 200:
                return jsonify({ 'status': 200, 'message': "Playlist modificada" }), 200
            else:
                return jsonify({ 'status': 500, 'message': result[0]['message'] }), 500
        else:
            return jsonify({ 'status': 500, 'message': "Error: Playlist no existe" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def updatefoto():
    try:
        data = request.get_json()
        idplaylist = data.get('idplaylist')
        imagen = data.get('imagen')

        if not all([idplaylist, imagen]):
            return jsonify({'status':404, 'message':'Solicitud incorrecta. Por favor, rellene todos los campos.'}), 404

        result = consult(f"SELECT * FROM playlist WHERE id = '{idplaylist}';")

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            base64_data = imagen.split(",")[1]
            buffer = base64.b64decode(base64_data)
            fecha_hora_actual = datetime.datetime.now()
            fecha_hora_numerica = fecha_hora_actual.strftime('%Y%m%d%H%M%S')

            nombre_sin_espacios = result[0]['result'][0]['nombre'].replace(" ", "").replace(".", "")
            path = f"Playlist/{nombre_sin_espacios}{fecha_hora_numerica}.jpg"

            if not uploadImageS3(buffer, path):
                return jsonify({'status':500, 'message':"Error al subir imagen en S3"}), 500

            url_portada= f"https://{config['bucket']}.s3.{config['region']}.amazonaws.com/{path}"
            
            response = consult(f"update playlist set url_portada = '{url_portada}' WHERE id = {idplaylist};")
            
            if response[0]['status'] == 200:
                modify = deleteObjectS3(result[0]['result'][0]['url_portada'])
                if not modify:
                    return jsonify({'status':401, 'message': 'Error al eliminar imagen anterior'}), 500

                return jsonify({'status':200, 'message': 'Imagen de canción actualizada', 'url': url_portada}), 200

        return jsonify({'status':500, 'message':'Error, canción no existe'}), 500

    except Exception as e:
        return jsonify({'status':500, 'message':str(e)}), 500

def deleteplaylist():
    try:
        data = request.get_json()
        idplaylist = data.get('idplaylist')

        if idplaylist is None:
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404

        result = consult(f"SELECT * FROM playlist WHERE id = '{idplaylist}'")
        if result[0]['status'] == 200 and len(result[0]['result']) > 0:

            #esto no es necesario, ya que solo estamos ocultando la playlist por lo cual la imagen puede quedarse
            #por para que no ocupe espacio en el s3 vamos a eliminar, aunque no es necesario
            response = deleteObjectS3(result[0]['result'][0]['url_portada'])
            if not response:
                return jsonify({ 'status': 500, 'message': "Error al eliminar imagen" }), 500
            #---------------------------------------------------

            query = f"""UPDATE playlist SET eliminada = 1 WHERE id = '{idplaylist}';"""
            result = consult(query)

            if result[0]['status'] == 200 :
                return jsonify({'status':200, 'message': "Playlist eliminada" }), 200
            else:
                return jsonify({ 'status': 500, 'message': "Error: Playlist no se eliminó" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def addsong():
    try:
        data = request.json
        iduser = data.get('iduser')
        idplaylist = data.get('idplaylist')
        idsong = data.get('idsong')

        if iduser is None or idplaylist is None or idsong is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check_playlist_query = f"""
        SELECT EXISTS (
            SELECT * FROM playlist 
            WHERE id = {idplaylist} AND id_user = {iduser}
        ) AS usplyExists;
        """
        check_playlist = consult(check_playlist_query)

        if check_playlist[0]['status'] == 200 and check_playlist[0]['result'][0]['usplyExists'] == 0:
            return jsonify({ 'status': 500, 'message': "Playlist/usuario no existe" }), 500
        else:
            check_song_query = f"""
            SELECT EXISTS (
                SELECT * FROM cancionplaylist 
                INNER JOIN playlist ON playlist.id = cancionplaylist.id_playlist
                INNER JOIN cancion ON cancion.id = cancionplaylist.id_cancion
                WHERE playlist.id = {idplaylist} AND playlist.id_user = {iduser} AND cancion.id = {idsong}
            ) AS songExists;
            """
            check_song = consult(check_song_query)

            if check_song[0]['status'] == 200 and check_song[0]['result'][0]['songExists'] == 0:
                insert_query = f"""
                INSERT INTO cancionplaylist (id_cancion, id_playlist) 
                VALUES ('{idsong}', '{idplaylist}');
                """
                result = consult(insert_query)

                if result[0]['status'] == 200:
                    return jsonify({'status':200, 'message': "Canción añadida a playlist" }), 200
                else:
                    return jsonify({ 'status': 500, 'message': result[0]['message'] }), 500
            else:
                return jsonify({ 'status': 500, 'message': "Canción ya ha sido añadida a playlist" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def removesong():
    try:
        data = request.json
        idplaylist = data.get('idplaylist')
        idsong = data.get('idsong')

        if idplaylist is None or idsong is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check = consult(f"SELECT EXISTS (SELECT 1 FROM cancionplaylist WHERE id_playlist = '{idplaylist}' AND id_cancion = '{idsong}') AS songExists;") 
        if check[0]['status'] == 200 and check[0]['result'][0]['songExists'] == 0:
            return jsonify({ 'status': 500, 'message': "Canción no existe en playlist" }), 500

        query = f"""
        DELETE FROM cancionplaylist 
        WHERE id_playlist = '{idplaylist}' AND id_cancion = '{idsong}';
        """
        result = consult(query)

        if result[0]['status'] == 200:
            return jsonify({ 'status': 200, 'message': "Canción eliminada de playlist" }), 200
        else:
            return jsonify({ 'status': 500, 'message': "Canción no se pudo eliminar de playlist" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def getsongs():
    try:
        data = request.json
        idplaylist = data.get('idplaylist')

        if idplaylist is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        query = f"""
        select ca.id, ca.nombre, ca.url_caratula, ca.duracion, ca.artista, ca.url_mp3
        from cancionplaylist as caply
        INNER JOIN cancion as ca on ca.id = caply.id_cancion
        where caply.id_playlist = '{idplaylist}';
        """
        result = consult(query)

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            serialized_result = serialize_timedelta(result[0]['result'])
            return jsonify(serialized_result), 200
        else:
            return jsonify([]), 200
            #return jsonify({ 'status': 500, 'message': "No se pudo obtener las canciones de la playlist" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

playlist = {   
    'create': create,
    'getall': getall,
    'modify': modify,
    'deleteplaylist': deleteplaylist,
    'addsong': addsong,
    'removesong': removesong,
    'getsongs': getsongs,
    'updatefoto': updatefoto
}