# Changelog

## 0.2.1 — 2026-11-01

- Keep refraction coordinates relative to the explicitly captured root and stabilize the workbench capture size.
- Avoid division by zero when blur is disabled; verify real RGB output and DOM backdrop capture.


## 0.2.0 — 2026-11-01

- Optical foundation: The complete 13-file MIT reference is preserved. `/webgl` adapts its actual Container/Button shaders and parent-texture sampling; this is an optical renderer, not only CSS backdrop blur.
- LuxLeaf controls: Validated optical ranges, typed exports, a React adapter, keyboard interaction, disabled state, hierarchy cycle checks, explicit capture, context recovery and GPU/listener/timer disposal.
- Two rendering paths: The original CSS glass components remain available for ordinary UI. Optical surfaces use explicit permitted backdrop capture and exclude common editable/private elements.
- Add source-inclusive package archives, foundation hash checks, and GitHub Packages publishing/consumer installation workflows.

## 0.1.0

Initial limited workbench release. It did not establish complete upstream parity.
