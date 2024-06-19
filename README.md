# TP_FullStack

## Descripción
Este proyecto es una aplicación web full-stack desarrollada como proyecto para la materia Full Stack Web.

## Instalación
Para instalar las dependencias del proyecto, ejecute:
npm install

Crear un archivo .env y agregarlo en la root del proyecto. Sus contenidos son:

PORT = 8080

URI = "mongodb+srv://cimminomaximo1:xI4guBeoxfr8Vwke@cluster0.bwqyzg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

JWT_SECRET_KEY= "#JWT_SECRET_KEY123#"

## Uso
Para iniciar el servidor, ejecuta:
npm index.js
(el ubicado en la root)

El servidor se iniciará en el puerto especificado (por defecto: 8080).

## Dependencias
- **jsonwebtoken**: Librería para generar y verificar Tokens Web JSON (JWT).
- **mongoose**: Herramienta de modelado de objetos MongoDB diseñada para trabajar en un entorno asíncrono.
- **nodemailer**: Módulo para enviar correos electrónicos desde aplicaciones Node.js.
- **yargs**: Analizador de argumentos de línea de comandos para aplicaciones Node.js.

## Variables de Entorno
Las siguientes variables de entorno deben configurarse(le enviare el archivo.env en la entrega por blackboard):
- **PORT**: El puerto en el que debe ejecutarse el servidor.
- **URI**: El URI de conexión a MongoDB.

## Rutas

### Página de Inicio
GET /
Muestra un mensaje de bienvenida, placeholder para el diseño de la landing page

### Registro
POST /register
Permite a los usuarios registrarse en la aplicación proporcionando su correo electrónico, nombre, apellido y contraseña. (de momento se debe enviar en el JSON todos los datos, luego se cambiara para solo precisar estos nombrados. Ejemplos del JSON necesario mas abajo)

### Inicio de Sesión
POST /login
Permite a los usuarios registrados iniciar sesión proporcionando su correo electrónico y contraseña. Devuelve un token JWT al autenticarse correctamente.

### Tienda
GET /shop
Muestra los productos disponibles en la tienda.

### Gestión de Stock
POST /stock


Permite agregar nuevos productos. Requiere información de id, especie, modelo, colores disponibles y stock.


## Comandos
- `npm install`: Instala las dependencias del proyecto.
- `npm index.js`: Inicia el servidor.

## Ejemplos JSON para postman junto sus endpoints para pruebas mas rapidas y sencillas
## register
localhost:8080/register :
{
    "email": "example@example.com",
    "name": "John",
    "lastname": "Doe",
    "isActive": true,
    "roles": ["user"],
    "password": "testpassword123"
}
## login 
localhost:8080/login :
{
    "email": "example@example.com",
    "password": "testpassword123"
}
## agregar nuevos peluches al stock
localhost:8080/stock :
{
    "id": "2",
    "species": "Bear",
    "model": "Teddy",
    "coloursAvailable": ["brown", "white"],
    "stock": 100
}
## editar peluches
localhost:8080/stuffedAnimals/:id (editar los peluches) == al json de stock.

##borrar peluches
enviar delete request a localhost:8080/stuffedAnimals/:id



# Guía de Uso de Scripts para Operaciones CRUD en MongoDB WIP 

## Dependencias Necesarias

- Node.js
- npm (Administrador de paquetes de Node.js)

### Dependencias del Proyecto

- express
- jsonwebtoken
- mongoose

## Consideraciones Iniciales

- Asegúrese de tener Node.js instalado en su sistema.
- Instale las dependencias ejecutando `npm install` en la terminal dentro del directorio del proyecto.
- Los scripts están escritos en JavaScript y pueden ejecutarse utilizando Node.js.


## Verificación de Resultados

- Después de ejecutar cada script, verifique la salida en la terminal para confirmar que la operación se realizó correctamente.
- Verifique directamente en la base de datos MongoDB para confirmar los cambios realizados por cada script.
- Con el frontend disponible, todas las operaciones seran comprobables ya sea mediante el uso de la tecla "f12", y observar la tab "network" o el display del frontend. 
