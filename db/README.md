# Pasos para desplegar base de datos
docker build -t dcruz06/db:latest .

# Correr el contenedor
sudo docker run -d -p 5432:5432 dcruz06/db:latest

# push
docker push dcruz06/db:latest

# Credenciales de conexión
host:192-168.100.3
database: appdb
user:myappaks
pwd:josecruz06
port:5432
