import {
  Container,
  Button,
  opticalRanges,
  captureBackdrop,
} from "../src/webgl";
import "../engine/glass.css";
import "./style.css";
const root = document.getElementById("root")!;
root.innerHTML =
  '<header><strong>LUXLEAF OPTICAL GLASS</strong></header><main><h1>Real refraction. Nested surfaces.</h1><p>Captured backdrop → container shader → nested button shader. All processing stays local.</p><div class="workspace"><section class="preview glass-scene" id="stage"><div class="orb one"></div><div class="orb two"></div><h2 style="padding:24px">Light, layered.</h2></section><aside class="controls" id="controls"></aside></div><p role="status" id="status">Preparing local backdrop…</p><button id="dispose">Dispose renderer</button> <a href="/checks-expanded.html">Run optical checks</a></main>';
async function start() {
  const stage = document.getElementById("stage")!;
  await captureBackdrop(document.body);
  const panel = new Container({ borderRadius: 28, tintOpacity: 0.25 });
  panel.element.style.cssText +=
    ";position:absolute;left:8%;top:32%;width:80%;height:180px;isolation:isolate";
  const button = new Button({
    text: "Open workspace",
    type: "pill",
    size: 18,
    onClick: () =>
      (document.getElementById("status")!.textContent =
        "Optical button activated"),
  });
  stage.append(panel.element);
  panel.addChild(button);
  panel.updateSizeFromDOM();
  const controls = document.getElementById("controls")!;
  for (const key of [
    "edgeIntensity",
    "rimIntensity",
    "blurRadius",
    "rippleEffect",
    "tintOpacity",
  ] as const) {
    const [min, max] = opticalRanges[key],
      label = document.createElement("label"),
      input = document.createElement("input");
    label.textContent = key;
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String((max - min) / 100);
    input.value = String(key === "blurRadius" ? 5 : (max + min) / 2);
    input.setAttribute("aria-label", key);
    input.oninput = () => {
      panel.updateControls({ [key]: Number(input.value) });
      button.updateControls({ [key]: Number(input.value) });
    };
    label.append(input);
    controls.append(label);
  }
  document.getElementById("status")!.textContent = "Optical pipeline active";
  document.getElementById("dispose")!.onclick = () => {
    panel.destroy();
    document.getElementById("status")!.textContent =
      "Renderer disposed; GPU resources and listeners released";
  };
}
start().catch(
  (error) => (document.getElementById("status")!.textContent = String(error)),
);
