from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Configuración inicial de la aplicación Flask
app = Flask(__name__)
CORS(app)  # Permitir CORS

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myappaks:josecruz06@db:5432/authdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo de usuario para la base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

# Ruta para registrar nuevos usuarios
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Verificar si el usuario ya existe
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "El usuario ya existe"}), 400

    # Crear un nuevo usuario
    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 200

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Verificar las credenciales del usuario
    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        return jsonify({"message": "Inicio de sesión exitoso"}), 200
    return jsonify({"message": "Credenciales inválidas"}), 401

# Ruta de verificación de salud (para Prometheus, etc.)
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    # Correr el servidor Flask en modo debug (para desarrollo)
    app.run(host='0.0.0.0', port=5000)
