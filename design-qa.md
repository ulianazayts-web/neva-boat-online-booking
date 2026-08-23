# Design QA

## Comparison target

- Source visual truth: `/Users/uliana_zayts/.codex/generated_images/01a02e91-9e2b-76b3-81ca-51951f170b5b/exec-b924e814-0666-484c-af74-a49accf957ed.png`
- Browser-rendered implementation: `/Users/uliana_zayts/Documents/Codex/2026-08-23/figma-plugin-figma-openai-curated-remote/work/qa/implementation-desktop-final-v3.png`
- Mobile home evidence: `/Users/uliana_zayts/Documents/Codex/2026-08-23/figma-plugin-figma-openai-curated-remote/work/qa/implementation-mobile-home.png`
- Mobile booking evidence: `/Users/uliana_zayts/Documents/Codex/2026-08-23/figma-plugin-figma-openai-curated-remote/work/qa/implementation-mobile-flow.png`
- Full-view combined comparison: `/Users/uliana_zayts/Documents/Codex/2026-08-23/figma-plugin-figma-openai-curated-remote/work/qa/desktop-comparison-final-v3.png`
- Focused hero comparison: `/Users/uliana_zayts/Documents/Codex/2026-08-23/figma-plugin-figma-openai-curated-remote/work/qa/desktop-focus-final-v3.png`

## Viewport and normalization

- Intended desktop viewport: 1440 × 1024 CSS px, device scale factor 1.
- Browser content capture: 1425 × 1013 px because the in-app browser reserves its own frame/scrollbar area.
- Source image: 1487 × 1058 px.
- Desktop source was normalized with a cover-fit crop to 1425 × 1013 px before the side-by-side comparison; implementation remained at native capture size.
- Intended mobile viewport: 390 × 844 CSS px.
- Browser content capture: 375 × 812 px after the in-app browser’s frame reservation.
- State compared: client homepage hero, default passenger/date/duration selection, booking widget visible.

## Required fidelity surfaces

- Fonts and typography: passed. Cormorant Garamond reproduces the editorial display character and Cyrillic support; Manrope keeps form controls, dates, prices, and dense operations UI legible. Headline scale, line height, and optical contrast match the selected direction without clipping at desktop or mobile.
- Spacing and layout rhythm: passed. Desktop preserves the split hierarchy of headline, panoramic photography, and elevated booking widget. Mobile is recomposed rather than compressed: the widget becomes a full-screen flow, tap targets remain large, and the primary CTA stays persistent.
- Colors and visual tokens: passed. Warm white, deep navy, steel blue, muted blue-gray, and restrained champagne are consistently tokenized across customer, case-study, admin, and instructor surfaces. Selected, disabled, focus, error, loading, Hold, and success states are distinguishable and accessible.
- Image quality and asset fidelity: passed. Three production-resolution raster assets use one cohesive Saint Petersburg art direction. No placeholder, CSS drawing, handcrafted SVG, emoji, or unrelated stock imagery substitutes a visible source asset.
- Copy and content: passed. Customer copy is entirely Russian, transparent on price, does not ask for passport data, does not expose resource complexity, and marks capacities and prepayment as Demo/TBD where required.
- Icons: passed. Phosphor Icons provides one consistent stroke family; icons are aligned and never used as decorative emoji.
- Accessibility and resilience: passed. Semantic buttons, labelled controls, alt text, visible focus rings, reduced-motion support, 44+ px mobile targets, and legible contrast are present. No persistent control is hidden by overflow at the tested breakpoints.

## Full-view comparison evidence

The final side-by-side comparison shows the same dominant hierarchy as the selected source: white editorial headline on the left, premium Neva photography, a warm-white booking interface on the right, restrained navigation, and the next section beginning below the fold. The implementation adds Product Case and Admin navigation because those are required prototype surfaces; this does not change the customer-site-first hierarchy.

## Focused-region evidence

The focused hero comparison confirms matching component anatomy: passenger stepper, date select, four duration states, half-hour time grid, primary action, and automatic-allocation reassurance. The implementation’s widget is intentionally more compact to keep the complete interactive state visible across the 1440 and 390 layouts.

## Comparison history

### Iteration 1

- [P2] Hero photography was too dark compared with the source, reducing the premium summer atmosphere.
  - Fix: reduced the solid navy overlay opacity from 0.36 to 0.29.
  - Post-fix evidence: `implementation-desktop-final.png` and later captures show restored architecture and water detail while preserving white-text contrast.
- [P2] The generated boat and people were mostly hidden behind the booking widget.
  - Fix: changed the desktop hero crop to enlarge and translate the real raster asset left, while leaving the successful mobile crop untouched.
  - Post-fix evidence: `implementation-desktop-final-v3.png` and `desktop-focus-final-v3.png` show the boat and driver between the headline and booking widget.

### Final pass

- No actionable P0, P1, or P2 differences remain.
- P3: desktop navigation contains two additional prototype links versus the source mock. This is an accepted product extension for fast reviewer access to the case and admin views.

## Functional verification

- Desktop homepage opened and visually inspected.
- Mobile homepage inspected at the 390 px breakpoint.
- Passenger, date, duration, and valid start-time selection tested.
- Required name and phone validation tested.
- 10-minute Hold state verified.
- Mock payment completed and success state verified.
- New online booking appeared in the shared in-memory schedule.
- Manual booking creation verified in Admin.
- Invalid boat reassignment produced the expected 30-minute-buffer conflict warning.
- Future staffing commitment with `instructor TBD` was visible.
- Instructor read-only schedule was opened and verified.
- Eight availability-engine tests passed, including lead time, limiting instructor capacity, smallest suitable boat, buffers, technical blocks, operating hours, future staffing, and manual-booking impact.
- Browser console warnings/errors checked after the final pass: none.

## Follow-up polish

- Optional P3: add one more photographic mobile crop for the occasions section if the case is later expanded beyond the current MVP presentation.

final result: passed
