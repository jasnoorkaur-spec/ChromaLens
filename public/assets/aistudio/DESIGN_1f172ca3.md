---
name: Universal Vision Chromatic Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#00788c'
  on-tertiary-container: '#d7f6ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is engineered for assistive intelligence, translating complex multi-variate visualizations, charts, and spatial maps into universally comprehensible structures for users across all forms of Color Vision Deficiency (protanopia, deuteranopia, tritanopia, and complete achromatopsia). 

The emotional signature is empowering, clinical, and precise. It rejects patronizing aesthetics in favor of a high-utility, scientific command deck. The design style synthesizes high-contrast utilitarianism with disciplined modern minimalism:
- **Dual-Encoded Semantics:** Color is never deployed as an isolated transmitter of information. Every chromatic state is coupled with distinct geometry, variable line dashes, or standardized hachure patterns.
- **Deep Navy & Slate Architecture:** Surfaces are built on deep, spectral-absorbing backgrounds that neutralize ambient glare and heighten perceptual luminance boundaries.
- **Tactile Structural Delimitation:** Crisp 1px borders define interactive and informational shells, avoiding soft, ambiguous visual bleeds.
- **Definitive High-Contrast Focal Affordances:** Piercing accents establish hierarchy instantly across dense data landscapes, guaranteeing optical legibility even under strict monochromatic viewing conditions.

## Colors

The chromatic architecture balances strict WCAG AAA luminance contrast (exceeding 7:1 for text and critical visual telemetry) with universal perceptual separation across simulation matrices:

- **Primary (`#2563EB` - Electric Cobalt):** Serves as the primary operational anchor, primary actions, and primary chart vector. Perceptually distinct in brightness and saturation across red-green color-blind profiles.
- **Secondary (`#F59E0B` - Warm Amber):** Delivers a high-luminance, warm counterbalance. Retains clear value distinction against cobalt for deuteranopes, protanopes, and tritanopes alike.
- **Tertiary (`#06B6D4` - High-Contrast Cyan):** An electric tertiary node providing immediate luminous punch against deep backgrounds, ideal for highlighted data segments, crosshairs, and dynamic AI overlays.
- **Neutral (`#0F172A` - Slate / Deep Navy Base):** A grounded, deep backdrop that maximizes contrast ratios for overlaid white typography (`#FFFFFF`), high-contrast slate surfaces (`#1E293B`, `#334155`), and structural borders (`#475569`).

### Accessible Mapping Rules
- **Achromatopsia Baseline:** In grayscale evaluation, Cobalt (`#2563EB`), Amber (`#F59E0B`), and Cyan (`#06B6D4`) step across distinct luminance brackets (Cobalt: low-mid luminance, Amber: mid-high luminance, Cyan: high luminance), preventing tone-merging.
- **Alert States:** Warnings pair amber with upward triangles; critical states pair high-luminance crimson (`#F43F5E`) with stop diamonds or diagonal hatching; verified states pair cyan/cobalt with check discs.

## Typography

Typography acts as a primary clarity tool, prioritizing immediate glyph disambiguation, tall x-heights, and distinct character apertures:

- **Primary Interface & Prose (`Inter`):** Selected for its neutral clarity, robust weight balance, and optimized rendering on dark interfaces. Features unambiguous differentiation between `1`, `l`, and `I`.
- **Data Visualizations, Telemetry & Tags (`JetBrains Mono`):** Applied across chart axes, data tooltips, coordinates, color translations, and pattern index labels. Monospaced character widths guarantee numerical alignment in high-density inspection panels.

### Typographic Accessibility Guidelines
- All body text enforces minimum contrast ratios of 7:1 against their container surfaces.
- Sub-12px typography is strictly restricted to secondary uppercase metric labels in `JetBrains Mono`.
- Interactive elements feature bold or medium weights to preserve legibility when rendered over patterned or tinted chart backdrops.

## Layout & Spacing

The layout is built for complex, tool-rich data exploration. It employs a responsive 12-column grid on desktop screens, collapsing gracefully into 8 columns on tablets and 4 columns on mobile viewports.

### Architectural Rules
- **Side-by-Side Analytics Canvas:** Desktop viewports allocate a persistent, spacious analysis canvas (minimum 8 columns) paired with a contextual assistive inspector sidebar (4 columns) to let users deconstruct visual artifacts without modal interruption.
- **Generous Touch and Hit Targets:** Spacing tokens prioritize generous tap regions (`space-md` inner padding, minimum bounding box of 44x44px) around micro-controls, swatches, and chart legends.
- **Data Density Management:** Charts maintain distinct internal margins (`space-lg`) to prevent dense telemetry strings from colliding with spatial graphics.

