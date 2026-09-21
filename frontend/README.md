# Frontend de la tienda de bicicletas

Aplicación con React, TypeScript, Vite y Tailwind CSS para consultar, crear, editar y eliminar bicicletas mediante la API del proyecto.

## Guía de construcción

Consulta la [guía paso a paso para alumnado de DSW del Ciclo Superior de Desarrollo de Aplicaciones Web](docs/frontend-guide.md). Explica la preparación del proyecto, la conexión con la API, los componentes, el formulario, la validación en español, los modales y el diseño responsive.

## Puesta en marcha

Desde esta carpeta, ejecuta `npm ci`, configura `VITE_API_URL` en `.env.local` con la dirección de tu backend y ejecuta `npm run dev`. La API y su base de datos deben estar en funcionamiento para utilizar el CRUD. Consulta los detalles y las comprobaciones en la guía.

## Referencia de la plantilla original

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
