from datetime import timedelta
from flask import request, jsonify
from database.database import consult


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
        data = request.json
        iduser = data.get('iduser')
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        portada = data.get('portada')

        if iduser is None or nombre is None or descripcion is None or portada is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        query = f"""
        INSERT INTO playlist (nombre, descripcion, url_portada, id_user, eliminada) 
        VALUES ('{nombre}', '{descripcion}', '{portada}', '{iduser}', 0);
        """
        print(query)
        result = consult(query)

        if result[0]['status'] == 200:
            return jsonify({ 'message': "Playlist creada" }), 200
        else:
            return jsonify({ 'status': 500, 'message': result[0]['message'] }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def getall():
    try:
        data = request.json
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
        SELECT id AS idplaylist, nombre, descripcion, url_portada AS portada
        FROM playlist
        WHERE id_user = '{iduser}' AND eliminada = 0;
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
        data = request.json
        iduser = data.get('iduser')
        idplaylist = data.get('idplaylist')
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        portada = data.get('portada')

        if iduser is None or idplaylist is None or nombre is None or descripcion is None or portada is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check_query = f"""
        SELECT * FROM playlist 
        WHERE id = '{idplaylist}' AND id_user = '{iduser}';
        """
        result = consult(check_query)

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            update_query = f"""
            UPDATE playlist 
            SET nombre = '{nombre}', descripcion = '{descripcion}', url_portada = '{portada}' 
            WHERE id = '{idplaylist}' AND id_user = '{iduser}';
            """
            result = consult(update_query)

            if result[0]['status'] == 200:
                return jsonify({ 'message': "Playlist modificada" }), 200
            else:
                return jsonify({ 'status': 500, 'message': result[0]['message'] }), 500
        else:
            return jsonify({ 'status': 500, 'message': "Error: Playlist no existe" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

def deletesong():
    try:
        data = request.json
        iduser = data.get('iduser')
        idplaylist = data.get('idplaylist')

        if iduser is None or idplaylist is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check = consult(f"SELECT EXISTS (SELECT 1 FROM playlist WHERE id = '{idplaylist}' AND id_user = '{iduser}') AS songExists;")
        if check[0]['status'] == 200 and check[0]['result'][0]['songExists'] == 0:
            return jsonify({ 'status': 500, 'message': "Playlist/usuario no existe" }), 500
        

        query = f"""
        UPDATE playlist 
        SET eliminada = 1 
        WHERE id = '{idplaylist}' AND id_user = '{iduser}';
        """
        result = consult(query)

        if result[0]['status'] == 200 :
            return jsonify({ 'message': "Playlist eliminada" }), 200
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
                    return jsonify({ 'message': "Canción añadida a playlist" }), 200
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
            return jsonify({ 'message': "Canción eliminada de playlist" }), 200
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
        SELECT ca.id AS idsong, ca.nombre, ca.url_caratula AS url_imagen, ca.duracion, ca.artista, ca.url_mp3
        FROM cancionplaylist
        INNER JOIN cancion AS ca ON ca.id = cancionplaylist.id_cancion
        WHERE cancionplaylist.id_playlist = '{idplaylist}';
        """
        result = consult(query)

        if result[0]['status'] == 200 and len(result[0]['result']) > 0:
            serialized_result = serialize_timedelta(result[0]['result'])
            return jsonify(serialized_result), 200
        else:
            return jsonify({ 'status': 500, 'message': "No se pudo obtener las canciones de la playlist" }), 500
    except Exception as e:
        return jsonify({ 'status': 500, 'message': str(e) }), 500

playlist = {   
    'create': create,
    'getall': getall,
    'modify': modify,
    'deletesong': deletesong,
    'addsong': addsong,
    'removesong': removesong,
    'getsongs': getsongs
}