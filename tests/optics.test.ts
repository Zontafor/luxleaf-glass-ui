import test from "node:test";
import assert from "node:assert/strict";
import {
  validateOptics,
  opticalRanges,
  Container,
  Button,
} from "../engine/index.js";
test("all optical controls accept zero where documented and reject overflow", () => {
  for (const [key, [min, max]] of Object.entries(opticalRanges)) {
    assert.equal((validateOptics({ [key]: min }) as any)[key], min);
    assert.throws(() => validateOptics({ [key]: max + 1 }));
    assert.throws(() => validateOptics({ [key]: NaN }));
  }
});
test("optics rejects unknown executable keys and malformed structures", () => {
  assert.throws(() => validateOptics({ shader: "evil" }));
  assert.throws(() => validateOptics([]));
  assert.throws(() => validateOptics(null));
});
test("full optical hierarchy and lifecycle methods are exported", () => {
  assert.equal(Object.getPrototypeOf(Button.prototype), Container.prototype);
  for (const name of [
    "addChild",
    "removeChild",
    "updateSizeFromDOM",
    "updateControls",
    "destroy",
  ])
    assert.equal(typeof (Container.prototype as any)[name], "function");
});

test("invalid constructor inputs fail before creating DOM or GPU state", () => {
  for (const options of [
    { borderRadius: -1 },
    { borderRadius: NaN },
    { type: "arbitrary" },
    { tintOpacity: 2 },
  ])
    assert.throws(() => new Container(options as any), /Invalid/);
  assert.throws(() => new Button({ size: Infinity }), /Invalid/);
});

test("capture-root coordinates do not include unrelated page offsets", () => {
  const old = Container.captureRoot;
  try {
    Container.captureRoot = {
      getBoundingClientRect: () => ({ left: 80, top: 120 }),
    } as any;
    const position = (Container.prototype as any).getPosition.call({
      canvas: {
        getBoundingClientRect: () => ({
          left: 100,
          top: 150,
          width: 40,
          height: 60,
        }),
      },
    });
    assert.deepEqual(position, { x: 40, y: 60 });
  } finally {
    Container.captureRoot = old;
  }
});
