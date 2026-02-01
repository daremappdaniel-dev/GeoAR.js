# Issue: Temblor inestable en la cámara en dispositivos móviles

**Título:** Temblor inestable en la cámara en dispositivos móviles

**Descripción:**
Se ha detectado un comportamiento inestable ("jitter") significativo en la posición de los objetos AR cuando se utiliza la aplicación en navegadores móviles. Los elementos virtuales oscilan erráticamente incluso cuando el dispositivo se mantiene relativamente estático.

**Pasos para reproducir:**

1. Abrir la aplicación demo en un dispositivo móvil (Android/iOS) usando Chrome o Safari.
2. Permitir el acceso a la cámara y ubicación.
3. Observar cualquier objeto anclado en geolocalización (geo-ar).
4. Moverse ligeramente o girar el dispositivo.

**Comportamiento esperado:**
Los objetos AR deberían permanecer anclados en su posición geográfica con transiciones suaves, filtrando el ruido del GPS y la brújula.

**Comportamiento actual:**
Los objetos saltan de posición bruscamente, haciendo difícil la interacción.

**Entorno:**

- SO: Android 12 / iOS 15
- Navegador: Chrome / Safari
- Red: 4G/WiFi

**Posible solución técnica:**
Implementar un filtro de media móvil (moving average) o filtro de Kalman simple para suavizar las lecturas de latitud/longitud y orientación antes de actualizar la posición de la cámara Three.js.
