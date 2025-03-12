# Inventario Project

Este proyecto consiste en un sistema de inventario con una arquitectura de frontend y backend separados.

## Tecnologías utilizadas

### Backend (API)
- PHP 8.2+
- Laravel 12
- MySQL (base de datos)
- Laravel Sanctum para autenticación
- Eloquent ORM

### Frontend
- React.js
- React Router para navegación
- Axios para peticiones HTTP
- Bootstrap/Material UI (según corresponda) para estilos
- Context API para manejo de estado

## Instrucciones para ejecutar el proyecto

### Requisitos previos
- PHP 8.2 o superior
- Composer
- Node.js (v16 o superior)
- NPM o Yarn
- MySQL instalado y en ejecución

- Configuración de la Base de Datos

### Crear la base de datos:
CREATE DATABASE api_db;

### Configuración del Backend (API)

1. Navegar al directorio de la API:
   ```
   cd api
   ```

2. Instalar dependencias de PHP con Composer:
   ```
   composer install
   ```

3. Copiar el archivo de entorno de ejemplo y configurarlo:
   ```
   cp .env.example .env
   ```

4. Configurar el archivo `.env` con tus credenciales de MySQL:
   ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3307
    DB_DATABASE=api_db
    DB_USERNAME=root
    DB_PASSWORD=
   ```

5. Generar la clave de la aplicación:
   ```
   php artisan key:generate
   ```

6. Ejecutar las migraciones para crear las tablas en la base de datos:
   ```
   php artisan migrate
   ```

7. Si es necesario, popular la base de datos con datos de prueba:
   ```
   php artisan db:seed
   ```

8. Iniciar el servidor de desarrollo:
   ```
   php artisan serve
   ```

9. La API estará disponible en `http://localhost:8000`

### Configuración del Frontend

1. Navegar al directorio del frontend:
   ```
   cd inventariofront
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Crear o modificar el archivo `.env` en la raíz del directorio `inventariofront`:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Iniciar la aplicación:
   ```
   npm start
   ```

5. La aplicación estará disponible en `http://localhost:3000`

## Ver el Token de Autenticación con Sanctum

Laravel Sanctum genera tokens SPA para autenticación. Aquí tienes algunas maneras de trabajar con estos tokens:

### Ver Tokens en los Logs de Laravel

La forma más directa de ver los tokens durante el desarrollo es revisar los logs de Laravel:

1. **Revisar el archivo de log**:
   ```
   cat storage/logs/laravel.log
   ```
   
   O para ver solo las últimas entradas:
   ```
   tail -f storage/logs/laravel.log
   ```

### Configuración Importante para el Frontend

Para que Sanctum funcione correctamente con tu frontend React, asegúrate de configurar axios:

```javascript
// En tu archivo de configuración de axios
import axios from 'axios';

// Configuración crucial para Sanctum
axios.defaults.withCredentials = true;
```

### En el Backend (Laravel)

1. **Verificar la Configuración de Sanctum**:
   - Asegúrate de que el archivo `config/sanctum.php` tenga la configuración correcta:
   ```php
   'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
       '%s%s',
       'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
       env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
   ))),
   ```

2. **Ruta de Prueba**:
   - Puedes añadir una ruta de prueba para verificar tokens en Laravel:
   ```php
   // En routes/api.php
   Route::middleware('auth:sanctum')->get('/check-auth', function (Request $request) {
       return [
           'message' => 'Autenticado correctamente',
           'user' => $request->user(),
       ];
   });
   ```

## Características

- Gestión de inventario y productos
- Autenticación de usuarios con Laravel Sanctum


## Licencia

Este proyecto está licenciado bajo Carlos Fernández
