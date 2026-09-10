# AiAssistant landing page

Landing page trilingüe para AiAssistant, creada para campañas publicitarias y captación de empresas que quieren adoptar inteligencia artificial.

## Idiomas

- Français: `/`
- English: `/en/`
- Español: `/es/`
- Ancienne URL française conservée: `/fr/`

## Desarrollo

```bash
pnpm install
pnpm dev
```

## CRM

El repositorio incluye un CRM ligero basado en Google Sheets y Google Apps Script:

- Base de datos en Google Drive con pestañas `Panel`, `Prospectos` y `Actividad`.
- Recepción de formularios desde la landing.
- Notificaciones al correo privado configurado en Apps Script.
- Panel protegido por token para actualizar el pipeline y registrar actividades.

La implementación y las instrucciones están en [`crm/`](crm/README.md).

## Generar la versión estática para Bluehost

```bash
NEXT_PUBLIC_SITE_URL=https://getaiassistant.app \
NEXT_PUBLIC_CRM_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec \
pnpm build:bluehost
```

El resultado queda en `out/`. Para publicar en Bluehost, se debe copiar el contenido de esa carpeta —no la carpeta misma— al document root del dominio.

El repositorio incluye `.cpanel.yml`, por lo que el repositorio administrado desde cPanel puede desplegar `out/` al document root mediante **Deploy HEAD Commit**.

El valor de `NEXT_PUBLIC_CRM_ENDPOINT` se incorpora durante el build. No se debe publicar una nueva versión de `out/` sin configurar el endpoint del proyecto de Apps Script.
