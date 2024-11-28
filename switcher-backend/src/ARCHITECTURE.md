# Arquitectura Hexagonal y Vertical Slicing

## Descripción General

Este proyecto utiliza una **arquitectura hexagonal** combinada con **vertical slicing**. La arquitectura hexagonal permite separar claramente las diferentes capas de la aplicación para mejorar la modularidad, mantenibilidad y escalabilidad. El **vertical slicing** organiza el código por características o módulos (por ejemplo, `room`, `game`, `player`), cada uno con sus propias capas bien definidas.

## Estructura del Proyecto

Tres capas principales: domain, application e infrastructure.

```bash
switcher-backend/
├── docekr-compose.yml
├── Dockerfile
├── Makefile
├── README.md
├── requirements.txt
└── src
    ├── main.py
    ├── games
    │   ├── application         # Contiene los casos de uso, que son las acciones concretas aplicando las reglas del dominio.
    │   ├── domain              # Lógica de negocio y reglas específicas
    │   ├── infrastructure      # Interacción con bases de datos y tecnologías externas
    │   └── test
    ├── Rooms                   # Example
    │   ├── application
    │   │   └── use_case.py                     # Casos de uso
    │   ├── domain
    │   │   ├── room_Models.py                  # Modelos del dominio.
    │   │   ├── room_repository.py              # Interfaces para el acceso y manipulación de datos desde el dominio.
    │   │   ├── room_static_validators.py       # Validadores estáticos para asegurarse de que los datos cumplen con las reglas del dominio.
    │   │   └── room_service.py                 # Servicios relacionados con la lógica de negocio.
    │   ├── infrastructure
    │   │   ├── api.py                          # Controlador API.
    │   │   ├── room_dbModels.py                # Modelos específicos para interactuar con la base de datos (SQLAlchemy).
    │   │   ├── room_repository.py              # Implementación de acceso a datos usando bases de datos u otras fuentes externas.
    │   │   └── room_websockets.py              # Lógica relacionada con la comunicación en tiempo real mediante WebSockets.
    │   └── test
    ├── players
    │   ├── application
    │   ├── domain
    │   ├── infrastructure
    │   └── test
    └── shared
```

### Capas de la Arquitectura

### 1. Domain
 - Qué sabe: Solo detalles de sí mismo.
 - No conoce: Ninguna otra capa (ni application ni infrastructure).
 - Responsabilidad: Define la lógica del negocio y los Modelsos del dominio. Es la parte más estable y pura del sistema, sin depender de la tecnología externa.

---

### 2. Application
 - Qué sabe: Detalles de domain (cómo usar los Modelsos y reglas del dominio).
 - No conoce: Detalles de infrastructure (cómo se implementan la persistencia de datos o las interacciones externas).
 - Responsabilidad: Coordina los casos de uso y orquesta cómo se aplican las reglas del dominio para responder a las acciones del usuario.

---

### 3. Infrastructure
 - Qué sabe:
    - Detalles de application (cómo implementar puertos y adaptadores para la capa de application).
    - Detalles de domain (cómo persistir datos relacionados con los Modelsos del dominio).
 - Responsabilidad: Implementa la persistencia de datos, la comunicación con otros servicios, y todo lo relacionado con el entorno técnico. Aquí es donde se manejan las conexiones a bases de datos o las llamadas a otros servicios.