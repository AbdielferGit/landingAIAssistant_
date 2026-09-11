# Embudo Facebook + Instagram — AiAssistant

Sistema editorial y publicitario para convertir atención en solicitudes de diagnóstico y registrar cada oportunidad en el CRM.

## Resultado del recorrido

1. Una publicación o anuncio atrae al decisor con un problema operativo concreto.
2. El enlace lleva a la versión francesa o inglesa de la landing con parámetros UTM.
3. La persona explica su reto y elige una fecha y hora preferidas.
4. Google Apps Script crea el prospecto como `Calificado`, guarda la cita como próximo seguimiento, registra una actividad `Reunión` y envía una alerta por correo.
5. El equipo confirma la cita por email y actualiza el estado desde el panel CRM.

La selección de horario es una solicitud, no una confirmación en tiempo real. Esto evita dobles reservas hasta conectar un calendario con disponibilidad.

## Archivos

- `audiencias-y-campanas.md`: públicos, estructura de campañas, presupuesto de prueba y reglas de optimización.
- `posts-fr.md`: ocho publicaciones completas en francés.
- `posts-en.md`: cuatro publicaciones completas en inglés.
- `content-calendar.csv`: secuencia de cuatro semanas.
- `utm-links.csv`: URLs medibles que alimentan el CRM.
- `assets/`: seis creativos 4:5 editables en SVG y exportados a PNG.

## Operación semanal

- Publicar lunes, miércoles y viernes.
- Responder comentarios y mensajes el mismo día hábil.
- Confirmar por correo cada solicitud de cita en menos de un día hábil.
- Revisar los viernes: gasto, visitas, formularios, citas solicitadas, citas realizadas y oportunidades que avanzaron.
- Mover en el CRM: `Calificado` → `Contactado` al enviar confirmación; `Propuesta` después del diagnóstico si existe encaje; `Ganado` o `Perdido` al cerrar.

## Lo que falta para automatizar Meta de extremo a extremo

- Conectar la cuenta de Facebook/Instagram o Meta Business Suite para publicar.
- Definir presupuesto y método de pago antes de activar anuncios.
- Para optimización publicitaria por conversiones, instalar Meta Pixel/CAPI con consentimiento y usar un evento de cita. Mientras tanto, las UTM permiten medir la fuente y la pieza dentro del CRM.

