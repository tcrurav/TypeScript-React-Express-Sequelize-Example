# Construcción del frontend de bicicletas paso a paso

[Volver al README](../README.md)

Esta práctica está dirigida a alumnado de DSW del Ciclo Superior de Desarrollo de Aplicaciones Web. Construiremos una interfaz que consume la API de bicicletas del proyecto y permite consultar, crear, modificar y eliminar registros: un CRUD completo.

La explicación sigue la implementación de este repositorio. Los enlaces llevan a los archivos completos para que puedas consultar el código mientras avanzas. Los fragmentos del documento explican las partes principales; no sustituyen siempre al archivo completo.

Los nombres de archivos, componentes, funciones y variables se escriben en inglés. Las etiquetas, botones y mensajes que ve la persona usuaria se escriben en español.

## 1. Comprender qué hace cada parte

En DSW has trabajado con peticiones HTTP, rutas y acceso a datos. Aquí construirás el cliente que utiliza esas rutas desde el navegador.

```text
Persona usuaria
    ↓ interacción
Componentes de React
    ↓ callbacks
Página y hook useBicycles
    ↓ llamadas a funciones
bicycleService → apiFetch → API Express → Sequelize → MySQL
    ↑ respuestas JSON
Estado de React → actualización de la interfaz
```

El navegador no se conecta directamente a MySQL. Envía peticiones a Express; el backend consulta o modifica la base de datos y devuelve una respuesta. React actualiza la pantalla cuando cambia su estado, sin necesitar una recarga completa de la página.

Las herramientas tienen responsabilidades diferentes:

| Herramienta | Responsabilidad en este proyecto |
| --- | --- |
| React | Construir la interfaz mediante componentes y estado |
| TypeScript | Comprobar los tipos durante el desarrollo |
| Vite | Servir el frontend en desarrollo y generar la distribución |
| Tailwind CSS | Dar estilos y adaptar la distribución al ancho disponible |
| Fetch | Realizar peticiones HTTP desde el navegador |
| Oxlint | Detectar problemas de código mediante análisis estático |

**Comprueba:** debes poder explicar por qué el frontend necesita la URL de la API, pero no las credenciales de MySQL.

## 2. Preparar el entorno y arrancar el proyecto

Necesitas Node.js y npm compatibles con las dependencias del [package.json](../package.json), un editor y un navegador con herramientas de desarrollo. El backend debe tener su base de datos configurada y estar en ejecución para probar el CRUD.

Si ya tienes este repositorio, desde su carpeta raíz ejecuta:

```sh
cd frontend
npm ci
npm run dev
```

`npm ci` instala las versiones registradas en `package-lock.json`. Abre la dirección que indique Vite en la terminal. Si estás en PowerShell y se bloquea `npm.ps1` por la política de ejecución, utiliza `npm.cmd ci` y `npm.cmd run dev`.

Si vas a reconstruirlo como ejercicio, trabaja en otra carpeta vacía para no sobrescribir este frontend. Puedes crear el proyecto base manualmente:

1. Crea una carpeta `frontend` y entra en ella.
2. Copia el contenido del `package.json` del proyecto de referencia y ejecuta `npm install`. Para reproducir exactamente sus dependencias, copia también `package-lock.json` y utiliza `npm ci`.
3. Crea `index.html` con un elemento `<div id="root"></div>` y un script de tipo módulo que cargue `/src/main.tsx`, como en el [archivo de referencia](../index.html).
4. Copia las configuraciones [tsconfig.json](../tsconfig.json), [tsconfig.app.json](../tsconfig.app.json), [tsconfig.node.json](../tsconfig.node.json) y [.oxlintrc.json](../.oxlintrc.json). Así partes de la misma configuración de TypeScript y del linter.
5. Crea los archivos de entrada y la configuración de estilos del siguiente paso.

No necesitas instalar Axios: esta aplicación utiliza `fetch`.

## 3. Configurar React, Vite y Tailwind

En [vite.config.ts](../vite.config.ts), registra los plugins de React y Tailwind:

```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
})
```

Crea `src/styles/global.css`:

```css
@import "tailwindcss";
```

En [src/main.tsx](../src/main.tsx), importa ese CSS y monta `<App />` en el elemento `root`. Este archivo es el punto de entrada de React. El operador `!` de `getElementById('root')!` indica a TypeScript que damos por hecho que el elemento existe; por eso debe estar realmente en el HTML.

