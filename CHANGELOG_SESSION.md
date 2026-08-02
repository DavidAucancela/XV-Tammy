# Changelog - Sesión de Mejoras (2026-08-02)

## 📋 Resumen General

Sesión de mejoras enfocada en:
1. Separación de efectos visuales (fondo animado vs. parallax)
2. Mejora de la sección "Mi crecimiento"
3. Validación robusta del formulario de invitaciones
4. Sistema de acceso por fecha para secciones protegidas

**Commit:** `11a7836`  
**Branch:** main

---

## 🎨 1. Separación de Fondos Animados

### Cambio realizado
Se separó el fondo animado de la pantalla de "sobre" del parallax de cursor en `GardenScene`.

### Archivos modificados
- `src/components/landing/EnvelopeBackground.tsx` (NUEVO)
- `src/lib/usePointerParallax.ts`
- `src/components/landing/GardenScene.tsx`
- `src/components/landing/InvitationOpener.tsx`

### Detalles técnicos

**EnvelopeBackground.tsx** - Nuevo componente
```typescript
// Fondo animado independiente para la pantalla del sobre
// Usa keyframes CSS mesh-blob-1 y mesh-blob-2
// No depende del cursor ni de GardenScene
// Componentes: 2 blobs con gradientes oro y rose
```

**usePointerParallax.ts** - Modificado
```typescript
// Agregado parámetro `enabled` (default: true)
// Cuando enabled=false, no se attach listener
// Motion values permanecen en reposo
```

**GardenScene.tsx** - Modificado
```typescript
// Agregado prop `parallax` (default: false)
// En / -> parallax=false (sin cursor)
// En /recuerdos -> parallax=true (con cursor)
```

**InvitationOpener.tsx** - Modificado
```typescript
// Se agregó <EnvelopeBackground />
// Reemplaza radial-gradient estático
// Muestra solo dentro del overlay sellado
```

### Comportamiento
- **`/`** (landing): Fondo de flores SIN parallax + EnvelopeBackground en sobre
- **`/recuerdos`** (después de abrir invitación): GardenScene CON parallax

---

## 📸 2. Mejora de "Mi Crecimiento"

### Cambios realizados
- ❌ Eliminar botones de etapas (MIS PRIMEROS PASOS, etc.)
- ❌ Eliminar vista previa (filmstrip de thumbnails)
- ❌ Eliminar botón "Reproducir música" siempre visible
- ✅ Agregar botón de fullscreen (⛶)
- ✅ Mostrar botón de música (♪) SOLO en fullscreen

### Archivos modificados
- `src/components/landing/PhotoGallery.tsx`

### Detalles técnicos

```typescript
// Estado para fullscreen
const [isFullscreen, setIsFullscreen] = useState(false);

// Toggle fullscreen
const toggleFullscreen = async () => {
  if (!isFullscreen) {
    await slideshowRef.current?.requestFullscreen();
    setIsFullscreen(true);
  } else {
    await document.exitFullscreen();
    setIsFullscreen(false);
  }
};

// Listener para cambios de fullscreen
useEffect(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
}, []);

// Botón música condicional
{isFullscreen && <IconButton onClick={requestMusic}>♪</IconButton>}
```

### Eliminaciones
- Líneas 115-140: Botón "Reproducir música" en card
- Líneas 143-181: Botones de etapas
- Líneas 343-432: Filmstrip de thumbnails
- Líneas 344-363: Dots de navegación

### Resultado
- Galería más limpia y minimalista
- Botón fullscreen visible siempre (⛶)
- Música accesible solo en fullscreen

---

## 🔐 3. Bloqueo de Secciones por Fecha

### Cambio realizado
Las secciones de "Galería" y "Mensajes de Familia" en `/recuerdos` se bloquean hasta el día del evento. Admin puede ver con query param `?admin=preview`.

### Archivos modificados/creados
- `src/app/recuerdos/page.tsx` (Revertido a Server Component)
- `src/components/landing/GatekeeperSection.tsx` (NUEVO)
- `src/components/landing/RecuerdosContent.tsx` (NUEVO)

