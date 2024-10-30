# Usamos la imagen base de Python 3.9 (versión completa si slim tiene problemas)
FROM python:3.9-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo de dependencias
COPY requirements.txt requirements.txt

# Instalamos las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Exponemos el puerto 5000 para Flask
EXPOSE 5001

# Comando para ejecutar la aplicación Flask
CMD ["python", "app.py"]
