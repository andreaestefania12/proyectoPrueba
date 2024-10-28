from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib

app = Flask(__name__)
CORS(app)  # Permitir CORS

# Ruta para enviar una notificación
@app.route('/send', methods=['POST'])
def send_notification():
    data = request.json
    user_id = data.get('user_id')
    message = data.get('message')

    # Aquí puedes implementar la lógica de envío de notificación
    # Ejemplo de envío de correo electrónico usando smtplib
    try:
        # Configurar el servidor SMTP (ejemplo con Gmail, puedes cambiarlo)
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()

        # Login en el servidor de correo
        server.login('tu-email@gmail.com', 'tu-password')  # Cambia el correo y la contraseña

        # Formato del correo
        subject = "Nueva notificación"
        body = f"Hola usuario {user_id}, tienes una nueva notificación: {message}"
        msg = f"Subject: {subject}\n\n{body}"

        # Enviar el correo (al destinatario, puede ser obtenido de la base de datos o proporcionado)
        server.sendmail('tu-email@gmail.com', 'destinatario@gmail.com', msg)  # Cambia destinatario

        server.quit()

        return jsonify({"message": "Notificación enviada exitosamente"}), 200
    except Exception as e:
        print(f"Error al enviar la notificación: {e}")
        return jsonify({"message": "Error al enviar la notificación"}), 500

# Ruta de verificación de salud del microservicio
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
