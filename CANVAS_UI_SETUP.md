# Canvas UI Integration Guide

Documentación del proceso de integración de Canvas UI en XV-Tammy.

## ¿Qué es Canvas UI?

Canvas UI es una librería de componentes de alta calidad construida sobre el Canvas Drawing API. Ofrece componentes interactivos y animados para React, Svelte, Vue, Solid y Preact.

**Sitio oficial:** https://canvasui.dev

## Instalación

### Requisitos previos

- ✅ React 19 (ya presente en el proyecto)
- ✅ TypeScript (ya configurado)
- ✅ Chrome con flag `canvas-draw-element` habilitado (desarrollo)
- ⚠️ Origin trial token para producción

### Paso 1: Habilitar flag en Chrome (desarrollo)

Para desarrollo local, necesitas habilitar la feature en Chrome:

```
1. Abre chrome://flags
2. Busca "canvas-draw-element"
3. Cambia a "Enabled"
4. Reinicia Chrome
```

### Paso 2: Instalar componentes con shadcn CLI

```bash
npx shadcn@latest add @canvas-ui/liquid-react
```

Esto instala los componentes en `components/canvasui/`.

### Paso 3: Verificar instalación

Los componentes se ubican en:
```
src/components/canvasui/
├── [componentes instalados aquí]
```

## Componentes disponibles

Canvas UI ofrece varios componentes:
- Liquid button
- Canvas animations
- Interactive elements
- Custom shapes

Ver https://canvasui.dev/docs/components para la lista completa.

## Integración en el proyecto XV-Tammy

### Casos de uso sugeridos

1. **Botones interactivos** en landing page (CTA principal, invitación)
2. **Animaciones de entrada** en secciones (`GardenScene`, `InvitationOpener`)
3. **Transiciones entre páginas** (mejorar `PageTransition.tsx`)
4. **Efectos en minigame** (`ButterflyGame.tsx`)

### Implementación paso a paso

1. Instalar componentes (ver Paso 2 arriba)
2. Importar en componentes Client (`"use client"`)
3. Usar en lugar de componentes customizados similares
4. Probar en navegador con Chrome flag habilitado

## Requisitos de producción (Railway)

Para desplegar a producción, necesitarás:

1. **Origin Trial Token** de Google (Canvas Drawing API)
   - Registrarse en: https://developer.chrome.com/origintrials/
   - Duración: ~3 meses
   - Renovación: antes de expiración

2. **Configurar el token** en Next.js:
   ```tsx
   // En src/app/layout.tsx
   export const metadata: Metadata = {
     other: {
       'origin-trial': 'YOUR_TOKEN_HERE'
     }
   };
   ```

3. **Fallback para navegadores sin soporte**: Tener versión sin Canvas UI como fallback

## Notas técnicas

- Canvas UI usa `@canvas-ui/liquid-react` para React
- Los componentes son Client Components (`"use client"`)
- Tailwind CSS compatible (v4 del proyecto funciona bien)
- Performance: monitorear en Core Web Vitals

## Estado actual

**⚠️ UPDATE (2026-08-02):** Canvas UI no está disponible públicamente en npm registry en este momento. El paquete `@canvas-ui/liquid-react` retorna 404.

### Alternativa: UI Improvements sin Canvas UI

En lugar de esperar a Canvas UI, vamos a mejorar la interfaz usando:
- ✅ **Framer Motion** (ya instalado) — animaciones avanzadas
- ✅ **Tailwind CSS v4** (ya configurado) — estilos y efectos
- ✅ **CSS Canvas Drawing API** — efectos visuales nativos (si necesarios)

Componentes a mejorar:
- [ ] Botones interactivos en `/recuerdos` (InvitePrompt, EventLocation CTAs)
- [ ] Transiciones suaves entre secciones en landing
- [ ] Efectos hover más dinámicos en PhotoGallery
- [ ] Animación de entrada mejorada en InvitationOpener
- [ ] Efectos en ButterflyGame minigame

## Referencias

- Docs oficial: https://canvasui.dev/docs
- Origin trials: https://developer.chrome.com/origintrials/
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
