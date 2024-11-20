# El Switcher

Proyecto de ingenieria de Software 1 2024 - FAMAF UNC

## Estructura del proyecto
    
```
├── public
└── src
    ├── api
    ├── components
    |   ├── container/page
    |   |   ├── component.tsx
    |   |   └── component.test.tsx
    ├── context
    ├── pages
    ├── services
    |   ├── validation
    |   └── utils
    ├── AppRoutes.tsx
    └── main.tsx
```

- **public**: Contiene los archivos estáticos de la aplicación (imagenes, fuentes, etc).
- **src**: Contiene el código fuente de la aplicación.
    - **components**: Contiene los componentes de la aplicación.
        - **container/page**: Contiene los componentes que se utilizan en esa página/vista de la aplicación. También contiene los tests de los componentes.
      - **context**: Contiene los contextos de la aplicación.
      - **pages**: Contiene las páginas/vistas de la aplicación.
      - **services**: Contiene los servicios de la aplicación.
        - **validation**: Contiene las validaciones de los formularios.
        - **utils**: Contiene funciones de utilidad.
      - **AppRoutes.tsx**: Contiene las rutas de la aplicación.
      - **main.tsx**: Archivo principal de la aplicación.

### Nombres de archivos

- Los archivos que exportan componentes usan camelCase en su nombre
- Los archivos que exportan funciones usan kebab-case en su nombre

## Comenzando 🚀

### Requisitos 📋

Para poder correr el proyecto necesitas tener instalado:
- [Docker](https://www.docker.com/)

Opcionalmente, si no queres usar Docker, necesitas tener instalado:
- [Node.js](https://nodejs.org/es/)


### Instalación

#### Linux

1. Clonar el repositorio
```bash
git clone git@github.com:NoSeRecursaMas/switcher-frontend.git
```

2. Ingresar al repositorio
```bash
cd switcher-frontend
```

3. Ejecutar el script de instalación
```bash
make build-docker
```

4. Iniciar el contenedor
```bash
make run-docker
```

5. Ingresar a la aplicación en [http://localhost:3000](http://localhost:3000)

#### Windows

1. Clonar el repositorio 
```bash
git clone git@github.com:NoSeRecursaMas/switcher-frontend.git
```

2. Ingresar al repositorio
```bash
cd switcher-frontend
```

3. Ejecutar el script de instalación
```bash
docker build -t frontend .
```

4. Iniciar el contenedor
```bash
docker run -p 3000:3000 -v ./src:/app/src frontend
```

5. Ingresar a la aplicación en [http://localhost:3000](http://localhost:3000)

#### Sin Docker

1. Clonar el repositorio
```bash
git clone git@github.com:NoSeRecursaMas/switcher-frontend.git
```

2. Ingresar al repositorio
```bash
cd switcher-frontend
```

3. Instalar las dependencias
```bash
npm install
```

4. Correr la aplicación
```bash
npm run dev
```

5. Ingresar a la aplicación en [http://localhost:3000](http://localhost:3000)

## Otras tareas

### Ejecución de pruebas unitarias
```bash
make test
```
