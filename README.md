# LuxLeaf Glass UI

Accessible glass components and a real optical pipeline with nested GPU refraction.

Version **0.2.0** expands the initial workbench into a broader package. Original LuxLeaf additions are proprietary to **Michelle L. Wu**. The included licensed foundations retain their own licenses and attribution. Public source visibility does not grant a license to LuxLeaf's proprietary additions.

## Workbench

```sh
npm ci --ignore-scripts
npm run verify
npm run verify:package
npm run dev
```

Use Node 24+. Open `/advanced.html` for the expanded studio, `/` for the compact demonstration, and `/checks-expanded.html` for real browser acceptance checks. These pages run locally. Consumer applications must supply authentication, tenancy and deployment controls appropriate to their use.

## Install

The scoped package is `@zontafor/luxleaf-glass-ui`. GitHub Packages requires registry authentication even for public npm packages. Configure your own GitHub credential outside source control, then:

```sh
npm install @zontafor/luxleaf-glass-ui@0.2.0 --registry=https://npm.pkg.github.com
```

GitHub Release `.tgz` attachments provide a separate installable archive. A release attachment alone is not proof of registry publication. See [release procedure](docs/RELEASING.md) for verification commands and the distinction between repository and package visibility.

## Package entry points

| Import suffix | Distributed implementation |
|---|---|
| `.` | `./dist/index.js` |
| `./webgl` | `./dist/webgl.js` |
| `./webgl.css` | `./engine/glass.css` |

## Implemented scope

### Optical foundation

The complete 13-file MIT reference is preserved. `/webgl` adapts its actual Container/Button shaders and parent-texture sampling; this is an optical renderer, not only CSS backdrop blur.

### LuxLeaf controls

Validated optical ranges, typed exports, a React adapter, keyboard interaction, disabled state, hierarchy cycle checks, explicit capture, context recovery and GPU/listener/timer disposal.

### Two rendering paths

The original CSS glass components remain available for ordinary UI. Optical surfaces use explicit permitted backdrop capture and exclude common editable/private elements.

### Remaining host verification

Backdrop capture is not a confidentiality boundary: the host must choose a permitted capture root. Cross-browser pixel equivalence, arbitrary nested reparenting and performance at high surface counts are not certified.

## Verification

The current suite includes **12 unit/integration tests**. The expanded browser page contains **10 assertions**, run separately from headless CI. These counts describe specific checks, not proof of exact feature, pixel or performance parity with another product. See [validation](docs/VALIDATION.md) for evidence and known limits.

The repository includes source, tests, runnable examples, build configuration, architecture notes, dependency notices and release workflows. The npm archive includes source and examples alongside JavaScript and declarations. It intentionally excludes installed dependencies, credentials and local user media.

- [Capability matrix](docs/CAPABILITIES.md)
- [Architecture and lifecycle](docs/ARCHITECTURE.md)
- [Provenance](docs/PROVENANCE.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Security and supported deployment](SECURITY.md)
