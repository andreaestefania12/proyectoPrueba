from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import logging
import os

# Inicializar la app y habilitar CORS
app = Flask(__name__, static_folder='static') 
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myappaks:josecruz06@db:5432/appdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Configurar logging para SQLAlchemy
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)  # Ver consultas SQL

""" ---------------------------------------------------------- """
""" -----------------------MODELOS---------------------------- """
""" ---------------------------------------------------------- """
# Modelo de Usuario
class User(db.Model):
    __tablename__ = 'users'  # Especificamos explícitamente el nombre de la tabla 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
# Modelo de Producto
class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

# Modelo de Orden
class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id') ,nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pendiente')

    product = db.relationship('Product', backref= 'orders')

""" ---------------------------------------------------------- """
""" ------------------LOGIN/REGISTER-------------------------- """
""" ---------------------------------------------------------- """

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


""" ---------------------------------------------------------- """
""" -----------------------PRODUCTOS-------------------------- """
""" ---------------------------------------------------------- """

# Ruta para obtener todos los productos
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock
    } for product in products])

# Ruta para obtener un producto por ID
@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock
    })

# Ruta para agregar un nuevo producto
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        stock=data['stock']
    )
    existing_product = Product.query.filter_by(name=new_product.name).first()
    if not existing_product:
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Producto agregado exitosamente"}), 201
    else:
        return jsonify({"message": "El nombre del producto ya existe"}), 409
    

# Ruta para actualizar un producto existente
@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)
    existing_product = Product.query.filter_by(name=product.name).first()
    if not existing_product:
        db.session.commit()
        return jsonify({"message": "Producto actualizado exitosamente"})
    else:
        return jsonify({"message": "El nombre del producto ya existe"}), 409

# Ruta para eliminar un producto
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)

    # validamos si existe el producto en alguna orden
    ordersProductos = Order.query.filter_by(product_id=id).first()
    # Si existe una referencia no podemos eliminar
    if ordersProductos:
        return jsonify({"message": "No se puede eliminar el producto ya que existe en una o varias ordenes"}), 409

    # si no existe, procedemos a eliminar  
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Producto eliminado exitosamente"}), 200

""" ---------------------------------------------------------- """
""" -------------------------ORDENES-------------------------- """
""" ---------------------------------------------------------- """

# Ruta para obtener todas las órdenes
@app.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([{
        "id": order.id,
        "product_id": order.product_id,
        "product_name": order.product.name,
        "quantity": order.quantity,
        "total_price": order.total_price,
        "status": order.status
    } for order in orders])

# Ruta para obtener una orden por ID
@app.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify({
        "id": order.id,
        "product_id": order.product_id,
        "product_name": order.product.name,
        "quantity": order.quantity,
        "total_price": order.total_price,
        "status": order.status
    })

# Ruta para crear una nueva orden
@app.route('/orders', methods=['POST'])
def add_order():
    data = request.json

    # Validamos si existe el producto
    product = Product.query.get(data['product_id'])
    if not product:
        return jsonify({"message": "Producto no encontrado"}), 404
    if product.stock < data['quantity']:
        return jsonify({"message": "Stock insuficiente"}), 400

    new_order = Order(
        product_id=data['product_id'],
        quantity=data['quantity'],
        total_price=data['total_price'],
        status='Pendiente'  # Status inicial de la orden
    )

    product.stock -= data['quantity']
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Orden creada exitosamente"}), 201

# Ruta para actualizar una orden existente
@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get_or_404(id)
    data = request.json

    order.product_id = data.get('product_id', order.product_id)
    order.quantity = data.get('quantity', order.quantity)
    order.total_price = data.get('total_price', order.total_price)
    order.status = data.get('status', order.status)

    db.session.commit()
    return jsonify({"message": "Orden actualizada exitosamente"})

# Ruta para eliminar una orden
@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get_or_404(id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Orden eliminada exitosamente"})

# Ruta para servir la aplicación Angular
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Iniciar la aplicación
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)