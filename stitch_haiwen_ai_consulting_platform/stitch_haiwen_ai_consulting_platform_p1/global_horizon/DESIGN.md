# Design System Strategy: The Global Architect

## 1. Overview & Creative North Star
The design system is built upon the Creative North Star of **"The Global Architect."** In the intersection of AI globalization and ESG consulting, we do not simply provide data; we provide structural clarity and ethical foresight. 

This system moves away from the "disposable SaaS" aesthetic. Instead, it adopts a **High-End Editorial** approach. We break the rigid, predictable grid through intentional asymmetry, massive typographic contrast, and a "layered paper" philosophy. The interface should feel like a premium digital dossier—authoritative, spacious, and meticulously composed. We favor breathing room over density, ensuring every data point and call-to-action carries the weight of a strategic boardroom decision.

## 2. Colors & Surface Philosophy
The palette is rooted in a core professional blue (`primary: #004ac6`), supported by a sophisticated range of cool grays and architectural whites.

### The "No-Line" Rule
To achieve a premium editorial feel, **1px solid borders are strictly prohibited for sectioning.** We define boundaries through tonal transitions rather than structural lines. A section change is signaled by a shift from `surface` (#f7f9fb) to `surface_container_low` (#f2f4f6). This creates a seamless, "liquid" flow that feels modern and expensive.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create depth:
*   **Base Layer:** `surface` (#f7f9fb) for the main canvas.
*   **Secondary Content:** `surface_container_low` (#f2f4f6) for sidebar backgrounds or secondary sections.
*   **Floating Elements/Cards:** `surface_container_lowest` (#ffffff) to provide a crisp, elevated "paper" feel against the slightly darker background.
*   **Active Overlays:** `surface_container_highest` (#e0e3e5) for temporary states like drawer menus.

### The "Glass & Gradient" Rule
Flat color is the enemy of premium design. 
*   **Signature Gradients:** Use a subtle linear gradient for primary buttons and hero highlights, transitioning from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle.
*   **Glassmorphism:** For floating navigation bars or modal backdrops, use `surface` at 80% opacity with a `20px` backdrop-blur. This ensures the "Global Architect" aesthetic feels light and integrated, never heavy.

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance technological innovation with consulting stability.

*   **Display & Headlines (Manrope):** This geometric sans-serif acts as our architectural foundation. Use `display-lg` (3.5rem) with tight tracking (-0.02em) for hero statements to command attention.
*   **Body & UI (Inter):** Inter provides world-class legibility for complex ESG data. Use `body-md` (0.875rem) for the majority of text to maintain a professional, "white-paper" density.
*   **Hierarchy as Identity:** Create extreme contrast. Pair a `headline-lg` title with a `label-sm` (uppercase, tracked out +10%) subtitle. This "Big/Small" typographic rhythm is the hallmark of high-end editorial design.

## 4. Elevation & Depth
In this design system, depth is a function of light and shadow, not lines.

*   **The Layering Principle:** Avoid shadows where background shifts suffice. A `surface_container_lowest` card sitting on a `surface_container_low` background creates a "natural lift" that feels architectural.
*   **Ambient Shadows:** When a true "float" is required (e.g., a primary modal), use an ultra-diffused shadow. 
    *   *Formula:* `0px 24px 48px rgba(25, 28, 30, 0.06)`. The shadow color must be a tinted version of `on_surface` to mimic natural light.
*   **The "Ghost Border" Fallback:** If a container requires a boundary for accessibility (e.g., an input field), use the **Ghost Border**: `outline_variant` (#c3c6d7) at 20% opacity. Never use 100% opaque borders.
*   **Roundedness:** Adhere to a sophisticated radius scale. Use `md` (0.75rem) for standard cards and `xl` (1.5rem) for large hero containers or "pill" buttons to soften the professional blue.

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. White text (`on_primary`). `full` roundedness for a modern, SaaS-plus feel.
*   **Secondary:** Ghost style. No background, `outline` token at 20% opacity for the border. Text in `primary`.
*   **Tertiary:** No border or background. `primary` text. Use for low-priority actions like "Cancel" or "Learn More."

### Input Fields
*   **Styling:** `surface_container_lowest` background. Ghost border (`outline_variant` @ 20%).
*   **States:** On focus, transition the ghost border to `primary` at 100% and add a subtle `primary_fixed` (4px) outer glow.

### Cards & Lists
*   **Strict Rule:** No divider lines. Separate list items using `8px` of vertical whitespace or alternating subtle background shifts (`surface` to `surface_container_low`).
*   **Content:** Use `title-md` for headers and `body-sm` with `on_surface_variant` for metadata.

### Signature Component: The "ESG Pulse" Chip
*   For ESG and AI metrics, use chips with `secondary_container` (#d5e3fd) backgrounds and `on_secondary_container` (#57657b) text. Use `sm` (0.25rem) rounding to distinguish these from action buttons.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Place a large headline on the left with a significant amount of "dead" space on the right to create an editorial feel.
*   **Do** use "Tonal Nesting." Place a white card on a light gray background to define space.
*   **Do** prioritize typography over icons. Let the words and the scale carry the message.

### Don't
*   **Don't** use black (#000000) for text. Always use `on_surface` (#191c1e) for high contrast or `on_surface_variant` (#434655) for secondary text.
*   **Don't** use standard "drop shadows" (e.g., 0px 2px 4px). They feel cheap. Use Ambient Shadows only.
*   **Don't** use 1px dividers to separate sections. Use a `32px` or `64px` vertical gap and a background color shift.
*   **Don't** crowd the interface. If a screen feels "busy," increase the padding of the parent container by 50%.