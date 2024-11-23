# Ejemplo de Ticket:

## **Información del ticket**: 
- **Tipo:** Historia 
- **Prioridad:** Alta 
- **Creador:** Gonzalo Agustín Canavesio 
- **Responsable:** Valentino Mensio 
- **Etiquetas:** Backend 
- **Estimación en puntos:** 5 
- **Revisores:** fabrilonghi1, Gonzalo Agustín Canavesio 
- **Sprints asociados:** Sprint 1, Sprint 2 (Deuda técnica) 

## **Issue links:** 	
- **Blocks:** 
    - SW-24: Abandonar partida en curso (Done) 
    - SW-25: Pasar turno (Done) 
- **Is blocked by:** 
    - SW-8: Crear partida (parte websockets, Done) 
- **Relates to:** 
    - SW-26: Iniciar partida (Endpoint, tablero y avatares) 

## **Descripción:**  	 
**Dado** que el usuario creador ya se ha reunido con jugadores suficientes para iniciar una partida, 

**Cuando** el host selecciona *Iniciar partida*,

**Entonces** el usuario debe ser redirigido a una nueva interfaz donde podrá observar el juego Switcher recién iniciado. 

## **Notas Técnicas:** 
- Hacer servicio para repartir cartas hasta llegar a 3 cartas movimiento en el jugador (Se reutiliza más adelante) 
- Hacer servicio para repartir cartas hasta llegar a 3 cartas figura en el jugador (Se reutiliza más adelante) 

## **Criterios de aceptación:**
**Actualización de base de datos:** 
- Modificar la base de datos donde se almacena la información relevante de las partidas para almacenar información sobre el juego (bloques de colores, relaciones, turnos, etc). 
- Crear la base de datos donde se almacena la información relevante de las cartas movimiento.
- Crear la base de datos donde se almacena la información relevante de las cartas figura.

**Validaciones del endpoint:** 
- El endpoint sigue la estructura del documento de la **API**.
- Retornar **error** si: 
    - No se alcanza el límite de jugadores para iniciar la partida 
    - Quien envia la petición de iniciar no es el creador 
    - La room con esa id no existe 
    - El jugador no existe 
    
**Comportamiento esperado:** 
- Crear una partida con sus 36 bloques de colores ordenados de manera aleatoria 
- Crear las cartas de movimiento 
- Crear las cartas de figura 
- Asociar 3 cartas de movimiento a cada jugador 
- Asociar cartas figura a cada jugador (3 en la mano y el resto en el mazo) 
- Crear el orden de turnos 
- Enviar actualizaciones mediante WebSocket: 
    - Información global de la partida a todos los usuarios. 
    - Información privada a cada usuario correspondiente. 

Los tests tienen al menos un **90%** de cobertura
