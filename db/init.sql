-- Crear usuario para todas las bases de datos
CREATE USER myappaks WITH ENCRYPTED PASSWORD 'josecruz06';

-- Crear base de datos para el servicio de autenticación (Auth Service)
CREATE DATABASE authdb;
-- Otorgar privilegios a myappaks sobre authdb
GRANT ALL PRIVILEGES ON DATABASE authdb TO myappaks;

-- Crear base de datos para el servicio de productos (Product Service)
CREATE DATABASE productdb;
-- Otorgar privilegios a myappaks sobre productdb
GRANT ALL PRIVILEGES ON DATABASE productdb TO myappaks;

-- Crear base de datos para el servicio de órdenes (Order Service)
CREATE DATABASE orderdb;
-- Otorgar privilegios a myappaks sobre orderdb
GRANT ALL PRIVILEGES ON DATABASE orderdb TO myappaks;

-- Crear base de datos para el servicio de notificaciones (Notification Service)
CREATE DATABASE notificationdb;
-- Otorgar privilegios a myappaks sobre notificationdb
GRANT ALL PRIVILEGES ON DATABASE notificationdb TO myappaks;


-- ===============================
-- Configuraciones para authdb
-- ===============================
\connect authdb;

-- Tabla para los usuarios del sistema de autenticación
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- Configuraciones para productdb
-- ===============================
\connect productdb;

-- Tabla de productos para el servicio de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- Configuraciones para orderdb
-- ===============================
\connect orderdb;

-- Tabla de órdenes para el servicio de órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    --FOREIGN KEY (product_id) REFERENCES productdb.products(id) ON DELETE CASCADE
);

-- ===============================
-- Configuraciones para notificationdb
-- ===============================
\connect notificationdb;

-- Tabla para el servicio de notificaciones
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
