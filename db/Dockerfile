# Usa la imagen base de Postgres
FROM postgres:13

# Configura las variables de entorno para el usuario y la contraseña de la base de datos
ENV POSTGRES_USER=myappaks
ENV POSTGRES_PASSWORD=josecruz06
ENV POSTGRES_DB=appdb

# Copia los scripts de inicialización a la carpeta de inicialización de Postgres
COPY ./init.sql /docker-entrypoint-initdb.d/

# Configura el volumen de datos para almacenar los datos de la base de datos
VOLUME ["/var/lib/postgresql/data"]

# Exponemos el puerto de Postgres
EXPOSE 5432
