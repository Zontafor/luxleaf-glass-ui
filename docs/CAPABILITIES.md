# Capability matrix — v0.2.0

### Optical foundation

The complete 13-file MIT reference is preserved. `/webgl` adapts its actual Container/Button shaders and parent-texture sampling; this is an optical renderer, not only CSS backdrop blur.

### LuxLeaf controls

Validated optical ranges, typed exports, a React adapter, keyboard interaction, disabled state, hierarchy cycle checks, explicit capture, context recovery and GPU/listener/timer disposal.

### Two rendering paths

The original CSS glass components remain available for ordinary UI. Optical surfaces use explicit permitted backdrop capture and exclude common editable/private elements.

### Remaining host verification

Backdrop capture is not a confidentiality boundary: the host must choose a permitted capture root. Cross-browser pixel equivalence, arbitrary nested reparenting and performance at high surface counts are not certified.

## What completeness means here

The scoped implementation, source distribution, tests and examples are reviewable in this repository. Preserving a full foundation tree does not mean every upstream application was reimplemented, every platform tested, or upstream authorship transferred. This release does not claim exact repository/API/visual parity or enterprise certification.
