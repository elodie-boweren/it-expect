# Design System: C-137 Quantum Portal (Rick & Morty High-Fidelity Theme)

## Core Philosophy
- **Zero Unicode Emojis:** 100% monoline SVG vector icons (`currentColor`, 1.75px stroke) and monospace text indicators.
- **Rick & Morty Cyber-Scientific Aesthetic:**
  - Dark Matter & Deep Space Void (`#050811`, `#0a0f1d`, `#0f172a`)
  - Toxic Portal Neon Green (`#00ff88`, glowing emerald `#10b981`)
  - Rick's Lab Cyan (`#38bdf8`) & Morty's Hazard Yellow (`#facc15`)
  - Citadel Containment Crimson (`#ff3366`)
  - Dark Dimension Purple (`#a855f7`)
- **HUD & Telemetry Grid:** Microverse battery voltage, portal gun fluid levels, and dimensional timeline coordinates.

## Design Tokens (CSS Variables)

```css
:root {
  /* Galactic Void Backgrounds */
  --bg: #050811;
  --bg-subtle: #0a0f1d;
  --surface: #0f172a;
  --surface-hover: #16233b;
  --surface-active: #1e3152;
  
  /* Hardened Lab Borders */
  --border: #1e2e4a;
  --border-subtle: #142036;
  --border-focus: #00ff88;
  
  /* High-Contrast Typography */
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --text-faint: #475569;
  
  /* Primary Accent: Toxic Portal Emerald */
  --accent: #00ff88;
  --accent-hover: #00dd75;
  --accent-faint: rgba(0, 255, 136, 0.12);
  --accent-glow: rgba(0, 255, 136, 0.25);
  --accent-foreground: #022013;
  
  /* Rick & Morty Character & Status Palette */
  --danger: #ff3366;
  --danger-faint: rgba(255, 51, 102, 0.14);
  --warning: #facc15;
  --warning-faint: rgba(250, 204, 21, 0.14);
  --info: #38bdf8;
  --info-faint: rgba(56, 189, 248, 0.14);
  --portal-purple: #a855f7;
  --portal-purple-faint: rgba(168, 85, 247, 0.14);
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace;
  
  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

## Icon & HUD Standards
- 20x20, 18x18, or 16x16 monoline vector SVGs.
- Stroke width: 1.75px.
- `stroke="currentColor"` and `fill="none"`.
- Zero Unicode emojis anywhere.