Durante los primeros pasos, `App.tsx` puede devolver un título sencillo. Al completar la página lo sustituiremos por `<BicyclesPage />`.

El proyecto utiliza `StrictMode`. En desarrollo puede repetir la ejecución inicial de efectos para detectar problemas; no debes interpretar automáticamente dos peticiones iniciales como dos acciones realizadas por el usuario.

**Comprueba:** un elemento con `className="text-3xl font-bold"` debe aparecer grande y en negrita. En JSX se escribe `className`, no `class`.

## 4. Configurar la conexión con la API

Crea `frontend/.env.local` con la URL de tu backend. Por ejemplo, si escucha en el puerto 3000:

```dotenv
VITE_API_URL=http://localhost:3000
```

Es un ejemplo: utiliza el puerto que muestre el backend al arrancar. No añadas `/bicycles` ni una barra final, porque el servicio añadirá la ruta. Reinicia Vite si cambias esta variable.

El código la lee con `import.meta.env.VITE_API_URL`. Las variables que se exponen al frontend son visibles en el navegador: no guardes contraseñas ni secretos en ellas. `.env.local` queda excluido por la regla `*.local` del `.gitignore` del frontend.

Con MySQL y el backend ya configurados, arranca el servidor desde otra terminal situada en la raíz del repositorio:

```sh
cd backend
npm ci
npm run dev
```

Estas son las rutas disponibles en el backend de este proyecto:

| Operación | Método y ruta | Respuesta esperada |
| --- | --- | --- |
| Listar | `GET /bicycles` | Array de bicicletas |
| Consultar una | `GET /bicycles/:id` | Una bicicleta |
| Crear | `POST /bicycles` | Bicicleta creada, estado 201 |
| Actualizar | `PUT /bicycles/:id` | Bicicleta actualizada |
| Eliminar | `DELETE /bicycles/:id` | Estado 204 sin cuerpo |

El backend ya utiliza el middleware `cors()`, necesario para permitir las peticiones entre los orígenes de desarrollo del frontend y la API.

**Comprueba:** abre `/bicycles` en la dirección de tu API y verifica que devuelve JSON antes de continuar.

## 5. Organizar los archivos por funcionalidad

Crea esta estructura conforme avances:

```text
src/
├── main.tsx
├── App.tsx
├── styles/global.css
├── services/api.ts
├── components/ui/
│   └── Button.tsx
└── features/bicycles/
    ├── types/bicycle.ts
    ├── services/bicycleService.ts
    ├── hooks/useBicycles.ts
    ├── pages/BicyclesPage.tsx
    └── components/
        ├── BicycleList.tsx
        ├── BicycleRow.tsx
        ├── BicycleFormFields.tsx
        ├── BicycleForm.tsx
        ├── BicycleModal.tsx
        └── BicycleDeleteModal.tsx
```

`features/bicycles` reúne todo lo específico de bicicletas. `components/ui` contiene elementos reutilizables y `services/api.ts` concentra el transporte HTTP. También existe un componente genérico `Modal.tsx` en el repositorio, pero los modales actuales de bicicletas utilizan directamente `<dialog>` y no dependen de él.

Esta separación permite cambiar el aspecto del listado sin modificar las peticiones, o cambiar la dirección de la API sin editar cada componente.

## 6. Definir los tipos de datos

Crea [types/bicycle.ts](../src/features/bicycles/types/bicycle.ts) con dos interfaces:

```ts
export interface Bicycle {
    id: number
    brand: string
    model: string
    description: string | null
    price: number | string
    stock: number
    createdAt?: string
    updatedAt?: string
}

export interface BicyclePayload {
    brand: string
    model: string
    description: string | null
    price: number
    stock: number
}
```

`Bicycle` representa lo que recibes del servidor. `BicyclePayload` representa lo que envías para crear o actualizar; no incluye el identificador ni las fechas, que gestiona el backend.

El precio recibido admite `number | string` porque un decimal de base de datos puede llegar serializado como texto. Para mostrarlo se utiliza `Number(bicycle.price).toFixed(2)`.

Una interfaz de TypeScript no valida el JSON recibido durante la ejecución: ayuda al compilador y al editor, pero no sustituye la validación del servidor.

