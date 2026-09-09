# Perfil Competencial LOMLOE · PWA (v2.8)

Aplicación web instalable (PWA) para evaluar y analizar el **perfil competencial del alumnado** a partir de los informes **NIVELES_COMPETENCIALES** exportados de **Séneca** (XML). Todo el diseño, la lógica y los estilos están incluidos **dentro de un único `index.html`** (el HTML contiene el CSS y el JavaScript).

- 📂 **Secciones tipo acordeón en todas las pantallas (v2.8)** — Inicio, Resumen, Por competencia, Ficha del alumno, Estadísticas, Cursos escolares, Administración y Ajustes organizan su contenido en **acordeones desplegables**: llegan **inicialmente plegados** (una vista limpia de títulos y resúmenes) y solo puede haber **uno desplegado a la vez en cada pantalla**; funcionan con clic y con teclado (Enter/Espacio), y al recargar la app vuelven a quedar todos plegados
- 🔐 **Acceso con nombre de usuario y contraseña** — sin correo electrónico (dos perfiles: **usuario** y **administrador**)
- 🏫 **Sección «Cursos escolares» en el menú lateral (v2.7)** — toda la gestión de cursos reunida en su propia pantalla, con terminología clara: **curso escolar** = un año completo (p. ej. `2025/2026`); **grupo** = una unidad dentro del curso (p. ej. `1º A`)
- 🗑️ **Eliminar curso escolar completo (v2.7)** — borra un curso escolar **con todos sus grupos, alumnos y niveles**, avisando del peligro y pidiendo **escribir el año de inicio** (p. ej. `2025`) como confirmación; los cursos **archivados** siguen protegidos (hay que desarchivarlos primero)
- ☑️ **Eliminar grupos uno a uno o masivamente (v2.7)** — casillas de selección por curso escolar, «marcar todos», contador y confirmación expresa antes de borrar
- 1️⃣ **Primer curso del centro: 2025/2026 (v2.7)** — si no hay ningún curso, la app lo propone por defecto y se sitúa en él automáticamente
- 🗂️ **Aislamiento por curso en pantalla (v2.6)** — la app trabaja siempre **dentro de un solo curso escolar**: Inicio muestra únicamente SUS grupos, y el chip de la cabecera (curso escolar · grupo) abre un cambiador en dos pasos (curso → grupo)
- 🏫 **Creación de cursos escolares sencilla (v2.6)** — «Nuevo curso escolar» pide **solo el año escolar**; el curso nace vacío y aislado y sus **grupos se crean solos al importar el XML** de Séneca o al transferir datos de un curso adyacente (ya no se pide ningún dato de grupo al crear el curso)
- 🔁 **Cursos sucesivos: «Generar próximo año»** — con un clic se crean los cursos del año escolar siguiente (vacíos y aislados), copiando la estructura de los actuales; también se puede duplicar curso por curso
- ⏪ **Cursos anteriores al presente** — el **año escolar** es un selector nativo con cualquier curso (p. ej. `2025/2026 — anterior`), con vista previa del estado (ANTERIOR / VIGENTE / FUTURO) y atajos «Curso anterior»
- 📥 **¿Tienes datos de un curso anterior (p. ej. 2025/2026)?** — importa el XML directamente: el curso se crea solo con el año que trae el informe, aunque ya haya pasado (v2.5)
- ↔️ **Transferencia de datos entre cursos adyacentes** (años escolares consecutivos), en modo *copiar* o *mover*, con confirmación de sobrescritura
- 🗄️ **Archivar cursos** — un curso archivado queda protegido contra borrado y en modo lectura; se puede desarchivar cuando se quiera
- 🛡️ **Borrados con protección (v2.7)** — el borrado de un curso escolar completo (o de grupos sueltos) exige confirmación expresa; el diálogo advierte del peligro, muestra cuántos grupos y alumnos se perderán y, si el curso es el **VIGENTE** (1 sep – 31 ago), añade un aviso extra en rojo. Los **archivados** no se pueden borrar sin desarchivarlos antes
- 🗂️ **Datos aislados por curso**: cada curso vive en su propio compartimento en el dispositivo y en la nube; los datos de un curso **nunca** se mezclan con los de otro
- ☁️ **Sincronización automática** con Firebase Realtime Database tras cualquier cambio, con cola offline
- 📊 Matriz clicable alumno × competencia, análisis por competencia, ficha individual con navegación, estadísticas y **exportación a PDF**
- 📴 Funciona **sin conexión** (Service Worker + copia local en el dispositivo)
- 📱 Instalable en escritorio, tablet y móvil (GitHub Pages + manifest + Service Worker)

