from flask import Blueprint, request
from config import config
from controllers.user import user
from controllers.song import song
from controllers.favorites import favorites
from controllers.playlist import playlist

api_blueprint = Blueprint('api', __name__)


# Usuario
@api_blueprint.route('/user/login', methods=['POST'])
def user_login():
    return user['login']()

@api_blueprint.route('/user/register', methods=['POST'])
def user_register():
    return user['registro']()

@api_blueprint.route('/user/getuser', methods=['POST'])
def user_getuser():
    return user['getuser']()

@api_blueprint.route('/user/update', methods=['POST'])
def user_update():
    return user['update']()

@api_blueprint.route('/user/updatephoto', methods=['POST'])
def user_updatephoto():
    return user['updatephoto']()

# Canciones
@api_blueprint.route('/song/create', methods=['POST'])
def song_create():
    return song['create']()

@api_blueprint.route('/song/list', methods=['GET'])
def song_list():
    return song['list']()

@api_blueprint.route('/song/modify', methods=['POST'])
def song_modify():
    return song['modify']()

@api_blueprint.route('/song/remove', methods=['POST'])
def song_remove():
    return song['remove']()

# Playlists
@api_blueprint.route('/playlist/create', methods=['POST'])
def playlist_create():
    return playlist['create']()

@api_blueprint.route('/playlist/getall', methods=['POST'])
def playlist_getall():
    return playlist['getall']()

@api_blueprint.route('/playlist/modify', methods=['POST'])
def playlist_modify():
    return playlist['modify']()

@api_blueprint.route('/playlist/delete', methods=['POST'])
def playlist_delete():
    return playlist['deletesong']()

@api_blueprint.route('/playlist/addsong', methods=['POST'])
def playlist_addsong():
    return playlist['addsong']()

@api_blueprint.route('/playlist/removesong', methods=['POST'])
def playlist_removesong():
    return playlist['removesong']()

@api_blueprint.route('/playlist/getsongs', methods=['POST'])
def playlist_getsongs():
    return playlist['getsongs']()

# Favoritos
@api_blueprint.route('/favorites/addsong', methods=['POST'])
def favorites_addsong():
    return favorites['addsong']()

@api_blueprint.route('/favorites/removesong', methods=['POST'])
def favorites_removesong():
    return favorites['removesong']()

@api_blueprint.route('/favorites/getsongs', methods=['POST'])
def favorites_getsongs():
    return favorites['getsongs']()
    