# Etapa 1: Compilar el frontend de Angular
FROM node:16 AS build-frontend
WORKDIR /app/frontend
COPY frontend/portal-web/package*.json ./portal-web/
RUN cd portal-web && npm install
COPY frontend/portal-web/ ./portal-web/
RUN cd portal-web && npm run build --prod

# Etapa 2: Configurar el backend y combinar el frontend compilado
FROM python:3.9-slim

# Crear la carpeta de trabajo y copiar el código del backend
WORKDIR /app
COPY backend/ /app/backend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copiar el frontend compilado desde la etapa anterior
COPY --from=build-frontend /app/frontend/portal-web/dist/portal-web /app/backend/static

# Configurar la variable de entorno para Flask
ENV FLASK_APP=backend/app.py

# Exponer el puerto para Flask
EXPOSE 5001

# Comando para iniciar la aplicación Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
