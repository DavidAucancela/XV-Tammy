# Guía operativa del evento

**Sábado 3 de octubre de 2026, 5:00 pm · Servellón Urbina N58-143 y Víctor Hugo, Quito**

## Control de acceso en la puerta

El QR de la invitación contiene el link `…/i/<token>`. **No lo escanees con la cámara normal del celular**: solo abre la invitación y no registra la entrada. El check-in se hace desde `/scan`.

1. Abre `https://xv-tammy-production.up.railway.app/scan` (inicia sesión antes, con calma, no en la puerta; la sesión dura 7 días).
2. Pulsa el botón de la cámara y acepta el permiso.
3. Apunta al QR del invitado (sube el brillo de su pantalla si cuesta leerlo).
4. Resultados:
   - **Éxito:** nombre y pases confirmados (o asignados si no confirmó). Déjalo pasar con esa cantidad de personas.
   - **Ya ingresó:** ese QR ya se usó. Verifica antes de dejar pasar.
   - **Inválido:** el token no existe. Pide el nombre y busca en `/admin`.
   - **Sin internet:** los escaneos se guardan en una cola local del celular y se envían solos al volver la señal.
5. Cada QR sirve para todo el grupo: se escanea una sola vez.

Un invitado que no confirmó igual puede entrar con su QR; el check-in no exige RSVP.

`/admin` muestra en vivo quién entró y quién falta (se refresca cada ~4 s).

## Antes del evento (lista)

- [x] Fecha confirmada y publicada (`NEXT_PUBLIC_EVENT_DATE_CONFIRMED=true`)
- [x] Recordatorios por WhatsApp enviados
- [x] `/scan` y `/admin` probados
- [x] Registros de prueba de check-in limpiados
- [ ] Sesión iniciada en el celular de la puerta, con `/scan` abierto
- [ ] Brillo y batería del celular de la puerta

## Datos y estado de invitados

- 28 invitados reales en Postgres (los datos de prueba se borraron).
- Dos invitados sin teléfono (JOSE SANCHEZ, MARQUITO): se avisan por otro medio.
- RSVP pendientes al 2026-10-02: DIANA GRANDA, FELIX FLORE, JULIO FLORES, SEBASTIAN DURAN.

Para limpiar un check-in de prueba:

```sql
update guests set checked_in_at = null where nombre = '<NOMBRE>';
```

## Política de despliegue

Railway despliega en cada merge a `main` (y al cambiar variables). Hasta pasado el evento:

- Trabajar y hacer push en ramas es libre: no despliega.
- **No hacer merge a `main`** salvo un arreglo urgente. Si hace falta: rama pequeña, merge, esperar el deploy (el anterior sigue sirviendo hasta que el nuevo pase a `SUCCESS`); se puede volver al deploy previo desde el panel de Railway.
- Ya mergeado: limpieza del repo y subida de recuerdos (PR #28 y #29). Pendientes: videos reales, "¿Cómo llegar?" completo.

## Recuerdos (fotos y videos de invitados)

- Cada invitado entra por el botón "Compartir mis recuerdos" de su invitación o validando su celular en `/recuerdos`. Sin sesión la sección sale bloqueada.
- Si alguien reporta que no puede subir: probar su link `/api/recuerdos/entrar?t=<token>`; ver consola del navegador (error de CORS ⇒ re-correr `scripts/set-bucket-cors.mjs`; 401 ⇒ sesión expirada).
- Límite: 50MB por archivo (JPG, PNG, WEBP, HEIC, MP4, MOV, WEBM).

## Después del evento

- Mensaje por WhatsApp para visitar `/recuerdos` y subir/ver recuerdos: usar el link personal `https://<dominio>/api/recuerdos/entrar?t=<token>` (abre la sesión del invitado y lleva directo a la sección de subida). Requiere reabrir el acceso público al Postgres o correr el script con una `DATABASE_URL` accesible.
- Agregar los videos grabados en la fiesta a `familyItems` (`src/data/landingContent.ts`).
- Recuerdos subidos por los invitados: viven en el bucket `recuerdos` de Railway (pestaña **Files** del bucket para verlos/descargarlos) y su registro en la tabla `recuerdos`. Descargar una copia antes de borrar nada; el bucket cuesta ~$0.015/GB-mes.
- Cerrar el TCP Proxy público del Postgres en Railway si ya no se necesita.
- Mover a un lugar seguro los archivos con datos personales de la raíz (`backup - Supabase/`, `INVITADOS.numbers`, `invitados_extracted.csv`).
- Configurar backups periódicos del Postgres desde el panel de Railway.
- Si se suma otro miembro del staff con otro correo: verificar un dominio en Resend (el modo sandbox solo entrega al correo de la cuenta).
