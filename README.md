# Perfil Competencial LOMLOE · PWA (v2.2)

Aplicación web instalable (PWA) para evaluar y analizar el **perfil competencial del alumnado** a partir de los informes **NIVELES_COMPETENCIALES** exportados de **Séneca** (XML). Todo el diseño, la lógica y los estilos están incluidos **dentro de un único `index.html`** (el HTML contiene el CSS y el JavaScript).

- 🔐 **Acceso con nombre de usuario y contraseña** — sin correo electrónico (dos perfiles: **usuario** y **administrador**)
- 🏫 **Creación de cursos escolares** desde la propia app (nombre, enseñanza, año escolar, evaluación y convocatoria)
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
   - O con git: `git init && git add . && git commit -m "PWA perfil competencial v2.2" && git push`.
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

### Creación de cursos escolares y aislamiento de datos (v2.2)

El administrador puede crear cursos escolares directamente en la app, sin depender de un XML:

1. **Inicio → Nuevo curso escolar** (también en *Administración → Cursos escolares*).
2. Rellena: **nombre del grupo o unidad** (p. ej. `2º ESO B`), **enseñanza** (p. ej. `2º ESO`), **año escolar**, **evaluación** (1ª, 2ª, 3ª o Final) y **convocatoria**.
3. El curso se crea **vacío** y se sincroniza con la nube al instante. Después puedes **importar su XML de Séneca dentro de él** (se actualizará sin tocar otros cursos) o dejarlo como registro manual.

**Cómo se garantiza el aislamiento entre cursos:**

| Medida | Qué implica |
|---|---|
| **Nodo propio por curso** | Cada curso se guarda en `nivelesCompetencialesIESvdv/{centro}/grupos/{curso}`: lista de alumnos, descriptores y estadísticas viven solo dentro de su nodo. |
| **Claves únicas con sufijo** | Si dos cursos pudieran generar la misma clave (mismo nombre, año y evaluación), la app aísla el nuevo con sufijo `-2`, `-3`… comprobando también las claves ya ocupadas **en la nube**. Nunca se fusionan ni se pisan datos. |
| **Reimportación segura** | Al importar un XML, si el curso ya existe (misma unidad, año y evaluación) se **actualiza**; si la referencia coincide con **otro** curso distinto, se crea como curso nuevo aislado y la app lo avisa antes de importar. |
| **Operaciones acotadas** | Abrir, editar, exportar o eliminar solo afectan al curso activo: eliminar un curso no toca los datos de los demás (lo indica también el diálogo de confirmación). |
| **Reglas de Firebase** | Las reglas solo permiten leer/escribir dentro de `grupos/{curso}` con los perfiles correspondientes; es imposible escribir en un curso desde la ruta de otro. |
| **Copia por curso** | Botón de descarga (JSON) en cada curso: una copia de seguridad individual, restaurable desde *Ajustes → Restaurar copia*. |
| **Cambiador de curso** | El chip de la cabecera muestra siempre el curso activo y, al pulsarlo, permite cambiar de curso (cada uno con sus datos completamente separados). |

### Administrador (quien instaló la app)
- **Importar XML**: pestaña *Inicio → Importar XML* (o arrastrando el archivo). Cada unidad del XML se convierte en un curso. Todo se sube solo a la nube.
- **Crear cursos escolares**: *Inicio → Nuevo curso escolar* (vacío, con año escolar y evaluación a elegir).
- **Añadir/eliminar cursos**: *Administración → Cursos escolares* (crear, importar, abrir, copia JSON, eliminar en dispositivo y nube).
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