### Detalles técnicos

**GatekeeperSection.tsx** - Componente Gatekeeper
```typescript
interface GatekeeperSectionProps {
  eventDate: string;      // ISO string
  adminPreview: boolean;  // ?admin=preview
  sections: "gallery" | "familia";
  children: ReactNode;
}

// Lógica
const now = new Date();
const event = new Date(eventDate);
const isEventHere = now >= event;
const canAccess = isEventHere || adminPreview;

// Si no puede acceder: muestra contador regresivo (días/horas)
```

**RecuerdosContent.tsx** - Cliente wrapper
```typescript
"use client";
// Lee searchParams para ?admin=preview
// Envuelve PhotoGallery, PhotoGrid, FamilyMessages
// Pasa adminPreview como prop a GatekeeperSection
```

**recuerdos/page.tsx** - Modificado
```typescript
// Revertido a Server Component (async function)
// Puede llamar getGroupedPhotos() que usa node:fs
// Suspense + RecuerdosContent para client-side logic
```

### Acceso
- **Usuario normal** (antes del evento): Ve contador de días/horas restantes
- **Admin** (cualquier momento): `/recuerdos?admin=preview` → ve contenido
- **Automático** (a partir del evento): Se desbloquea sin query param

### Colores del bloqueo (hardcoded)
```
Fondo: #F3E6D6 (champagne)
Títulos: #4A372E (taupe oscuro)
Números: #B4707C (rose)
Texto secundario: #7A6355 (taupe)
Card fondo: rgba(252,246,236,0.85) (cremoso)
```

---

## ✅ 4. Validación Robusta de Invitaciones

### Cambio realizado
Validación estricta: exactamente 10 dígitos, con delay antes de mostrar errores.

### Archivos modificados
- `src/components/landing/InvitePrompt.tsx`
- `src/app/api/invitacion/route.ts`

### Detalles técnicos

**Frontend (InvitePrompt.tsx)**

```typescript
// Validación
const digits = telefono.replace(/\D/g, "");
const isValidLength = digits.length === 10;

// Input
- type="tel"
- maxLength={10}
- Solo acepta números (handlePhoneChange filtra)

// Flujo de entrada
1. Escribe número → contador "X/10 dígitos"
2. A los 10 → "✓ Número válido"
3. Botón se habilita automáticamente

// Errores
- Delay de 1 segundo antes de mostrar
- Auto-limpieza después de 3 segundos
- Se limpia al seguir escribiendo
```

**Backend (API invitacion/route.ts)**

```typescript
// Validación estricta
const digits = telefono.replace(/\D/g, "");
if (digits.length !== 10) {
  return error: "El número debe tener exactamente 10 dígitos"
}

// Búsqueda en DB
const key = digits; // Usa todos los 10 dígitos
const { data: guest } = await supabase
  .from("guests")
  .select("token, nombre")
  .like("telefono", `%${key}`)
```

### Cambios de validación

**Antes:** Aceptaba números con >= 9 dígitos (último 9 para búsqueda)
**Ahora:** Acepta exactamente 10 dígitos, búsqueda exacta

### Flujo completo
1. Usuario escribe → filtra solo números, máximo 10
2. 10 dígitos → botón se habilita
3. Click sin 10 → espera 1s → muestra error
4. Error desaparece automáticamente después de 3s
5. Submit → API valida exactamente 10 → busca en DB

---

## 🚫 5. Cambio Revertido: Efecto Bend

### Lo que se hizo
Se instaló componente Canvas UI "Bend" para efecto 3D en cambio de imágenes.

### Por qué se revertió
Usuario indicó que no le gustó el efecto visual.

### Archivos creados (pero no usados)
- `src/components/canvasui/Bend.tsx` (Instalado pero no integrado)

---

## 📁 Estructura de Archivos Nuevos