## 7. Crear la función común para peticiones HTTP

Implementa [services/api.ts](../src/services/api.ts). Su función `apiFetch<T>` debe:

1. Concatenar la URL base y la ruta solicitada.
2. Llamar a `fetch` con las opciones y el encabezado JSON.
3. Comprobar `response.ok` y lanzar un error si el estado HTTP indica un fallo.
4. Leer el cuerpo y convertirlo a JSON si tiene contenido.
5. Devolver `undefined` cuando el cuerpo esté vacío.

El último paso es importante: la eliminación devuelve `204 No Content`. Intentar interpretar ese cuerpo vacío como JSON provocaría un error aunque la eliminación hubiera funcionado.

El parámetro genérico `T` describe el resultado esperado. Por ejemplo, `apiFetch<Bicycle[]>('/bicycles')` devuelve una promesa de una colección de bicicletas.

Recuerda que `fetch` no lanza un error automáticamente por recibir un estado 400 o 500; de ahí la comprobación de `response.ok`.

## 8. Crear el servicio de bicicletas

Implementa [bicycleService.ts](../src/features/bicycles/services/bicycleService.ts) con los métodos `getAll`, `getById`, `create`, `update` y `remove`. Cada uno corresponde a una ruta de la tabla del paso 4.

Por ejemplo:

```ts
create(payload: BicyclePayload) {
    return apiFetch<Bicycle>('/bicycles', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}
```

`JSON.stringify` convierte el objeto JavaScript en el texto JSON que se envía en el cuerpo de la petición. `update` hace lo mismo con `PUT` y una ruta que incluye el identificador. `remove` utiliza `DELETE` y el tipo de resultado `void`.

El servicio conoce las rutas, pero no decide qué modal abrir ni qué mensaje mostrar. Esa responsabilidad pertenece a las capas de interfaz.

## 9. Gestionar los datos mediante un hook

Crea [useBicycles.ts](../src/features/bicycles/hooks/useBicycles.ts). Un hook personalizado es una función que agrupa lógica de React y cuyo nombre comienza por `use`.

Declara estos estados:

```ts
const [bicycles, setBicycles] = useState<Bicycle[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

Implementa `loadBicycles` usando `try`, `catch` y `finally`: activa la carga, limpia el error, consulta el servicio, guarda los datos y desactiva la carga incluso cuando falle la petición.

Ejecuta la carga inicial con el efecto que aparece en el archivo:

```ts
useEffect(() => { void loadBicycles() }, [])
```

`void` indica que no utilizamos la promesa devuelta; no captura errores por sí mismo. En este caso la función ya los gestiona internamente.

Después añade las operaciones:

- `saveBicycle(id, payload)`: si `id === null`, crea; si hay identificador, actualiza. Tras guardar, vuelve a consultar el listado.
- `deleteBicycle(id)`: elimina y vuelve a cargar los datos.

Devuelve los estados y funciones que necesitará la página. Ten presente el contrato actual: un fallo al guardar se vuelve a lanzar para que el formulario siga abierto, mientras que un fallo al eliminar se guarda en `error` sin volver a lanzarlo.

**Comprueba:** al montar la página debe aparecer una petición GET en la pestaña Red del navegador y finalizar el estado de carga.

## 10. Construir el listado responsive

Primero crea el [componente Button](../src/components/ui/Button.tsx), que admite propiedades normales de un botón y una variante `primary`, `secondary` o `danger`.

Después implementa [BicycleList.tsx](../src/features/bicycles/components/BicycleList.tsx) y [BicycleRow.tsx](../src/features/bicycles/components/BicycleRow.tsx):

1. `BicycleList` recibe el array de bicicletas y las funciones opcionales `onEdit` y `onDelete`.
2. Recorre el array mediante `map` y crea un `BicycleRow` por registro.
3. Usa `key={bicycle.id}` para que React identifique cada elemento de forma estable.
4. Cada fila recibe su bicicleta y llama a los callbacks con su identificador al pulsar los botones.

El listado utiliza `<ul>` y `<li>`, no una tabla HTML. Dentro de cada elemento hay un `<dl>` con etiquetas `<dt>` y valores `<dd>`.

La distribución se construye desde el tamaño móvil:

| Clases o estructura | Efecto |
| --- | --- |
| `grid-cols-2` en los datos | Dos columnas dentro de cada tarjeta móvil |
| `lg:grid-cols-5` | Cinco columnas en pantallas grandes cuando existen acciones |
| `lg:grid-cols-4` | Cuatro columnas cuando no hay botones de acción |
| `lg:contents` en el `dl` | Sus bloques participan en la cuadrícula de la fila |
| `hidden lg:grid` | Encabezados visibles solamente en escritorio |
| `lg:sr-only` en las etiquetas | En escritorio quedan disponibles para lectores de pantalla sin ocupar espacio visual |
| `min-w-0` y `[overflow-wrap:anywhere]` | Los textos largos pueden ajustarse sin ensanchar la tarjeta |
| `flex-wrap` y `min-h-11` | Botones que se adaptan al espacio y tienen una altura cómoda para pulsar |

Aunque el archivo conserve el nombre `BicycleRow`, en móvil representa una tarjeta. Los textos visibles son Marca, Modelo, Precio, Existencias, Acciones, Editar y Eliminar.

**Comprueba:** prueba anchos de 320, 375, 768 y 1280 píxeles, incluyendo una marca y un modelo largos. No debería ser necesario desplazarse horizontalmente para acceder a los botones.

## 11. Crear los campos del formulario

Implementa [BicycleFormFields.tsx](../src/features/bicycles/components/BicycleFormFields.tsx). Este componente recibe `values`, `onChange` y `disabled`.

Los valores de edición son cadenas de texto, incluidos precio y existencias. Un campo numérico también puede estar vacío mientras se escribe: convertirlo inmediatamente a número impediría representar bien ese estado.

```ts
export interface BicycleFormValues {
    brand: string
    model: string
    description: string
    price: string
    stock: string
}
```

Cada control es un **campo controlado**: `value` sale del estado de React y `onChange` actualiza ese estado a través del componente padre.

```tsx
<input name="brand" required maxLength={150}
    value={values.brand}
    onChange={(event) => onChange('brand', event.target.value)} />
