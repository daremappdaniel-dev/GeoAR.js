# Pull Request: Estabilizar cámara y reducir temblor

**Título:** feat(mobile): estabilizar cámara y reducir temblor

**Descripción:**
Este PR introduce mejoras significativas en la estabilidad de la proyección AR para resolver el problema de "jitter" reportado en dispositivos móviles.

**Cambios realizados:**

- **Algoritmo de Suavizado:** Se ha implementado un factor de interpolación en la actualización de coordenadas GPS para evitar saltos bruscos.
- **Configuración de Umbral:** Ajustado el umbral de movimiento mínimo para que pequeños errores de GPS no muevan la cámara.
- **Optimización:** Reducción de llamadas innecesarias al render loop cuando no hay cambios significativos de posición.

**Issue relacionado:**
Closes #15

**Cómo probar:**

1. Desplegar la rama en un entorno HTTPS seguro.
2. Abrir en móvil.
3. Verificar que los objetos lejanos ya no "vibran" intensamente.

**Lista de verificación:**

- [x] El código sigue las guías de estilo.
- [x] Probado en Android (Chrome).
- [ ] Probado en iOS (Safari).
