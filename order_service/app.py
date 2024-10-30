from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Inicialización de la aplicación Flask
app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myappaks:josecruz06@db:5432/authdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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
    new_order = Order(
        product_id=data['product_id'],
        quantity=data['quantity'],
        total_price=data['total_price'],
        status='Pendiente'  # Status inicial de la orden
    )
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

# Ruta de verificación de salud
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
