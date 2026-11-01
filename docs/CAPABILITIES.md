# Supported scope and comparison

This is a LuxLeaf product, not a renamed fork or drop-in upstream replacement. Similarity in purpose does not imply API, visual, performance or ecosystem parity.

| Capability | Implementation and evidence |
|---|---|
| Live glass panels/buttons | React and imperative APIs; DOM tests verify filters, updates and disposal. |
| Native keyboard and disabled semantics | Native button element; SSR and browser checks. Host supplies suitable focus/contrast styling. |
| Configurable blur/tint/shape | Validated options, live control demo and round-trip presets. |
| Refraction | Local SVG enhancement; visual result varies by browser. |
| Captured-page WebGL refraction | Not implemented; architecture uses native backdrop composition. |
| Original project's full optical behavior | No drop-in or pixel-parity claim. |

## Release acceptance

A v0.1 release requires passing type checks, unit tests, production build, package-content review, a fresh package consumer import and the documented browser checks. The private repository must contain source, demo, lockfile, CI, notices and architecture documentation. A release tag must point to the reviewed source commit.

## Before a broader production rollout

Validate the host application's accessibility and authorization independently. Test the actual target Chrome, Safari, Firefox, mobile and GPU fleet. Establish measured frame-time and memory budgets under intended concurrency. Add browser checks to the organization's browser CI infrastructure. No load/SLA, cross-browser certification, independent security audit or exact upstream parity is claimed by this initial release.