```

En el archivo completo también se incluyen el patrón que rechaza valores formados solo por espacios y las siguientes restricciones:

| Campo | Restricción |
| --- | --- |
| Marca y modelo | Obligatorios, hasta 150 caracteres y no solo espacios |
| Descripción | Opcional |
| Precio | Obligatorio, entre 0 y 99.999.999,99, con paso 0,01 |
| Existencias | Obligatorias, enteras, entre 0 y 4.294.967.295 |

Estos límites corresponden a los campos definidos en el modelo del backend. Las etiquetas envuelven a sus controles para asociar el texto con el campo.

## 12. Mostrar la validación en español

Los mensajes nativos del navegador pueden depender del idioma del navegador. Para controlar el texto, el archivo de campos implementa `updateValidationMessage(input)`.

Su procedimiento es:

1. Limpiar el error personalizado anterior con `input.setCustomValidity('')`.
2. Consultar `input.validity`.
3. Elegir el mensaje español correspondiente.
4. Establecerlo con `setCustomValidity(message)`.

Se comprueban `badInput`, `valueMissing`, `patternMismatch`, `tooLong`, `rangeUnderflow`, `rangeOverflow` y `stepMismatch`. Por ejemplo, un precio con un paso inválido muestra «Introduce un precio con un máximo de dos decimales».

El `fieldset` gestiona `onInvalid` para personalizar el error al validar y `onInput` para actualizarlo al escribir. La comprobación `instanceof HTMLInputElement` permite acceder de forma segura a las propiedades del control.

Limpiar el mensaje anterior es esencial: un mensaje personalizado no vacío mantiene inválido el campo aunque la persona haya corregido el valor.

La validación del navegador mejora la experiencia de uso, pero el backend también debe validar los datos: una petición HTTP puede enviarse sin utilizar este formulario.

## 13. Gestionar el envío del formulario

Implementa [BicycleForm.tsx](../src/features/bicycles/components/BicycleForm.tsx). Recibe la bicicleta que se edita, o `null` para crear una nueva, junto con `onSave`, `onCancel` y `onSavingChange`.

Inicializa los valores desde la bicicleta recibida. Para crear, deja vacíos marca, modelo, descripción y precio, y establece las existencias en `0`.

En `handleSubmit`:

1. Llama a `event.preventDefault()` para evitar la navegación tradicional del formulario.
2. Impide un segundo envío si ya existe uno pendiente.
3. Convierte los valores al formato `BicyclePayload`.
4. Comprueba los datos antes de enviarlos.
5. Activa el estado de guardado y llama a `onSave`.
6. Si falla, muestra un error en español y conserva los valores introducidos.
7. Desactiva el estado de guardado en `finally`.

La conversión central es:

```ts
const payload: BicyclePayload = {
    brand: values.brand.trim(),
    model: values.model.trim(),
    description: values.description.trim() || null,
    price: Number(values.price),
    stock: Number(values.stock),
}
```

`trim()` elimina espacios al principio y al final. La descripción vacía se envía como `null`. La validación HTML comprueba, entre otras cosas, el paso decimal; el manejador añade comprobaciones antes de llamar al servicio.

`saving` sirve para renderizar el texto «Guardando...» y deshabilitar los controles. La referencia `submitting` sirve como bloqueo inmediato contra envíos duplicados, sin esperar al siguiente renderizado.

## 14. Crear los modales

Implementa [BicycleModal.tsx](../src/features/bicycles/components/BicycleModal.tsx) para añadir y editar. Después crea [BicycleDeleteModal.tsx](../src/features/bicycles/components/BicycleDeleteModal.tsx) para confirmar la eliminación.

Los dos utilizan `<dialog>`:

```ts
useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
}, [])
```

`useRef` da acceso al elemento del DOM. `showModal()` abre el diálogo como modal, bloqueando la interacción con el contenido de detrás y proporcionando el comportamiento de foco del navegador. La función devuelta por el efecto lo cierra al desmontar el componente.

Usa `useId` para generar los identificadores y relacionar el título con el diálogo mediante `aria-labelledby`. La confirmación también relaciona su descripción mediante `aria-describedby`.

El evento `onCancel` permite gestionar Escape: se impide el cierre mientras se guarda o elimina. En la confirmación, el foco inicial se coloca en «Cancelar».

Para el tamaño se utilizan estas clases:

```text
w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto
```

El ancho deja un margen lateral de `1rem` por lado cuando la pantalla es estrecha, con un ancho máximo en escritorio. La altura limitada y el desplazamiento interno permiten usar el formulario cuando no cabe verticalmente. `backdrop:bg-black/50` oscurece el fondo.

La confirmación se muestra dentro de la página: no utiliza `window.confirm`. Recibe la bicicleta seleccionada y ofrece «Cancelar» y «Eliminar»; ambos botones se bloquean durante la petición.

## 15. Conectar todo en la página

Implementa [BicyclesPage.tsx](../src/features/bicycles/pages/BicyclesPage.tsx). Esta página coordina los componentes, pero delega el acceso a datos en `useBicycles`.

Además del estado del hook, necesita:

| Estado o referencia | Uso |
| --- | --- |
| `modalOpen` | Indica si se muestra el formulario |
| `selectedBicycle` | Registro que se edita; `null` significa creación |
| `bicycleToDelete` | Registro cuya eliminación se confirma |
| `deleting` | Indica que se está eliminando |
| `deletingRef` | Impide confirmar dos veces la misma operación pendiente |

Conecta las acciones en este orden:

1. **Consultar:** muestra carga, errores, estado vacío o listado según el estado del hook.
2. **Crear:** «Nueva bicicleta» llama a `openModal(null)`.
3. **Editar:** busca por identificador la bicicleta del listado y llama a `openModal(bicycle)`. En esta interfaz se reutilizan los datos cargados; no hace falta llamar a `getById`.
4. **Guardar:** llama a `saveBicycle(selectedBicycle?.id ?? null, payload)` y cierra el formulario cuando la llamada termina sin lanzar un error.
5. **Pedir eliminación:** guarda la bicicleta elegida en `bicycleToDelete` para abrir la confirmación.
6. **Confirmar eliminación:** llama a `deleteBicycle`, cierra la confirmación y libera el bloqueo.

Los modales se renderizan de forma condicional. Al cerrarlos se desmontan; al abrir de nuevo el formulario, su estado se inicializa desde la selección actual.

El encabezado muestra «Listado de Bicicletas». Utiliza `flex-col` en móvil y `sm:flex-row` para colocar título y botón en una fila cuando hay espacio. El contenedor usa `p-4 sm:p-6`.

Finalmente, conecta la página desde [App.tsx](../src/App.tsx):

```tsx
import BicyclesPage from './features/bicycles/pages/BicyclesPage'

