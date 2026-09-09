# AiAssistant landing page

Landing page trilingüe para AiAssistant, creada para campañas publicitarias y captación de empresas que quieren adoptar inteligencia artificial.

## Idiomas

- Español: `/`
- English: `/en/`
- Français: `/fr/`

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Generar la versión estática para Bluehost

```bash
NEXT_PUBLIC_SITE_URL=https://getaiassistant.app pnpm build:bluehost
```

El resultado queda en `out/`. Para publicar en Bluehost, se debe copiar el contenido de esa carpeta —no la carpeta misma— al document root del dominio.

El formulario incluido es una demostración visual. Antes de usarlo en campañas reales debe conectarse a un correo, CRM o servicio de formularios.
