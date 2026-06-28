

Métricas
Contraer vista
First Contentful Paint
2,9 s
El primer renderizado con contenido indica el momento en el que se renderiza el primer texto o la primera imagen. Más información sobre la métrica Primer renderizado con contenido
Renderizado del mayor elemento con contenido
11,5 s
El renderizado del mayor elemento con contenido indica el tiempo que se tarda en dibujar el texto o la imagen de mayor tamaño. Más información sobre la métrica Renderizado del mayor elemento con contenido
Total Blocking Time
0 ms
Suma de los periodos, en milisegundos, entre FCP y Time to Interactive cuando la duración de la tarea excede los 50 ms. Más información sobre la métrica Total Blocking Time
Cambios de diseño acumulados
0
Los cambios de diseño acumulados miden el movimiento de los elementos visibles dentro del viewport. Más información sobre la métrica Cambios de diseño acumulados
Speed Index
4,0 s
Speed Index indica la rapidez con la que se puede ver el contenido de una página. Más información sobre la métrica Speed Index


Solicitudes que bloquean el renderizado Ahorro estimado de 1160 ms
Las solicitudes están bloqueando el renderizado inicial de la página, lo que puede retrasar el LCP. Si se posponen o se insertan, estas solicitudes de red pueden salir de la ruta crítica.LCPFCPSin puntuar
URL
Tamaño de la transferencia
Duración
vercel.app Propio
14,5 KiB	330 ms
/assets/index-VDfSRtM8.css(katherinetienda.vercel.app)
14,5 KiB
330 ms
Google Fonts cdn 
1,7 KiB	780 ms
/css2?family=…(fonts.googleapis.com)

Mejorar la entrega de imágenes Ahorro estimado de 374 KiB
Si se reduce el tiempo de descarga de las imágenes, se puede mejorar el tiempo de carga percibido de la página y el LCP. Más información sobre la optimización del tamaño de las imágenesLCPFCPSin puntuar
URL
Tamaño del recurso
Ahorro estimado
vercel.app Propio
377,5 KiB	374,2 KiB
Katherine
<img alt="Katherine" class="h-8 w-auto object-contain" src="/logo.png">
/logo.png(katherinetienda.vercel.app)
377,5 KiB
374,2 KiB
Usar un formato de imagen moderno (WebP, AVIF) o aumentar la compresión de la imagen podría mejorar el tamaño de descarga de esta imagen.
327,0 KiB
Este archivo de imagen es más grande de lo necesario (1429x217) para las dimensiones mostradas (369x56). Usa imágenes adaptables para reducir el tamaño de descarga de la imagen.
352,4 KiB



Redistribución forzada
Se produce un reflow forzado cuando JavaScript consulta propiedades geométricas (como offsetWidth) después de que los estilos hayan sido invalidados por un cambio en el estado del DOM. Esto puede provocar un rendimiento deficiente. Consulta más información sobre los reflows forzados y las posibles mitigaciones.Sin puntuar
Llamada a función principal
Tiempo total de redistribución
/assets/index-pmzMZfWv.js:34:71564(katherinetienda.vercel.app)
28 ms
Fuente
Tiempo total de redistribución
/assets/index-pmzMZfWv.js:41:32327(katherinetienda.vercel.app)
28 ms
/assets/index-pmzMZfWv.js:43:19247(katherinetienda.vercel.app)
7 ms
[sin asignación]
2 ms



Desglose de LCP
Cada subparte tiene estrategias de mejora específicas. Lo ideal es que la mayor parte del tiempo de LCP se dedique a cargar los recursos, no a los retrasos.LCPSin puntuar
Subparte
Duración
Time to First Byte
0 ms
Retraso de renderizado de elementos
2960 ms
Conoce nuestros Productos.
<h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-jakarta font-medium text…" style="opacity: 1; transform: none;">

rbol de dependencia de red
Evita encadenar solicitudes críticas reduciendo la longitud de las cadenas, disminuyendo el tamaño de los recursos o posponiendo la descarga de recursos innecesarios para mejorar la carga de la página.LCPSin puntuar
Latencia de ruta crítica máxima: 2402 ms
Navegación inicial
https://katherinetienda.vercel.app - 84 ms, 1,23 KiB
/css2?family=…(fonts.googleapis.com) - 93 ms, 1,67 KiB
…v12/LDIoaomQN….woff2(fonts.gstatic.com) - 1892 ms, 27,43 KiB
…v24/pxiEyp8kv….woff2(fonts.gstatic.com) - 293 ms, 8,51 KiB
…v24/pxiByp8kv….woff2(fonts.gstatic.com) - 292 ms, 8,35 KiB
…v24/pxiByp8kv….woff2(fonts.gstatic.com) - 1891 ms, 8,60 KiB
…v24/pxiByp8kv….woff2(fonts.gstatic.com) - 293 ms, 8,46 KiB
…v24/pxiByp8kv….woff2(fonts.gstatic.com) - 1891 ms, 8,42 KiB
/assets/index-pmzMZfWv.js(katherinetienda.vercel.app) - 218 ms, 174,67 KiB
…v1/vista_cat…?select=…(gbdhgmwisaejrprmxvie.supabase.co) - 1814 ms, 1154,50 KiB
…v1/anuncios?select=id%2Ctexto%2Clink%2Cactivo&order=id.asc(gbdhgmwisaejrprmxvie.supabase.co) - 2402 ms, 1,21 KiB
/assets/index-VDfSRtM8.css(katherinetienda.vercel.app) - 173 ms, 14,52 Ki