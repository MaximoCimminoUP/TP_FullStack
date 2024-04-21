# TP_FullStack
# Guía de Uso de Scripts para Operaciones CRUD en MongoDB

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

## Scripts Disponibles

### addUser.js

- Agrega un nuevo usuario a la base de datos.
- Uso: `node addUser.js [email] [name] [lastname] [isActive] [roles] [password]`

### deleteUser.js

- Elimina un usuario de la base de datos.
- Uso: `node deleteUser.js [userId]`

### updateUser.js

- Actualiza la información de un usuario en la base de datos.
- Uso: `node updateUser.js [userId] [email] [name] [lastname] [isActive] [roles] [password]`

### addStuffedAnimal.js

- Agrega un nuevo peluche a la base de datos.
- Uso: `node addStuffedAnimal.js [species] [model] [coloursAvailable] [stock]`

### deleteStuffedAnimal.js

- Elimina un peluche de la base de datos.
- Uso: `node deleteStuffedAnimal.js [stuffedAnimalId]`

### updateStuffedAnimal.js

- Actualiza la información de un peluche en la base de datos.
- Uso: `node updateStuffedAnimal.js [stuffedAnimalId] [species] [model] [coloursAvailable] [stock]`

### updateCart.js

- Actualiza la cantidad de un producto en el carrito de un usuario.
- Uso: `node updateCart.js [userId] [productId] [quantity]`

### deleteCart.js

- Elimina un producto del carrito de un usuario.
- Uso: `node deleteCart.js [userId] [productId]`

## Verificación de Resultados

- Después de ejecutar cada script, verifique la salida en la terminal para confirmar que la operación se realizó correctamente.
- Verifique directamente en la base de datos MongoDB para confirmar los cambios realizados por cada script.
