# VoyageAI Premium Immersive Redesign

## Goal
Transform the uploaded VoyageAI application into a cinematic, premium travel operating system while preserving all existing routes, data, interactions, accessibility fallbacks, and working flows. The current project already contains all requested routes and strong mock interactions, but its globe is simulated on a flat canvas, several trip details are disconnected from the selected trip, and the visual language still relies heavily on conventional bordered panels.

## What will be preserved
- Every current route: Home, Discover, Planner, My Trips, Trip Detail, Layover, Visa, Budget, Matchmaker, and Profile.
- Existing destination filters, planner steps, budget controls, matchmaker sliders, layover calculations, visa checks, trip tabs, profile controls, error pages, motion preferences, and keyboard-accessible alternatives.
- Existing travel content and local demo data unless a correction is required for consistency.

## Build sequence

### 1. Import and stabilize the existing project
- Replace the blank starter with the uploaded VoyageAI source, excluding repository metadata.
- Keep the existing routing structure and media.
- Resolve formatting, import, typing, navigation, and current interaction defects before visual work.
- Connect trip-specific flight, layover, visa, and route-map content to the selected trip instead of showing Tokyo data for every trip.
- Cancel stale planner, layover, and visa processing sequences when inputs change or pages unmount.
- Make passport selection affect visa results and consolidate duplicated visa information.

### 2. Establish the premium visual system
- Refine the existing deep-midnight token system with near-black spatial layers, controlled electric blue and cyan, restrained violet, and selective warm destination accents.
- Upgrade typography, spacing, lighting, depth shadows, glass restraint, focus states, and motion curves as one coherent system.
- Preserve the dark identity while reducing the current “outlined panel everywhere” appearance.
- Add an adaptive effects budget for desktop, mobile/touch, low-power layouts, and reduced-motion users.

### 3. Build the signature globe experience
- Add React Three Fiber, Three.js, and supporting tools compatible with React 19.
- Replace the simulated homepage sphere with a true WebGL globe: restrained atmospheric shell, destination nodes, curved routes, sparse particles, layered lighting, and subtle cursor-linked camera response.
- Keep rotation controlled and slow; no game-like controls, uncontrolled spinning, or neon spectacle.
- Load the scene only in the browser, lazy-load it, cap pixel density, share one animation loop, and provide a polished static/mobile fallback.
- Reuse the globe foundation for the planner destination picker and selected geographic moments rather than adding heavy scenes everywhere.

### 4. Recompose the homepage as a six-scene journey
- Create the full-height cinematic hero with the required headline and an embedded, spatial planner command surface.
- Stage foreground interface details, the midground globe, atmospheric background, and deep spatial field without obscuring the primary action.
- Build the requested scroll narrative: Explore the World → Plan Your Journey → Optimize Your Route → Turn Layovers Into Experiences → Build Your Complete Journey → Your Travel Command Center.
- Use intentional depth, image parallax, scene transitions, and a connected modular command-center composition rather than repeated card grids.
- Keep the next scene visible at the hero edge and simplify layers intentionally on mobile.

### 5. Redesign every product surface
- **Navigation:** floating desktop navigation with active movement and a purpose-built mobile travel dock/sheet.
- **Discover:** editorial destination canvas with large imagery, depth carousel, progressive filtering, spatial hover, and full-screen destination moments.
- **Planner:** instrument-like command interface with route, timing, budget, travellers, pace, interests, style, and natural-language intent; cinematic cancellable analysis sequence.
- **Layover:** animated origin–hub–destination route, ground timeline, dynamic deductions, and a strong safe-to-explore/stay-airside reveal.
- **Visa:** trustworthy atlas/passport composition with responsive geographic context, complete requirement facts, source, verification, and update status.
- **Trip Dashboard:** one cohesive journey space with trip overview, route visualization, itinerary, map-like view, health, budget, readiness, flights, layover, and visa context.
- **Itinerary:** connected path timeline with expandable activities and working edit, move, and optimize affordances.
- **Matchmaker:** live preference controls with image transitions, animated ranking, and match percentage.
- **Budget:** responsive allocation visualization, health states, category controls, and a working “make this trip cheaper” optimization sequence.
- **Profile / My Trips:** retain existing controls while bringing both into the same spatial system.

### 6. Interaction, accessibility, and performance pass
- Refine the custom cursor with a restrained light trail, magnetic targets, and Explore/View/Drag/Plan states; disable it for touch and reduced motion.
- Add fast page transitions, branded route/loading sequences, scroll reveals, subtle tilt, and pointer depth only where they improve hierarchy.
- Consolidate animation work so multiple decorative layers do not compete for processing time.
- Preserve keyboard use, visible focus, semantic headings, accessible alternatives to visual canvases, and readable contrast.
- Optimize media loading and verify that mobile does not inherit the full desktop effects stack.

### 7. Verification
- Check every route at desktop and mobile sizes.
- Exercise filters, sliders, planner generation, trip tabs, layover analysis, visa selection, budget optimization, mobile navigation, cursor states, and reduced-motion fallbacks.
- Verify the real 3D scene renders, moves subtly, and never blocks the page if WebGL is unavailable.
- Resolve all build, runtime, console, network, layout-overlap, and navigation issues before completion.

## Technical details
- TanStack Start and the current file-based routes remain unchanged in principle.
- React Three Fiber/Three.js will be client-only and dynamically loaded; no remote environment files or runtime CDN dependency.
- Motion remains the primary interface animation system; Lenis stays only if it continues to provide measurable value after the animation loops are consolidated.
- Existing local demo data remains the source of truth; no account system or database is added because none was requested.
- All visual values remain semantic tokens in the central design system; canvas/WebGL colors will derive from the same palette.