## Elevation & Depth

To protect users with visual impairments from ambiguous spatial cues, the design system discards standard diffuse shadows in favor of **Tonal Layering** and **Crisp Structural Outlines**:

- **Layer 0 (Canvas Base):** Deepest background (`#0A0F1D`), providing an unlit, absorption-layer canvas for maximum visual comfort.
- **Layer 1 (Card & Tool Surfaces):** Dark slate surface (`#0F172A`) framed with a continuous 1px solid border (`#334155`).
- **Layer 2 (Floating Inspect Panels & Flyouts):** Elevated slate (`#1E293B`) with a prominent 1px accent-tinted border (`#475569`) and an intentional 2px hard offset drop (`rgba(0, 0, 0, 0.6)`), avoiding soft visual halos that degrade sharp boundary detection.
- **Layer 3 (Modals & Overlays):** Deep solid backplates bounded by high-contrast primary cobalt borders (`#2563EB`) with a dimming backdrop scrim (`rgba(10, 15, 29, 0.85)`).

## Shapes

The design system uses a controlled roundedness scale of `1` (Soft - 0.25rem / 4px base radius). 

### Rationales
- **Crisp Data Geometry:** Tight corner radiuses prevent geometric distortion in data-heavy containers, side-by-side split screens, and tabular grids.
- **Structural Affordance:** Buttons, text fields, and inspector chips maintain sharp, legible boundaries without sliding into amorphous pill forms that can obscure text alignment.
- **Visual Encoding Alignment:** Data visualization markers (squares, diamonds, hexagons, triangles) maintain crisp geometric precision to prevent visual confusion when viewed at reduced sizes or degraded contrast.

## Components

### Buttons
- **Primary:** Electric Cobalt background (`#2563EB`), pure white bold text (`#FFFFFF`), 1px solid border (`#3B82F6`). On hover, brightens to `#1D4ED8` with a 2px high-contrast outer ring.
- **Secondary:** Transparent fill with a 1.5px Slate-400 border (`#94A3B8`), neutral-100 text (`#F8FAFC`). Includes an inline iconic glyph to ensure affordance is not dependent on fill weight alone.
- **Assistive Inspector Action:** Warm Amber fill (`#F59E0B`) with black text (`#000000`) for high-priority AI color translation triggers.

### Chips & Semantic Legends
- Every chart legend chip combines three mandatory cues:
  1. **Color Dot:** High-contrast tint.
  2. **Pattern/Shape Glyphs:** Embedded shape or hatching pattern (e.g., slash `/`, crosshatch `x`, dotted `•`, solid `■`).
  3. **Monospaced Data Label:** Hexadecimal code, color category name (e.g., "NAVY [P1]"), and simulated contrast metric.
- Interactive chips feature a visible checkbox glyph confirming active visibility.

### Lists & Telemetry Feeds
- Zebra striping is avoided in favor of 1px border dividers (`#1E293B`).
- List items feature dual-encoded status badges on the trailing edge (e.g., `[✓ Valid]` with Cyan border; `[! Alert]` with Amber border and dashed stroke).

### Checkboxes & Radio Buttons
- High-contrast border (2px `#94A3B8`).
- Selected states use vibrant cobalt background with heavy 2.5px white checkmark vectors or solid circular centers.
- Keyboard focus manifests as a persistent 3px offset outline in electric cyan (`#06B6D4`).

### Input Fields
- Deep charcoal background (`#0F172A`), inset 1px border (`#475569`), white text with high-contrast placeholder text (`#94A3B8`, meeting 4.5:1 minimum).
- Active state transitions the border to Electric Cobalt with an accompanying right-aligned icon signaling valid editing mode.

### Cards & Inspector Panels
- Solid container backings (`#1E293B`) framed by `#334155`.
- Dedicated header strip housing the panel's assistive mode icon, textual title, and keyboard shortcut badge (`JetBrains Mono`).

### Data Visualization Extensions (Assistive Visual Encoding)
- **Hatching Engine:** For bar and area charts, areas are styled with SVG patterned strokes (45-degree stripes, dense dots, cross-lines) paired with distinct fill colors.
- **Line Graphs:** Every line series pairs a unique color with a distinct stroke structure: solid, dashed (`8 4`), dotted (`2 4`), or dash-dot (`6 3 2 3`), coupled with geometric data points (circles, triangles, squares).
- **Interactive Color Pipette Tool:** An assistive AI hovering lens displaying magnified color swatches, simulated equivalents across the 4 CVD conditions, localized contrast values, and text annotations describing the underlying visual region.