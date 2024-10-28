from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import logging

# Inicializar la app y habilitar CORS
app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myappaks:josecruz06@db:5432/authdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Configurar logging para SQLAlchemy
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)  # Ver consultas SQL

# Modelo de Usuario
class User(db.Model):
    __tablename__ = 'users'  # Especificamos explícitamente el nombre de la tabla 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Endpoint para registrar nuevos usuarios
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Obtener datos como JSON

    # Logging de datos recibidos
    logging.info(f"Datos recibidos: {data}")

    # Verificar que los datos requeridos estén presentes
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    # Comprobar si el nombre de usuario o correo ya existen
    existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
    if existing_user:
        return jsonify({"message": "El nombre de usuario o correo ya está registrado"}), 400

    # Generar el hash de la contraseña
    try:
        hashed_password = generate_password_hash(data['password'], method='sha256')
    except Exception as e:
        logging.error(f"Error al generar el hash de la contraseña: {e}")
        return jsonify({"message": "Error al procesar la contraseña"}), 500

    # Crear el nuevo usuario
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)

    # Intentar agregar el usuario a la base de datos
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error al registrar usuario: {e}")
        return jsonify({"message": "Error al registrar usuario"}), 500

# Endpoint para verificar la salud del servicio
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Auth Service is running"}), 200

# Verificar credenciales de inicio de sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Logging de datos recibidos
    logging.info(f"Datos recibidos: {data}")

    # Verificar que se enviaron username y contraseña
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    # Buscar al usuario por username
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        return jsonify({"message": "El usuario no existe"}), 404

    # Verificar la contraseña
    if not check_password_hash(user.password_hash, data['password']):
        return jsonify({"message": "Contraseña incorrecta"}), 401

    return jsonify({"message": "Inicio de sesión exitoso"}), 200

# Manejo de errores global para cualquier error no manejado
@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f"Error no manejado: {e}")
    return jsonify({"message": "Ha ocurrido un error"}), 500

# Iniciar la aplicación
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
