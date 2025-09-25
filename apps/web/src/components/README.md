# Components Documentation

## About Page Components

### HeroParallax
A full-screen hero component with interactive parallax background effects.

**Features:**
- Mouse-following radial gradients
- Animated particle system
- Layered background effects
- Responsive design

**Usage:**
```tsx
<HeroParallax>
  <YourContent />
</HeroParallax>
```

### FounderCard
A 3D interactive card component showcasing the founder's information.

**Features:**
- 3D tilt effect on hover
- Glow animation
- Staggered entrance animations
- Achievement list with animated bullets
- "Ex Mr. India" badge
- Responsive design

**Props:**
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<FounderCard className="w-full max-w-sm" />
```

## Design Tokens Used

### Colors (Atelier Theme)
- `atelier-navy` (#0B2545) - Primary background
- `atelier-black` (#000000) - Secondary background
- `atelier-darkYellow` (#F6C85F) - Accent color
- `atelier-darkRed` (#B71C1C) - Primary action color

### Animations
- Entrance animations with staggered delays
- Hover effects with 3D transforms
- Parallax mouse-following effects
- Particle system with floating animations

## CSS Classes Added

### 3D Tilt Effect
```css
.founder-card-3d {
  transform-style: preserve-3d;
  transition: transform 0.3s ease-out;
}

.founder-card-3d:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.02);
}
```

### Custom Scrollbar
- Navy track with dark yellow thumb
- Hover effects for better UX

## Accessibility Features

- Proper ARIA labels on interactive elements
- Alt text for all images
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly content

## Responsive Breakpoints

- Mobile: Default styles
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)
- Large Desktop: `xl:` prefix (1280px+)

## Performance Optimizations

- Framer Motion for smooth animations
- Next.js Image optimization
- CSS transforms for hardware acceleration
- Efficient particle system with limited elements