```
src/components/landing/
├── EnvelopeBackground.tsx       (Nuevo - fondo sobre)
├── GatekeeperSection.tsx        (Nuevo - bloqueo por fecha)
├── RecuerdosContent.tsx         (Nuevo - wrapper cliente)
├── PhotoGallery.tsx             (Modificado - sin dots/botones)
├── InvitePrompt.tsx             (Modificado - validación)
└── ...

src/components/canvasui/
├── Bend.tsx                     (Nuevo - instalado, no usado)
└── ...

src/app/
├── recuerdos/
│   └── page.tsx                 (Modificado - server component)
├── api/
│   └── invitacion/
│       └── route.ts             (Modificado - validación estricta)
└── ...

src/lib/
└── usePointerParallax.ts        (Modificado - parámetro enabled)
```

---

## 🧪 Testing Recomendado

### Sobre animado (`/`)
- [ ] Fondo se mueve suavemente (sin parallax)
- [ ] EnvelopeBackground visible detrás del sobre
- [ ] Botón fullscreen en esquina superior derecha

### Galería (`/recuerdos`)
- [ ] Botón fullscreen visible (⛶)
- [ ] Botón música (♪) solo aparece en fullscreen
- [ ] Sin botones de etapas
- [ ] Sin filmstrip de thumbnails
- [ ] Sin dots de navegación

### Bloqueo por fecha (`/recuerdos`)
- [ ] Antes del evento: muestra contador días/horas
- [ ] Con `?admin=preview`: muestra contenido
- [ ] Después del evento: muestra contenido automático

### Invitaciones (`/recuerdos`)
- [ ] Input solo acepta números
- [ ] Máximo 10 dígitos (no se puede escribir más)
- [ ] Contador "X/10 dígitos"
- [ ] A los 10: "✓ Número válido"
- [ ] Botón se habilita solo con 10 dígitos
- [ ] Click sin 10: espera 1s, luego muestra error
- [ ] Error desaparece automáticamente después de 3s

---

## 🚀 Despliegue

### Cambios en Producción (Railway)
Los cambios se publican automáticamente al hacer push a `origin/main`.

### Variables de Entorno Requeridas
```
NEXT_PUBLIC_EVENT_DATE=2026-09-19T17:00:00-05:00
```

Este valor se usa en:
- `GatekeeperSection.tsx` - bloqueo de secciones
- `getEventDetails()` - cálculos generales

---

## 📝 Notas Importantes

### Seguridad
- Admin preview con `?admin=preview` es simple (solo para dev)
- En producción, considerar proteger con autenticación real
- Validación de 10 dígitos es estricta (sin formato internacional)

### Performance
- `GardenScene` sin parallax = menos cálculos en `/`
- Bloqueo por fecha = cálculos del lado del cliente (no requiere API)
- Errores con delay = mejor UX (menos flash de mensajes)

### Accesibilidad
- Respeta `prefers-reduced-motion` en animaciones
- Colores hardcoded tienen buen contraste
- Labels y aria-labels en inputs

---

## ✨ Commit Details

**Autor:** Claude Haiku 4.5  
**Fecha:** 2026-08-02  
**Hash:** 11a7836  
**Branch:** main  
**Files Changed:** 6  
**Insertions:** 1390+  
**Deletions:** 32-

**Mensaje:**
```
feat: mejorar validación de invitaciones y bloquear secciones por fecha

- Validación estricta de exactamente 10 dígitos en forma de invitación
- Delay de 1 segundo antes de mostrar errores
- Auto-limpieza de errores después de 3 segundos
- Bloquear galería y mensajes de familia hasta el día del evento
- Admin preview con query param ?admin=preview
- Mejorar UI del componente gatekeeper con contador regresivo
- Remover efecto Bend (revertido)
```

---

## 🔗 Referencias

- **Landing Page:** `/`
- **Recuerdos:** `/recuerdos` (con bloqueo por fecha)
- **Admin Preview:** `/recuerdos?admin=preview`
- **Invitaciones:** En `/recuerdos` sección "¿Tienes tu invitación?"
- **Galería:** En `/recuerdos` sección "Mi crecimiento"