function App() {
    return <BicyclesPage />
}

export default App
```

Hay dos detalles del comportamiento actual que debes conocer: si falla la eliminación, el hook captura el error y la página lo muestra después de cerrar la confirmación; si falla la recarga posterior a un guardado, este puede haberse completado aunque aparezca un error al obtener el listado. No confundas el resultado de una modificación con el de la consulta posterior.

## 16. Verificar el CRUD y el diseño

Realiza estas pruebas manuales con la API y la base de datos activas:

| Prueba | Resultado que debes comprobar |
| --- | --- |
| Abrir la página | GET y listado, o mensaje de lista vacía |
| Crear una bicicleta válida | POST, cierre del formulario y datos actualizados |
| Editar marca, precio y existencias | Formulario precargado, PUT y listado actualizado |
| Cancelar edición | Ninguna petición de modificación |
| Cancelar eliminación | El registro permanece y no se envía DELETE |
| Confirmar eliminación | DELETE y consulta posterior del listado |
| Enviar campos obligatorios vacíos | Mensajes de validación en español |
| Escribir solo espacios en marca o modelo | Se impide el envío |
| Introducir precio negativo o con tres decimales | Se impide el envío y se explica el problema |
| Introducir existencias negativas o fraccionarias | Se impide el envío |
| Corregir un campo inválido | El mensaje anterior deja de bloquear el envío |
| Simular red lenta | Botones bloqueados durante la operación |
| Detener la API y guardar | Error visible y datos del formulario conservados |
| Abrir modales en móvil | Márgenes laterales y desplazamiento vertical si hace falta |
| Usar Tab y Escape | Navegación por controles y cierre cuando no hay operación pendiente |

En las herramientas del navegador, revisa método, URL, cuerpo enviado, código de estado y respuesta. Así puedes distinguir un fallo de interfaz de un fallo de API.

Ejecuta también desde `frontend`:

```sh
npm run build
npm run lint
```

`build` comprueba TypeScript y genera `dist/`. `lint` analiza el código. Ninguno sustituye las pruebas de interacción ni verifica por sí solo que MySQL y la API funcionen.

En el estado documentado, el linter avisa sobre la actualización de estado iniciada desde el efecto de `useBicycles`. Es una advertencia existente que conviene analizar al estudiar los efectos; no es un error de compilación.

Puedes inspeccionar la distribución generada con `npm run preview`. Este comando sirve el resultado del frontend, pero no arranca el backend.

## 17. Resolver problemas habituales

| Problema | Qué revisar |
| --- | --- |
| No aparecen bicicletas | API activa, base de datos accesible y respuesta de GET |
| La URL de petición contiene `undefined` | Definición de `VITE_API_URL` y reinicio de Vite |
| Error 404 | Puerto y ruta; este backend monta `/bicycles`, sin prefijo `/api` |
| Error de CORS | Origen del frontend y configuración CORS del backend |
| Error al interpretar JSON después de eliminar | Tratamiento de la respuesta vacía 204 |
| Un campo sigue inválido después de corregirlo | Limpieza de `setCustomValidity` y gestión de `onInput` |
| No se aplican los estilos | Plugin de Tailwind, importación del CSS y clases escritas en los componentes |
| Una tarjeta ensancha la pantalla | Textos largos, `min-w-0`, ajuste de palabras y botones flexibles |

## 18. Actividades para afianzar lo aprendido

1. Dibuja el recorrido de los datos desde que pulsas «Guardar cambios» hasta que aparece el listado actualizado.
2. Explica por qué `BicyclePayload` no incluye el identificador y por qué los campos numéricos se editan como texto.
3. Añade una búsqueda por marca en el cliente sin cambiar el servicio HTTP.
4. Como mejora, haz que una eliminación fallida conserve abierto el modal: define primero cómo comunicará el hook el fallo a la página.
5. Revisa con el backend qué validaciones faltan en el servidor y prueba una petición inválida enviada fuera del formulario.

Al terminar, debes poder justificar qué código pertenece a un componente, qué estado coordina la página y qué responsabilidades tienen el hook y los servicios.
