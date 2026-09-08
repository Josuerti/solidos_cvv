# Análisis de sólidos — versión web

Calculadora educativa de volúmenes entre superficies con visualizaciones 2D y 3D y desarrollo matemático paso a paso.

## Uso

Descarga y abre `index.html` en un navegador moderno con conexión a Internet para cargar MathLive, MathJax, Math.js y Plotly. Selecciona un sólido, revisa las superficies y límites y pulsa **Calcular y Analizar**. Puedes imprimir el desarrollo desde la aplicación.

## Relación con el proyecto principal

[calculadora-volumenes-steinmetz](https://github.com/Josuerti/calculadora-volumenes-steinmetz) es el repositorio de referencia: contiene esta aplicación como `app_ucsg_final.html`, el analizador Python, documentación y generador de PDF. Este repositorio conserva una copia como `index.html` para distribución web. Al modificarla, actualiza ambas copias y comprueba que sean idénticas.

## Método y límites

Se utiliza punto medio en x y Simpson compuesto en y (200 subintervalos por dirección). Se comprueban límites y alturas en los puntos evaluados; esto no demuestra que una función arbitraria sea válida en toda la región. El resultado es aproximado y no tiene una garantía universal de error.

Los valores exactos solo se muestran cuando los campos coinciden con el ejemplo predefinido. El desarrollo se genera localmente, sin clave de API ni llamadas a un modelo de IA.

## Verificación

Con Node.js: `node tests.js`. Comprueba los cuatro ejemplos predefinidos y el rechazo de regiones inválidas.
