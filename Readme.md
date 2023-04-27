# Kata Video Surveillance

# Requisitos

En resumen, los requisitos que debe cumplir el controlador que tenemos que diseñar son:

- Indica al grabador que detenga la grabación cuando el sensor no detecta movimiento.
- Indica al grabador que comience la grabación cuando el sensor detecta movimiento.
- Indica al grabador que detenga la grabación cuando el sensor arroja un error inesperado.
- Comprueba el estado del sensor de movimiento una vez por segundo. Para no bloquear el hilo de ejecución y poder observar cambios en la kata, se registran primero en memoria estados del sensor y luego se consultan en un rango de tiempo determinado.
