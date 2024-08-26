from flask import Flask
from flask_cors import CORS
from Routes.api import api_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_blueprint)
app.json.sort_keys = False

if __name__ == '__main__':
    port = 4000
    app.run(debug=True, host='0.0.0.0', port=port)
