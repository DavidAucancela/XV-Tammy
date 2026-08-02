# UI Improvements Plan

Plan de mejoras de interfaz para XV-Tammy usando herramientas existentes (Framer Motion + Tailwind CSS v4).

## Visión

Mejorar la experiencia visual con animaciones más dinámicas, transiciones suaves y efectos interactivos que eleven la calidad del diseño editorial champagne/rose gold.

## Herramientas disponibles

- **Framer Motion v12** — animaciones, gestos, scroll triggers
- **Tailwind CSS v4** — estilos modernos, backdrop filters, gradientes
- **CSS Animations** — @keyframes personalizadas (ya en `globals.css`)

## Mejoras propuestas

### 1. Botones interactivos mejorados
**Componente:** `Button.tsx`

Cambios:
- [ ] Agregar efecto hover con escala suave + glow dinámico
- [ ] Ripple effect en click (tipo Material Design)
- [ ] Estado activo/disabled con transiciones
- [ ] Soporte para `whileHover` y `whileTap` de Framer Motion

```tsx
// Antes: button básico con Tailwind
// Después: motion.button con animaciones interactivas
```

**Impacto:** CTA buttons en InvitePrompt, EventLocation, recuerdos link

### 2. Transiciones entre páginas mejoradas
**Componente:** `PageTransition.tsx`

Cambios:
- [ ] Fade + slide effect en entrada/salida
- [ ] Stagger effect en elementos hijos
- [ ] Diferentes animaciones según direction (forward/back)
- [ ] Sync con scroll position

**Impacto:** Navegación `/` → `/recuerdos` → `/i/[token]` más fluida

### 3. Efectos hover en PhotoGallery
**Componente:** `PhotoGallery.tsx` / `PhotoGrid.tsx`

Cambios:
- [ ] Hover zoom + blur background
- [ ] Sombra dinámica en hover
- [ ] Border glow effect
- [ ] Ken Burns animation más suave

**Impacto:** Galería se siente más premium e interactiva

### 4. Animación de apertura mejorada
**Componente:** `InvitationOpener.tsx`

Cambios:
- [ ] Burst animation más dramática (pétals + particles)
- [ ] Sound effect (opcional, require MusicContext)
- [ ] Scale + opacity sequence
- [ ] Parallax en fondo durante animación

**Impacto:** Primera impresión (seal) más memorable

### 5. Scroll progress bar animado
**Componente:** `ScrollProgress.tsx`

Cambios:
- [ ] Gradient color change según progreso
- [ ] Altura dinámica (thinner = top, thicker = bottom)
- [ ] Smooth easing en lugar de linear
- [ ] Glow effect opcional

**Impacto:** Visual feedback durante scroll en `/recuerdos`

### 6. ButterflyGame enhancemen
**Componente:** `ButterflyGame.tsx`

Cambios:
- [ ] Butterfly catch → particle explosion + confetti
- [ ] Counter popup animation
- [ ] Score milestone animations (cada 10)
- [ ] Sound effects integration

**Impacto:** Minigame se siente más responsivo y rewarding

### 7. Floating elements refinement
**Componentes:** `FloatingIcons.tsx`, `Fireflies.tsx`, `Hummingbirds.tsx`

Cambios:
- [ ] Parallax más fino según mouse position
- [ ] Collision detection (opcional)
- [ ] Breathing animations
- [ ] Responsive scaling según viewport

**Impacto:** Decoraciones se sienten más vivas y naturales

### 8. Dark widgets polish (nav, music player)
**Componentes:** `GalleryNav.tsx`, `MusicPlayer.tsx`

Cambios:
- [ ] Glassmorphism refinement (blur + transparency tuning)
- [ ] Micro-interactions en botones
- [ ] Smooth transitions en estado (visible/hidden)
- [ ] Icon animations

**Impacto:** Widgets se sienten más premium

## Prioridad de implementación

1. **High priority** (MVP)
   - [ ] Botones interactivos (Button.tsx)
   - [ ] Transiciones entre páginas (PageTransition.tsx)

2. **Medium priority** (phase 2)
   - [ ] PhotoGallery hover effects
   - [ ] InvitationOpener animation
   - [ ] ScrollProgress refinement

3. **Nice to have** (phase 3)
   - [ ] ButterflyGame enhancements
   - [ ] Floating elements refinement
   - [ ] Sound effects

## Guía de implementación

### Patrón Framer Motion

```tsx
import { motion } from 'framer-motion';

export function MyComponent() {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(180, 112, 124, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      Click me
    </motion.button>
  );
}
```

### Tailwind v4 + Motion

```tsx
<motion.div
  className="bg-gradient-to-r from-[--accent] to-[--gold] backdrop-blur-lg"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>
```

### Testing

1. Run `npm run dev`
2. Test on mobile (DEV_ORIGIN)
3. Check `prefers-reduced-motion` compliance
4. Monitor performance (Lighthouse)

## Notas técnicas

- Todas las animaciones respetan `prefers-reduced-motion` (MotionConfig en layout.tsx)
- Duration típica: 150-400ms para micro-interactions
- Usar `ease: "easeOut"` para entrada, `ease: "easeInOut"` para transiciones
- Mobile-first: probar en 375px+ screens
- Performance: usar `transform` y `opacity` para animaciones (GPU-accelerated)

## Estado

- [ ] Phase 1 iniciado
- [ ] Phase 2 pendiente
- [ ] Phase 3 pendiente
