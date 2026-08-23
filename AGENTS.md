# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable product and visual decisions

- The client-facing rental website is the primary product. The resource-based engine, admin schedule, and instructor view support that conversion experience rather than competing with it.
- The selected visual direction is the first high-fidelity “Neva Editorial” concept: editorial serif headlines, Manrope-like interface type, warm white, deep navy, steel blue, restrained champagne accents, cinematic Saint Petersburg photography, and a premium booking widget embedded into the hero.
- Customer complexity stays hidden: customers choose passengers, date, start time, and duration; they never choose a concrete boat or instructor.
- Mobile is a first-class composition around 390 px, with large touch targets, a full-screen booking flow, and a persistent primary CTA.
- Admin uses the same tokens but a clean operational SaaS treatment without lifestyle imagery.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
