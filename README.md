# AiAssistant landing page

Landing page trilingüe para AiAssistant, creada para campañas publicitarias y captación de empresas que quieren adoptar inteligencia artificial.

El sitio incluye dos ofertas, cada una conectada a su propio CRM:

- Acompañamiento para la adopción de IA.
- Creación de sitios web preparados para integrar chatbot, CRM, comercio, pagos y túneles de venta.

## Idiomas

- Français: `/`
- English: `/en/`
- Español: `/es/`
- Ancienne URL française conservée: `/fr/`

### Sitios web preparados para IA

- Français: `/sites-ia/`
- English: `/en/ai-ready-websites/`
- Español: `/es/sitios-web-ia/`

## Desarrollo

```bash
pnpm install
pnpm dev
```

## CRM

El repositorio incluye un CRM ligero basado en Google Sheets y Google Apps Script:

- Una base de datos independiente por oferta en Google Drive, con pestañas `Panel`, `Prospectos` o `Clientes`, y `Actividad`.
- Recepción de formularios desde la landing.
- Notificaciones al correo privado configurado en Apps Script.
- Panel protegido por token para actualizar el pipeline y registrar actividades.

La implementación y las instrucciones están en [`crm/`](crm/README.md).

## Embudo Facebook e Instagram

`marketing/meta/` contiene el público objetivo, la estructura de campañas, doce publicaciones en francés e inglés, el calendario de cuatro semanas, enlaces UTM y seis creativos 4:5 en SVG y PNG. Los enlaces conservan la atribución hasta el CRM.

## Generar la versión estática para Bluehost

```bash
NEXT_PUBLIC_SITE_URL=https://getaiassistant.app \
NEXT_PUBLIC_CRM_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec \
NEXT_PUBLIC_WEBSITE_CRM_ENDPOINT=https://script.google.com/macros/s/WEBSITE_DEPLOYMENT_ID/exec \
pnpm build:bluehost
```

El resultado queda en `out/`. Para publicar en Bluehost, se debe copiar el contenido de esa carpeta —no la carpeta misma— al document root del dominio.

El repositorio incluye `.cpanel.yml`, por lo que el repositorio administrado desde cPanel puede desplegar `out/` al document root mediante **Deploy HEAD Commit**.

Los valores de `NEXT_PUBLIC_CRM_ENDPOINT` y `NEXT_PUBLIC_WEBSITE_CRM_ENDPOINT` se incorporan durante el build. No se debe publicar una nueva versión de `out/` sin configurar ambos endpoints de Apps Script.
