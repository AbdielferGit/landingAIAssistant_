# AiAssistant CRM

El CRM usa una Google Sheet como base de datos y un proyecto de Google Apps Script como backend y panel de administración. La landing puede seguir alojada como sitio estático en Bluehost.

## Componentes

- `apps-script/Code.gs`: recepción de prospectos, validación, deduplicación, notificaciones y operaciones del CRM.
- `apps-script/Index.html`: panel protegido por token para revisar el pipeline, actualizar prospectos y registrar actividades.
- `apps-script/appsscript.json`: manifiesto con la zona horaria y los permisos mínimos necesarios.

## Configuración

1. Abre la Google Sheet **AiAssistant CRM**.
2. En Google Sheets, abre **Extensiones → Apps Script**.
3. Copia `Code.gs` e `Index.html` al proyecto y activa la visualización del manifiesto para reemplazar `appsscript.json`.
4. En **Configuración del proyecto → Propiedades del script**, crea `CRM_CONTACT_EMAIL` con el correo que recibirá las notificaciones. La dirección no se guarda en Git.
5. Ejecuta `initializeCrm` una vez. La función enlaza la hoja y genera el token de administración.
6. Guarda el token mostrado en el registro de ejecución dentro de un gestor de contraseñas.
7. Implementa el proyecto como **Aplicación web**:
   - Ejecutar como: propietario del proyecto.
   - Acceso: cualquier usuario, para permitir envíos desde la landing.
8. Copia la URL terminada en `/exec` a `NEXT_PUBLIC_CRM_ENDPOINT` y recompila el sitio para Bluehost.

## Seguridad

- El panel no expone datos sin un token válido.
- El token vive en las propiedades del script, no en Git ni en la Google Sheet.
- La landing incluye un campo señuelo y el backend limita duplicados recientes.
- El endpoint de captación es público por diseño. Para campañas con alto volumen se recomienda añadir Turnstile o reCAPTCHA.
- El panel no permite eliminar prospectos; las actualizaciones relevantes se registran en `Actividad`.

## Citas y atribución

La landing solicita una fecha y hora preferidas en la zona `America/Toronto`. El backend crea el prospecto como `Calificado`, usa la fecha como próximo seguimiento, registra una actividad `Reunión` y conserva `utm_source`, `utm_medium`, `utm_campaign` y `utm_content` en el historial. La disponibilidad se confirma manualmente por correo; no se presenta como una reserva instantánea.
