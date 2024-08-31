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


def addsong():
    try:
        data = request.json
        iduser = data.get('iduser')
        idsong = data.get('idsong')

        if iduser is None or idsong is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check_query = f"SELECT EXISTS (SELECT * FROM favorito WHERE id_usuario = '{iduser}' AND id_cancion = '{idsong}') AS userExists;"
        check = consult(check_query)

        if check[0]['status'] == 200 and check[0]['result'][0]['userExists'] == 0:
            insert_query = f"INSERT INTO favorito (id_usuario, id_cancion) VALUES ({iduser}, '{idsong}');"
            result = consult(insert_query)

            if result[0]['status'] == 200:
                return jsonify({
                    'status': 200,
                    'message': "Se marcó como favorito"
                }), 200
            else:
                return jsonify({
                    'status': 500,
                    'message': result[0]['message']
                }), 500
        else:
            return jsonify({
                'status': 500,
                'message': "Canción ya ha sido marcada como favorita"
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

def removesong():
    try:
        data = request.json
        iduser = data.get('iduser')
        idsong = data.get('idsong')

        if iduser is None or idsong is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check = consult(f"SELECT EXISTS (SELECT * FROM favorito WHERE id_usuario = '{iduser}' AND id_cancion = '{idsong}') AS userExists;")
        if check[0]['status'] == 200 and check[0]['result'][0]['userExists'] == 0:
            return jsonify({
                'status': 500,
                'message': "Canción no existe en favoritos"
            }), 500

        delete_query = f"DELETE FROM favorito WHERE id_usuario = '{iduser}' AND id_cancion = '{idsong}';"
        result = consult(delete_query)

        if result[0]['status'] == 200:
            return jsonify({
                'status': 200,
                'message': "Canción eliminada de favoritos"
            }), 200
        else:
            return jsonify({
                'status': 500,
                'message': "Canción no se pudo eliminar de favoritos"
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

def getsongs():
    try:
        data = request.json
        iduser = data.get('iduser')

        if iduser is None:
            return jsonify({
                'status': 404,
                'message': "Solicitud incorrecta. Por favor, rellene todos los campos."
            }), 404

        check = consult(f"SELECT EXISTS (SELECT * FROM usuario WHERE id = '{iduser}') AS userExists;")
        if check[0]['status'] == 200 and check[0]['result'][0]['userExists'] == 0:
            return jsonify({
                'status': 500,
                'message': "Usuario no existe"
            }), 500

        query = f"""
        SELECT c.id as id, c.nombre, c.url_caratula as url_caratula, c.duracion, c.artista, c.url_mp3, 1 as es_favorito 
        FROM favorito INNER JOIN cancion as c ON favorito.id_cancion = c.id WHERE favorito.id_usuario = {iduser};
        """
        result = consult(query)

        if result[0]['status'] == 200:
            serialized_result = serialize_timedelta(result[0]['result'])

            return jsonify(serialized_result), 200
        else:
            return jsonify({
                'status': 500,
                'message': "Error al obtener canciones favoritas"
            }), 500
    except Exception as e:
        return jsonify({
            'status': 500,
            'message': str(e)
        }), 500

favorites = {
    'addsong': addsong,
    'removesong': removesong,
    'getsongs': getsongs
}