# GeoAR.js | REPO VIEJO DEL 2019 | AHORA SE HACE DE LA MANERA DE https://github.com/AR-js-org/AR.js

Repositorio oficial de Ar.js para geolocalización y renderizado.

El repo utiliza A-Frame y Ar.js.

Se puede apreciar una buena estabilidad de los elementos 2d o marcadores, mejor que las figuras 3d de mi repo ar.frame mas ar.js.

La mejora se debe a:

Efecto Billboard (2D vs 3D): El repositorio original usa principalmente <a-image> (imágenes 2D). Estas actúan como "billboards" que siempre miran hacia la cámara. Al no tener volumen, el "jitter" (tembleque) de rotación es invisible. En cambio, en mi modelo 3D, cualquier micro-oscilación del compás del móvil hace evidente el tembleque porque ves vibrar las caras y la perspectiva del objeto.

Filtrado de Actualizaciones: El código original de GeoAR.js solía tener una configuración predeterminada bastante agresiva para ignorar actualizaciones pequeñas del GPS. Si la nueva coordenada GPS no variaba más de "X" metros (por ejemplo, gracias a minDistance), la cámara no se movía, creando una sensación artificial de estabilidad absoluta mientras estás parado.

Peso del Renderizado: Renderizar una imagen 2D simple consume muchos menos recursos que un modelo GLTF 3D con luces y sombras. Esto mantiene los FPS (cuadros por segundo) altos y estables, haciendo que la experiencia se sienta más fluida y menos errática.

Probare en el otro con 2d o con filtrado agresivo.

<img width="1920" height="1080" alt="pc" src="https://github.com/user-attachments/assets/5892adc2-a6c7-4a72-8435-344c4a9db0c1" />

