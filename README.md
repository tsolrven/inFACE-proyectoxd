# inFACE

Aplicación fullstack dockerizada con React (Vite), Node.js (Express), TypeORM y PostgreSQL.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

---

## Despliegue con Docker Compose

### 1. Clonar el repositorio

```bash
git clone https://github.com/tsolrven/inFACE-proyecto.git
cd inFACE
```

### 2. (Opcional) Configurar variables de entorno

Copia el archivo de ejemplo y edita los valores si es necesario:

```bash
cp .env.example .env
```

> Si no creas un `.env`, el proyecto igual levanta usando los valores por defecto definidos en `docker-compose.yml`.

### 3. Levantar el proyecto

```bash
docker compose up --build
```

Espera a que todos los servicios estén corriendo. Verás en los logs que la base de datos está lista y el backend se conectó correctamente.

### 4. Acceder a la aplicación

| Servicio    | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:8080 |
| Backend API | http://localhost:3000 |

### 5. Detener los contenedores

```bash
docker compose down
```

Para detener **y eliminar los volúmenes** (borra los datos de la base de datos):

```bash
docker compose down -v
```

---

## Estructura del proyecto

```
inFACE/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── Dockerfile
    └── ...

```

---

## Variables de entorno

El archivo `.env.example` contiene las variables necesarias (sin valores reales):

```env
PORT=3000
DB_HOST=database
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DATABASE=inface_db
```

> El `docker-compose.yml` define valores por defecto para cada variable, por lo que el proyecto puede levantarse sin necesidad de crear un `.env`.
