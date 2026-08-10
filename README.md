# Simulador Interactivo de Circuitos Mecatrónicos ⚡🤖

Aplicación web estática táctil y responsiva diseñada para que los alumnos armen, conecten y verifiquen un circuito mecatrónico completo antes de recibir los componentes físicos.

## Componentes Incluidos

1. **ESP32 DevKit** (Microcontrolador principal)
2. **Puente H L298N** (Controlador dual de motores)
3. **2x Motoreductores DC** (Motor Izquierdo y Motor Derecho)
4. **Servomotor SG90** (Dirección / Mecanismo PWM)
5. **Regulador de Voltaje Buck LM2596** (Paso de 12V a 5V regulados)
6. **Portapilas Litio 3x 18650** (~11.1V - 12V)
7. **Interruptor SPST** (Corte general de corriente)
8. **Protoboard Pequeña** (Opcional en el lienzo)

---

## 🚀 Publicación Gratuita 24/7 en GitHub Pages (Sin Servidor)

Para que los alumnos accedan a cualquier hora desde sus casas o celulares en clases sin depender de tu notebook:

1. Crea un nuevo repositorio público en tu cuenta de GitHub llamado `simulador-mecatronica`.
2. Sube el contenido de esta carpeta (`Codigos/mecatronica/simulador`) al repositorio.
3. En GitHub, ve a **Settings $\to$ Pages**.
4. En **Source**, selecciona `main` o `master` branch y guarda.
5. GitHub te entregará la URL pública HTTPS (ej. `https://tu-usuario.github.io/simulador-mecatronica`).

---

## 💡 Flujo de Trabajo Pedagógico

1. **Conexión Táctil:** El alumno abre la web en su celular o notebook y tira cables tocando los terminales de los componentes (*Tap Pin A $\to$ Tap Pin B*).
2. **Desafíos Pedagógicos en Google:** Si el alumno comete un error (ej. olvida la tierra común GND), la app no le dice *"Mueve el cable X"*, sino que le despliega un reto de búsqueda en Google (ej. *"Busca en Google: 'Por qué es obligatorio unificar las tierras GND cuando se usan dos fuentes distintas'"*) y una pista conceptual.
3. **Plano de Conexiones Oficial Descargable:** Cuando logra el circuito 100% verificado, ingresa su Nombre y RUT y descarga su **Plano Oficial con Diagrama de Conexiones (PDF/PNG)**.
4. **Firma Antifraude y QR:** El plano incluye un **Código Hash Único (ej. `VAL-8F3A-92BC-2026`)** y un código **QR de Verificación** para evitar que los alumnos editen los nombres en imágenes compartidas.
5. **Pase de Entrada:** El alumno te muestra su plano descargado para recibir su kit de componentes físicos.

---

## 🧪 Pruebas Locales (Opcional)

Si deseas probar el simulador localmente en tu equipo:
```bash
python3 server.py 8080
```
Abre en tu navegador: [http://localhost:8080](http://localhost:8080)
