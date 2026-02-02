# GeoAR.js | REPO VIEJO DEL 2019 | AHORA SE HACE DE LA MANERA DE https://github.com/AR-js-org/AR.js

Repositorio oficial de Ar.js para geolocalización y renderizado.

El repo utiliza A-Frame y Ar.js.

Se puede apreciar una buena estabilidad de los elementos 2d o marcadores, mejor que las figuras 3d de mi repo ar.frame mas ar.js.

La mejora se debe a:

Efecto Billboard (2D vs 3D): El repositorio original usa principalmente <a-image> (imágenes 2D). Estas actúan como "billboards" que siempre miran hacia la cámara. Al no tener volumen, el "jitter" (tembleque) de rotación es invisible. En cambio, en mi modelo 3D, cualquier micro-oscilación del compás del móvil hace evidente el tembleque porque ves vibrar las caras y la perspectiva del objeto.

Filtrado de Actualizaciones: El código original de GeoAR.js solía tener una configuración predeterminada bastante agresiva para ignorar actualizaciones pequeñas del GPS. Si la nueva coordenada GPS no variaba más de "X" metros (por ejemplo, gracias a minDistance), la cámara no se movía, creando una sensación artificial de estabilidad absoluta mientras estás parado.

Peso del Renderizado: Renderizar una imagen 2D simple consume muchos menos recursos que un modelo GLTF 3D con luces y sombras. Esto mantiene los FPS (cuadros por segundo) altos y estables, haciendo que la experiencia se sienta más fluida y menos errática.

Probare en el otro con 2d o con filtrado agresivo. La clave son estos métodos que se pueden extrapolar a la última release 3.4.7 de Ar.js

1. filtro que detiene todo si la señal es mala. Si el margen de error es superior a positionMinAccuracy, el sistema simplemente deja de intentar mover la cámara.

JavaScript
_updatePosition: function () {
    // Si la precisión es peor que el límite (ej. 100m), NO actualiza
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
        // ... lógica de alerta ...
        return; 
    }
    // ... sigue el código ...
}
2. El Filtro de Movimiento Mínimo (computeDistanceMeters)
Este es el componente más "agresivo" para evitar el jitter (tembleque) mientras estás parado. Si la nueva posición detectada está a menos de minDistance metros de la anterior, el sistema devuelve un valor infinito (Number.MAX_SAFE_INTEGER), lo que efectivamente "congela" el objeto en su sitio.

JavaScript
computeDistanceMeters: function (src, dest, isPlace) {
    // ... cálculo de distancia Haversine ...
    
    // FILTRO AGRESIVO: Si la distancia es menor al mínimo configurado, ignora el movimiento
    if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
        return Number.MAX_SAFE_INTEGER;
    }
    return distance;
},
3. El Estabilizador de Orientación (_onDeviceOrientation)
Para que el objeto no vibre cuando giras el teléfono, este método ignora las lecturas de la brújula si la precisión del sensor es baja (mayor a 50 grados de error en iOS).

JavaScript
_onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
        // Solo acepta la orientación si el sensor es preciso (menos de 50)
        if (event.webkitCompassAccuracy < 50) {
            this.heading = event.webkitCompassHeading;
        }
    }
    // ...
}

<img width="1920" height="1080" alt="pc" src="https://github.com/user-attachments/assets/5892adc2-a6c7-4a72-8435-344c4a9db0c1" />

