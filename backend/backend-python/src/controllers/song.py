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
            insert_query = f"""
                INSERT INTO cancion (nombre, url_caratula, duracion, artista, url_mp3)
                VALUES ('{nombre}', '{imagen}', '{duracion}', '{artista}', '{mp3}');
            """
            insert_result = consult(insert_query)

            if insert_result[0]['status'] == 200:
                return jsonify({'message': 'Canción creada'}), 200
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
        url_imagen = data.get('url_imagen')
        duracion = data.get('duracion')
        artista = data.get('artista')

        if not all([idcancion, nombre, url_imagen, duracion, artista]):
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404

        select_query = f"SELECT * FROM cancion WHERE id = '{idcancion}';"
        select_result = consult(select_query)

        if select_result[0]['status'] == 200 and len(select_result[0]['result']) > 0:
            update_query = f"""
                UPDATE cancion 
                SET nombre = '{nombre}', url_caratula = '{url_imagen}', duracion = '{duracion}', artista = '{artista}' 
                WHERE id = {idcancion};
            """
            update_result = consult(update_query)

            if update_result[0]['status'] == 200:
                return jsonify({'message': 'Canción actualizada'}), 200
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

def remove():
    try:
        data = request.get_json()
        idcancion = data.get('idcancion')

        if idcancion is None:
            return jsonify({
                'status': 404,
                'message': 'Solicitud incorrecta. Por favor, rellene todos los campos.'
            }), 404


        check = consult(f"SELECT EXISTS (SELECT 1 FROM cancion WHERE id = '{idcancion}') AS songExists;")

        if check[0]['status'] == 200 and check[0]['result'][0]['songExists'] == 1:
            delete_fav_query = f"DELETE FROM favorito WHERE id_cancion = '{idcancion}';"
            delete_playlist_query = f"DELETE FROM cancionplaylist WHERE id_cancion = '{idcancion}';"
            delete_song_query = f"DELETE FROM cancion WHERE id = '{idcancion}';"

            consult(delete_fav_query)
            consult(delete_playlist_query)
            delete_result = consult(delete_song_query)

            if delete_result[0]['status'] == 200:
                return jsonify({'message': 'Canción eliminada'}), 200
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

song = {
    'create': create,
    'list': list_songs,
    'modify': modify,
    'remove': remove
}
