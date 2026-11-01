# Glass UI motion demonstration

Rounded and circular glass lenses move over a geometric backdrop using the actual licensed Container shader, including curved-rim refraction and blur.

## Run

Use the repository's normal installation instructions first, then run from its root:

```sh
python3 -m http.server 4385 --bind 127.0.0.1
```

Open http://localhost:4385/.luxleaf/motion/. **Pause motion** freezes the composition. **Record video** captures about ten seconds of the rendered canvas to a local WebM file. No screen, microphone or external upload is involved. Keep the preview visible while recording.

[MP4](../media/glass-ui-motion.mp4) · [Animated preview](../media/glass-ui-motion.gif) · [Capture record](../media/glass-ui-motion.json)

The capture record reports measured duration, dimensions, frame count, SHA-256 and the mean pixel difference between seconds 1 and 8. H.264 MP4 is encoded at 30 fps from the actual WebM recording; this is not a measured rendering-performance claim. The GIF is a shorter preview and is not promised to loop seamlessly.

## Scope

This composition is a focused demonstration, not coverage of every API or integration. All pinned original source files remain unchanged. LuxLeaf's composition and recording controls live under `.luxleaf/motion/`; the original renderer retains its license and attribution.

The glass demo supplies an original canvas backdrop to `Container.pageSnapshot`, moves two Container instances through backdrop coordinates, and composites their actual WebGL canvases. Rounded clipping follows their DOM border radii. It does not represent arbitrary-page DOM capture or nested-button coverage.
