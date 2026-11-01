import { Container, Button, captureBackdrop } from "../src/webgl";
import "../engine/glass.css";
const output = document.querySelector("#result")!;
const lines: string[] = [];
function check(name: string, value: unknown) {
  if (!value) throw new Error(name);
  lines.push("PASS " + name);
  output.textContent = lines.join("\n");
}
const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
document.querySelector("#run")!.addEventListener("click", async () => {
  lines.length = 0;
  try {
    await run();
    output.textContent = lines.join("\n") + "\nALL PASSED: " + lines.length;
  } catch (error) {
    output.textContent = lines.join("\n") + "\nFAILED: " + String(error);
  }
});
async function run() {
  const backdrop = document.createElement("div");
  backdrop.style.cssText =
    "position:fixed;left:80px;top:100px;width:40px;height:40px;background:rgb(204,20,30)";
  document.body.append(backdrop);
  try {
    const captured = await captureBackdrop(backdrop),
      pixel = captured.getContext("2d")!.getImageData(20, 20, 1, 1).data;
    check(
      "explicit capture preserves chosen backdrop colors",
      captured.width === 40 &&
        pixel[0] === 204 &&
        pixel[1] === 20 &&
        pixel[2] === 30,
    );
  } finally {
    backdrop.remove();
    Container.captureRoot = null;
  }

  const snapshot = document.createElement("canvas");
  snapshot.width = innerWidth;
  snapshot.height = innerHeight;
  const ctx = snapshot.getContext("2d")!;
  ctx.fillStyle = "#174d40";
  ctx.fillRect(0, 0, snapshot.width, snapshot.height);
  ctx.fillStyle = "#d4b85e";
  ctx.fillRect(0, 0, snapshot.width / 2, snapshot.height);
  Container.pageSnapshot = snapshot;
  const parent = new Container({ borderRadius: 20 });
  parent.element.style.cssText +=
    ";position:fixed;left:10px;top:200px;width:380px;height:180px;isolation:isolate";
  document.body.append(parent.element);
  const button = new Button({
    text: "Nested",
    size: 18,
    type: "pill",
    onClick: () => clicked++,
  });
  let clicked = 0;
  parent.addChild(button);
  try {
    parent.updateSizeFromDOM();
    for (let i = 0; i < 40 && !parent.webglInitialized; i++) await wait();
    for (let i = 0; i < 40 && !button.gl_refs.program; i++) await wait();
    check(
      "parent WebGL shader compiles",
      parent.webglInitialized && parent.gl_refs.program,
    );
    check(
      "nested child compiles a separate optical shader",
      button.gl_refs.program,
    );
    check("nested relationship is established", button.parent === parent);
    parent.updateControls({ blurRadius: 0, edgeIntensity: 0.02 });
    button.updateControls({ rimIntensity: 0.1 });
    check(
      "GPU accepts live optical uniforms",
      parent.gl.getError() === 0 && button.gl.getError() === 0,
    );
    const pixels = new Uint8Array(
      parent.canvas.width * parent.canvas.height * 4,
    );
    parent.gl.readPixels(
      0,
      0,
      parent.canvas.width,
      parent.canvas.height,
      parent.gl.RGBA,
      parent.gl.UNSIGNED_BYTE,
      pixels,
    );
    check(
      "optical output has visible pixels",
      pixels.some((v, i) => i % 4 === 3 && v > 0) &&
        pixels.some((v, i) => i % 4 !== 3 && v > 0 && v < 250),
    );
    button.element.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    check("keyboard activation reaches callback", clicked === 1);
    button.disabled = true;
    button.element.click();
    check("disabled optical button blocks activation", clicked === 1);
    parent.destroy();
    check(
      "recursive cleanup removes both instances",
      !Container.instances.includes(parent) &&
        !Container.instances.includes(button),
    );
    check(
      "destroyed instance rejects updates",
      (() => {
        try {
          parent.updateControls({ blurRadius: 1 });
          return false;
        } catch {
          return true;
        }
      })(),
    );
    parent.destroy();
    check("cleanup is idempotent", parent.disposed);
  } finally {
    parent.destroy();
  }
}
