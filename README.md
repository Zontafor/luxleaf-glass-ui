# LuxLeaf Glass UI

Accessible native controls and panels with configurable blur, tint, borders and optional local SVG refraction.

**Private v0.1.0 product release.** Original LuxLeaf code is proprietary to Michelle L. Wu. Licensed foundations retain their own rights. This is a functional initial product with an explicit supported scope; it is not a full replacement for the upstream ecosystem.

## Run the workbench

```sh
npm ci --ignore-scripts
npm run verify
npm run dev -- --port 4175
```

Use Node 22.12+ (Node 24 recommended). Open the local URL printed by Vite. The demo includes live settings, reset and preset import/export. GPU products also export PNG. Nothing is sent to a server by the demo. Vite binds to loopback by default.

## Use the private package

Build and create an installable archive:

```sh
npm run build
npm pack
# In an authorized consumer project:
npm install /absolute/path/to/luxleaf-glass-ui-0.1.0.tgz
```

ES modules and TypeScript declarations are included. This package is intentionally marked `private: true`; no public npm publication is configured. Use one compatible React installation in the consumer. Browser components must run on the client; construction of imperative renderers requires the DOM. A preset is data, not executable code.

```tsx
import { GlassPanel, GlassButton } from '@luxleaf/glass-ui';

export function WorkspaceCard() {
  return <GlassPanel options={{ blur: 16 }} style={{ padding: 24 }}>
    <h2>Knowledge workspace</h2>
    <GlassButton onClick={() => console.log('Open workspace')}>
      Open workspace
    </GlassButton>
  </GlassPanel>;
}
```

## API

| Export | Contract |
|---|---|
| `GlassPanel` | Native div attributes plus `options`; custom `style` overrides defaults. |
| `GlassButton` | Native button attributes plus `options`; default type is `button`, native disabled semantics preserved. |
| `glassStyle(options, filterId?)` | Validated React CSS style object. |
| `mountGlass(element, options)` | Imperative adapter returning `update(partial)` and idempotent `destroy()`. |
| `validate`, `serialize`, `deserialize`, `defaults` | Strict configuration boundary and JSON preset helpers. |

`GlassOptions`: tint (six-digit hex), opacity (0–1), blur (0–30 px), radius (0–100 px), refraction (0–30), border (0–1), shape (`rounded`, `pill`, `circle`). A circle needs equal dimensions from the host. React options are complete declarative state; omitted values use defaults. The imperative adapter merges partial updates. `destroy()` removes its filter and restores the pre-mount inline style, including replacing any host edits made to that style while mounted.

All numeric fields must be finite and in range. Unknown configuration keys are rejected, and JSON input is limited to 16 KiB. Presets use the v0.1 schema; there is no version-migration promise yet. Exported defaults should be treated as immutable.

## Quality and operations

`npm run verify` checks TypeScript, runs 8 unit tests and builds both library and demo. `/checks.html` exposes 6 actual browser integration assertions; open it in the local server and press **Run checks**. Browser checks are manual and are not represented as automated CI coverage. See [validation](docs/VALIDATION.md) for evidence and limits.

- [Architecture and lifecycle](docs/ARCHITECTURE.md)
- [Capability comparison and known gaps](docs/CAPABILITIES.md)
- [Private release procedure](docs/RELEASING.md)
- [Research and provenance](docs/PROVENANCE.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Security reporting and data handling](SECURITY.md)

The demo is a workbench for this package. Authentication, tenancy, persistence, payments and deployment infrastructure belong to the integrating application and are not supplied by this browser library.