---

## 1. Contenido de esta carpeta

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | **La aplicación completa** (HTML + CSS + JS en un solo archivo) |
| `manifest.json` | Manifiesto PWA (nombre, iconos, instalación) |
| `sw.js` | Service Worker: caché offline de la aplicación |
| `icons/` | Iconos de la PWA (192, 512, maskable, apple-touch, favicon) |
| `database.rules.json` | Reglas de seguridad de Firebase Realtime Database (por roles) |
| `.nojekyll` | Evita que GitHub Pages procese el sitio con Jekyll |
| `README.md` | Esta guía |

> Sube **todos** los archivos respetando la carpeta `icons/`.

---

## 2. Preparar Firebase (una sola vez)

La aplicación usa tu proyecto Firebase (`iesvdv-96a18`) con **Realtime Database** y el proveedor de autenticación **Correo electrónico/contraseña** (internamente la app registra cada profesor con un identificador técnico `usuario@acceso.perfilcomp.interno`; **nadie usa ni recibe correos reales**).

En [Firebase Console](https://console.firebase.google.com/) → proyecto `iesvdv-96a18`:

1. **Authentication → Sign-in method → habilita «Correo electrónico/contraseña»** (imprescindible aunque el acceso sea con usuario; si no, el inicio de sesión devolverá error de operación no permitida).
2. **Authentication → Settings → Authorized domains → añade tu dominio de GitHub Pages**, por ejemplo `tuusuario.github.io` (y `localhost` si vas a probar en local).
3. **Realtime Database → Reglas → pega el contenido completo de `database.rules.json` → Publicar.**
   - Estas reglas bloquean el acceso fuera de `nivelesCompetencialesIESvdv`, aislan la app de otras y aplican los perfiles: **usuario** = leer, **administrador** = leer y escribir.
   - ⚠️ Si no las publicas, la base de datos queda con las reglas que tuviera y el control de roles no funcionará.

> 📌 **Nota sobre contraseñas:** para poder restablecerlas desde la aplicación (sin correos), cada perfil guarda una copia de la contraseña en `nivelesCompetencialesIESvdv/users/{uid}/password`. Las reglas solo permiten leer esa lista a los **administradores**. Si prefieres no guardarlas, las contraseñas solo podrían cambiarse desde Firebase Console.

---

## 3. Desplegar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `perfil-competencial`), puede ser público o privado.
2. Sube **todo el contenido de esta carpeta** a la rama principal (`main`): `index.html`, `manifest.json`, `sw.js`, la carpeta `icons/`, `database.rules.json`, `.nojekyll` y este `README.md`.
   - Desde la web: *Add file → Upload files* (arrarra también la carpeta de iconos).
   - O con git: `git init && git add . && git commit -m "PWA perfil competencial v2.8" && git push`.
3. En el repositorio: **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch** → Branch: **main** / **/(root)** → *Save*.
4. Espera 1-2 minutos. Tu aplicación estará en:
   `https://TUUSUARIO.github.io/NOMBRE-DEL-REPO/`
5. Recuerda el paso 2 de la sección anterior: ese dominio debe estar en *Authorized domains* de Firebase.

Para actualizar la aplicación basta con subir el nuevo `index.html` (sube también `sw.js` si cambió): los dispositivos lo detectarán y recargarán solos.

---

## 4. Primer acceso: crear al administrador o administradora

1. Abre la URL de la aplicación.
2. En la pantalla de acceso, pulsa la pestaña **«Primer acceso»**.
3. Escribe nombre y apellidos, un nombre de usuario (3-20 caracteres: letras, números, `.`, `-`, `_`; sin espacios ni acentos) y una contraseña (mínimo 6 caracteres).
4. Esa primera cuenta queda **automáticamente como administradora**.

> El formulario de «Primer acceso» **deja de funcionar en cuanto existe una cuenta**: es una protección para que nadie más pueda auto-crearse una cuenta de administrador. El resto de cuentas se crean desde dentro de la aplicación.

---

## 5. Uso diario

### Secciones tipo acordeón (v2.8)

Todas las pantallas organizan su contenido en **acordeones desplegables**:

- **Inicialmente todo plegado**: al entrar en cualquier pantalla solo se ven las cabeceras de las secciones, con su título, un resumen corto y los datos clave (medias, nº de alumnos, estado…). La pantalla se lee de un vistazo y cada cual despliega lo que necesita.
- **Una sola sección abierta por pantalla**: al desplegar una sección se pliega automáticamente la que estuviera abierta. Para volver a plegarla, pulsa de nuevo su cabecera.
- **Qué es una sección en cada pantalla**: *Inicio* → cada grupo del curso (sus datos y acciones se despliegan al pulsar); *Resumen* → «Matriz de competencias» y «Leyenda de niveles»; *Por competencia* → una sección por competencia (8); *Ficha del alumno* → «Perfil competencial» (radar) y una por competencia; *Estadísticas* → Indicadores clave, Radar, Media por competencia, Distribución de niveles y Resumen cuantitativo; *Cursos escolares* → una sección por curso escolar (con «Trabajar aquí» y la papelera siempre visibles en su cabecera); *Administración* y *Ajustes* → una sección por bloque.
- **Detalles prácticos**: el buscador de la matriz, los borrados y los diálogos funcionan igual que antes; el estado de la sección abierta se mantiene mientras navegas dentro de la misma pantalla (p. ej. al cambiar de alumno o filtrar) y al **recargar la app todo vuelve a estar plegado**. Las cabeceras también responden a **Enter y Espacio**.

### Sección «Cursos escolares» del menú lateral (v2.7)

Todo lo relacionado con cursos escolares está reunido en una sección propia del menú (visible para administradores):

- **Terminología sin confusiones**: un **curso escolar** es un año completo (`2025/2026`); un **grupo** es una unidad de ese curso (`1º A`). La cabecera de cada sección dice «Curso escolar 2025/2026» y su tabla lista SUS grupos.
- **Un bloque por curso escolar** (ordenados de más antiguo a más reciente) con su etiqueta de estado (ANTERIOR / VIGENTE / FUTURO), el número de grupos y alumnos, y el distintivo **EN PANTALLA** en el curso activo; con **«Trabajar aquí»** cambias de curso con un clic.
- **Acciones por grupo** en cada fila: abrir, transferir a curso adyacente, generar para el año siguiente, copia JSON, archivar/desarchivar y **eliminar**.
- **Eliminar grupos masivamente**: marca con las casillas (o «marcar todos»), pulsa **Eliminar seleccionados (N)**, revisa el resumen y **confirma expresamente** que quieres borrar los datos de los alumnos.
- **Eliminar un curso escolar completo**: papelera de la cabecera del curso → diálogo rojo de **aviso de peligro** (cuántos grupos y alumnos se borrarán, dispositivo **y nube**, irreversible) → hay que **escribir el año de inicio** (p. ej. `2025`) para activar el botón. Si el curso está VIGENTE se avisa con otra caja roja; si tiene grupos **archivados**, el borrado está bloqueado hasta desarchivarlos.
- **Primer curso del centro**: si aún no existe ningún curso, la app propone directamente crear **2025/2026** (el curso de los datos iniciales) y, tras borrar o al empezar de cero, se sitúa sola en él.

> **Ojo**: eliminar un curso escolar borra TODOS sus grupos y alumnos de este dispositivo y de la nube (Firebase), y los demás dispositivos también lo perderán. No se puede deshacer. Si quieres conservar una copia, exporta antes los grupos (botón ⬇ de cada grupo).

### Aislamiento por curso en pantalla y creación de cursos (v2.6)

**Un solo curso en pantalla.** La app ya no muestra todos los cursos a la vez. Ahora trabaja siempre dentro de un **curso escolar activo**:

- **Inicio** muestra la cabecera «Curso {año}» con su etiqueta de estado (ANTERIOR / VIGENTE / FUTURO / ARCHIVADO) y **únicamente los grupos de ese curso**.
- El **selector de curso** (desplegable junto a los botones de Inicio) cambia de un curso a otro al instante; el chip de la cabecera indica en todo momento «Curso {año} · Grupo».
- Al pulsar el chip se abre el **cambiador en dos pasos**: primero eliges el **curso escolar** (con el número de grupos y alumnos de cada uno) y después un **grupo** concreto; también puedes entrar en un curso vacío con «Ir a este curso».
- Las vistas (Resumen, Por competencia, Alumno, Estadísticas) siempre usan un grupo **del curso activo**: si el curso no tiene grupos todavía, se muestra una pantalla que lo explica en lugar de datos de otro curso.
- Al **importar un XML**, la app salta automáticamente al curso del informe importado.

**Crear un curso escolar es ahora un paso.** *Inicio → Nuevo curso escolar* pide **solo el año escolar** (selector con anteriores, vigente y futuros, más «Otro año…» y los atajos «Curso anterior» / «Vigente»):

1. Elige el año y pulsa **Crear curso**: nace un curso **vacío y aislado**, sincronizado con la nube.
2. Sus **grupos no se crean a mano**: aparecen al **importar su XML de Séneca** (cada unidad del informe) o al **transferir datos desde un curso adyacente**.
3. Mientras el curso está vacío, Inicio muestra una pantalla que lo indica con el botón de importación. En *Cursos escolares* los cursos vacíos se ven en su bloque con su papelera (elimina el curso completo con confirmación escribiendo el año).

**Cómo se garantiza el aislamiento entre cursos:**

| Medida | Qué implica |
|---|---|
| **Curso activo en pantalla** | Inicio, las vistas y las estadísticas solo muestran datos del curso escolar activo; el resto de cursos quedan fuera de la pantalla hasta que los selecciones. |
| **Nodo propio por curso** | Cada curso se guarda en `nivelesCompetencialesIESvdv/{centro}/grupos/{curso}`, y el registro de cursos creados vacíos en `…/{centro}/cursos/{año}`: los datos viven solo dentro de su nodo. |
| **Claves únicas con sufijo** | Si dos cursos pudieran generar la misma clave (mismo nombre, año y evaluación), la app aísla el nuevo con sufijo `-2`, `-3`… comprobando también las claves ya ocupadas **en la nube**. Nunca se fusionan ni se pisan datos. |
| **Reimportación segura** | Al importar un XML, si el curso ya existe (misma unidad, año y evaluación) se **actualiza**; si la referencia coincide con **otro** curso distinto, se crea como curso nuevo aislado y la app lo avisa antes de importar. |
| **Operaciones acotadas** | Abrir, exportar o eliminar solo afecta al curso activo: eliminar un curso no toca los datos de los demás (lo indica también el diálogo de confirmación). |
| **Reglas de Firebase** | Las reglas solo permiten leer/escribir dentro de `grupos/{curso}` y `cursos/{año}` con los perfiles correspondientes; es imposible escribir en un curso desde la ruta de otro. |
| **Copia por curso** | Botón de descarga (JSON) en cada curso: una copia de seguridad individual, restaurable desde *Ajustes → Restaurar copia*. |
| **Administración por años** | La tabla de *Administración* agrupa los cursos por año escolar, con una fila por curso vacío. |

### Generación de cursos sucesivos: «Generar próximo año» (v2.3)

Para pasar de curso escolar no hace falta recrear nada a mano. El administrador dispone de tres atajos:

1. **Generar el próximo año de golpe**: botón **Administración → Cursos escolares → Generar próximo año**.
   - Se elige el **año de origen** (p. ej. `2025/2026`) y el **año nuevo** (sugerido automáticamente: `2026/2027`; también se puede escribir cualquier otro).
   - Aparece la lista de cursos de ese año con una casilla por curso y el aviso **SE CREARÁ** o **YA EXISTE** en el año destino.
   - Al pulsar **Generar cursos** se crean de una vez, **vacíos** (sin alumnos ni notas), con la misma estructura: grupo, enseñanza, evaluación y convocatoria. La app salta al curso nuevo creado.
2. **Duplicar un solo curso para el año siguiente**: botón 📄 (dos hojas) en la tarjeta de cada curso en *Inicio* y en la tabla de *Administración*. Pregunta confirmación y crea ese curso concreto para el año siguiente.
3. **Nuevo curso escolar** (uno a uno): pide **solo el año escolar** — selector nativo (fiable en móvil) con cualquier año (también anteriores al presente, p. ej. `2023/2024`) más la opción **«Otro año…»**, y muestra en vivo si el año será ANTERIOR, VIGENTE o FUTURO. Los grupos del curso nacen al importar su XML o transferir datos.

### ¿Tienes datos de un curso anterior? (p. ej. 2025/2026) — v2.5

Sí puedes. Tres caminos, todos con aislamiento garantizado:

1. **Importar el XML directamente (el más rápido).** Pulsa *Inicio → Importar XML* y carga el informe de Séneca del curso 2025/2026: la app lee el **año que trae el propio informe** (campo `C_ANNO`) y crea —o actualiza— ese curso automáticamente, aunque sea anterior al vigente. En el diálogo de confirmación verás la etiqueta **ANTERIOR** junto al curso que se va a crear.
2. **Crear el curso a mano y luego importar dentro de él.** *Inicio → Nuevo curso escolar*: pide **solo el año escolar**, con **selector nativo** (funciona bien en móvil) de todos los cursos anteriores (p. ej. `2025/2026 — anterior`), el vigente, los futuros y la opción **«Otro año…»** para escribir cualquier año (1990–2100). Incluye los atajos **«Curso anterior (…)»** y **«Vigente (…)»** en el propio diálogo. Después pulsa **Importar XML** dentro de ese curso: si el grupo coincide (misma unidad, año y evaluación) se **actualiza** ese curso; si es otro grupo, se crea como curso nuevo aislado.
3. **Transferirlos desde un curso adyacente.** Si los datos ya están en otro curso (p. ej. 2024/2025), usa el botón de transferencia (↔) de ese curso para **copiarlos o moverlos** al adyacente 2025/2026 — los datos solo se transfieren entre años escolares consecutivos.

Los cursos anteriores aparecen con la etiqueta **ANTERIOR**; si quieres blindarlos, **archívalos** (quedan protegidos contra borrado y en modo lectura). Y recuerda: el curso **VIGENTE** (el que está en marcha, 1 sep – 31 ago) nunca se puede borrar.

### Cursos anteriores, transferencias, archivo y curso vigente (v2.4)

**Cursos de años anteriores.** En *Nuevo curso escolar* elige directamente el año deseado (`2023/2024`, `2024/2025`…) en el **selector de años** —o pulsa los atajos **Curso anterior** / **Vigente**—. Cada curso anterior se crea vacío y aislado, igual que los demás, y aparece con la etiqueta **ANTERIOR** en Inicio, en el cambiador de curso y en Administración.

**Transferir datos entre cursos adyacentes.** El botón de flechas cruzadas (↔) de cada curso — en la tarjeta de *Inicio* y en la tabla de *Administración* — abre el diálogo **«Transferir datos a un curso adyacente»**:
- Solo se ofrecen como destino los cursos de los **años escolares consecutivos** (el anterior y el siguiente del curso origen): *los datos solo se mueven entre cursos adyacentes*.
- Dos modos: **Copiar** (el origen conserva sus datos) o **Mover** (el origen queda vacío). El destino registra `recibidoDe` la clave del curso origen.
- Si el destino ya tenía alumnos, hay que marcar expresamente la casilla **«Sobrescribir el destino»**.
- Si aún no existe ningún curso en los años adyacentes, el mismo diálogo ofrece **«Crear curso en {año}»**: crea el curso con la misma estructura (vacío y aislado) y le copia los datos al momento.
- Los cursos **archivados** no pueden recibir ni enviar transferencias (primero hay que desarchivarlos).

**Archivar un curso.** El botón del archivador (🗄) en cada curso lo marca como **ARCHIVADO**:
- Queda **protegido contra borrado** (ni en el dispositivo ni en la nube) y pasa a **modo lectura**: no admite importaciones que lo actualicen ni transferencias.
- Se muestra con estilo atenuado y la etiqueta ARCHIVADO · solo lectura en todas las pantallas, incluido un aviso al abrirlo.
- Se puede **desarchivar** en cualquier momento con el mismo botón.

**El curso vigente se borra solo con confirmación expresa (v2.7).** La app calcula el curso escolar en marcha con la fecha real (un curso va del **1 de septiembre de un año al 31 de agosto del siguiente**) y lo marca **VIGENTE**. Desde la v2.7 cualquier curso escolar puede eliminarse (papelera del bloque en *Cursos escolares*), pero siempre pasando por el aviso de peligro y escribiendo su año de inicio; si el curso es el vigente, se muestra además una advertencia roja adicional. Para blindar un curso contra borrados, **archívalo**: los archivados no se pueden eliminar (ni sus grupos) hasta desarchivarlos.

**Qué se copia y qué no:** la estructura (grupo, enseñanza, evaluación y convocatoria) sí; **los alumnos y sus resultados NO** — entran después importando el XML de Séneca del nuevo año **dentro de cada curso nuevo**. Los cursos de años anteriores quedan **intactos** como historial consultable, y cada curso nuevo se registra en su propio nodo de la nube (con su año en la clave), de modo que los datos de un año y de otro nunca se mezclan. Si en el año destino ya existiera un curso con la misma estructura, la app lo detecta, lo marca **YA EXISTE** y no crea duplicados.

### Administrador (quien instaló la app)
- **Importar XML**: pestaña *Inicio → Importar XML* (o arrastrando el archivo). Cada unidad del XML se convierte en un curso. Todo se sube solo a la nube.
- **Crear cursos escolares**: *Inicio → Nuevo curso escolar* (vacío, con año escolar y evaluación a elegir).
- **Generar los cursos del año siguiente**: *Inicio → Generar próximo año* (crea de golpe, vacíos y aislados, los cursos sucesivos del nuevo año escolar).
- **Añadir/eliminar cursos y grupos**: sección **«Cursos escolares»** del menú lateral (crear, generar próximo año, importar, abrir, transferir a curso adyacente, duplicar para el año siguiente, archivar/desarchivar, copia JSON, eliminar grupos **uno a uno o masivamente** y eliminar cursos escolares completos — con aviso de peligro y confirmación escribiendo el año; los archivados protegidos).
- **Crear usuarios**: *Administración → Usuarios → Añadir usuario nuevo*: nombre, **nombre de usuario**, contraseña inicial y perfil (`usuario` o `administrador`). Comunica a cada persona su usuario y contraseña.
- **Restablecer una contraseña** 🔑: botón de la llave en la fila del usuario (no se envía ningún correo).
- **Desactivar / reactivar el acceso**: botón ✕ / ✓ (el perfil y sus datos se conservan).
- **Eliminar perfil**: papelera (la cuenta técnica sigue existiendo en Firebase Authentication; se puede borrar desde la consola si hace falta).

### Usuario (profesorado de consulta)
- Ve la **matriz** de cada grupo, pulsa cualquier celda para ver sus descriptores, revisa la ficha de cada alumno (con navegación anterior/siguiente), consulta las estadísticas y exporta PDFs.
- Puede **descargar los grupos desde la nube** en cualquier dispositivo con *Inicio → Actualizar desde la nube*.
- No puede importar, crear ni eliminar nada: los botones de gestión ni siquiera aparecen.

### Sincronización automática
- Cualquier cambio (importar, crear, eliminar, restaurar copia) se envía **solo** a Firebase; el punto superior derecho muestra el estado: *Sincronizando… / Nube sincronizada / X pendientes*.
- **Sin conexión**: la app sigue funcionando con la copia local; los cambios se encolan y se envían al reconectar.

### Instalación como app (PWA)
- Escritorio/Android: botón de instalación (o menú del navegador → *Instalar app*).
- iPhone/iPad: *Compartir → Añadir a pantalla de inicio*.

---

## 6. Problemas frecuentes

| Síntoma | Causa probable / solución |
|---|---|
| «Permission denied» al entrar o cargar | No se publicaron las reglas: pega `database.rules.json` en *Realtime Database → Reglas*. |
| «Operation not allowed» al crear la primera cuenta | El proveedor **Correo electrónico/contraseña** no está habilitado en *Authentication → Sign-in method*. |
| «auth/unauthorized-domain» o error de dominio | Falta añadir `tuusuario.github.io` en *Authentication → Settings → Authorized domains*. |
| «Ese nombre de usuario ya está en uso» | Ya existe una cuenta con ese usuario; elige otro o entra directamente. |
| No aparecen grupos en otro dispositivo | Pulsa *Inicio → Actualizar desde la nube* (la descarga es manual a propósito: cada dispositivo elige cuándo). |
| «No se pudo verificar la cuenta con la contraseña almacenada» al restablecer | Alguien cambió la contraseña por fuera de la app. Elimina ese usuario y créalo de nuevo. |
| La app no se actualiza tras subir cambios | Espera unos segundos y recarga; el Service Worker aplica la versión nueva automáticamente. |

---

## 7. Seguridad y privacidad, en resumen

- La base de datos solo acepta lecturas/escrituras de **cuentas autenticadas con perfil activo**, dentro del nodo exclusivo `nivelesCompetencialesIESvdv`.
- Los perfiles `usuario` **no pueden escribir** nada (lo impiden las reglas, no solo la interfaz).
- Los **nombres reales del alumnado** nunca salen del nodo de la aplicación y viajan siempre por HTTPS.
- Solo los administradores pueden ver la lista de usuarios (y la copia de su contraseña, necesaria para el mecanismo de restablecimiento sin correo).
