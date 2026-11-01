import { record } from "./capture.js";
const canvas = document.querySelector("#output"),
  ctx = canvas.getContext("2d"),
  backdrop = document.createElement("canvas");
backdrop.width = 960;
backdrop.height = 540;
const b = backdrop.getContext("2d");
const fill = b.createLinearGradient(0, 0, 960, 540);
fill.addColorStop(0, "#184c3b");
fill.addColorStop(0.5, "#83b5a2");
fill.addColorStop(1, "#e1cba0");
b.fillStyle = fill;
b.fillRect(0, 0, 960, 540);
for (let i = -4; i < 13; i++) {
  b.fillStyle = i % 2 ? "#0b302c" : "#c4dfc2";
  b.beginPath();
  b.moveTo(i * 120, 0);
  b.lineTo(i * 120 + 50, 0);
  b.lineTo(i * 120 + 340, 540);
  b.lineTo(i * 120 + 290, 540);
  b.fill();
}
b.fillStyle = "#faf1d7";
b.font = "bold 96px Georgia";
b.fillText("LUXLEAF", 195, 310);
Container.pageSnapshot = backdrop;
window.glassControls = {
  blurRadius: 1.4,
  edgeIntensity: 0.08,
  rimIntensity: 0.12,
  baseIntensity: 0.045,
  edgeDistance: 0.25,
  rimDistance: 0.7,
  baseDistance: 0.1,
  cornerBoost: 0.04,
  rippleEffect: 0.12,
};
const glass = [
  new Container({ borderRadius: 44, tintOpacity: 0.12 }),
  new Container({ type: "circle", borderRadius: 95, tintOpacity: 0.12 }),
];
glass.forEach((g, i) => {
  if (i) g.element.classList.add("small");
  document.querySelector("#host").append(g.element);
  g.updateSizeFromDOM();
  g.warp = true;
});
let t = 0,
  last = 0,
  paused = false;
const status = document.querySelector("[role=status]");
function frame(now) {
  t += !paused && last ? Math.min((now - last) / 1000, 0.05) : 0;
  last = now;
  ctx.drawImage(backdrop, 0, 0);
  let ready = true;
  glass.forEach((g, i) => {
    if (!g.webglInitialized) {
      ready = false;
      return;
    }
    const x = i ? 650 + 70 * Math.sin(t * 0.7) : 285 + 115 * Math.sin(t * 0.52),
      y = i ? 300 + 90 * Math.cos(t * 0.6) : 240 + 65 * Math.cos(t * 0.47);
    g.getPosition = () => ({ x, y });
    const gl = g.gl;
    gl.uniform1f(g.gl_refs.warpLoc, 1);
    g.render();
    ctx.save();
    ctx.shadowColor = "#071b1960";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 16;
    ctx.beginPath();
    ctx.roundRect(
      x - g.canvas.width / 2,
      y - g.canvas.height / 2,
      g.canvas.width,
      g.canvas.height,
      g.borderRadius,
    );
    ctx.clip();
    ctx.drawImage(g.canvas, x - g.canvas.width / 2, y - g.canvas.height / 2);
    ctx.restore();
  });
  if (ready && status.textContent === "Preparing glass renderer…")
    status.textContent = "Live refraction · curved rims · backdrop sampling";
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
document.querySelector("#pause").onclick = (e) => {
  paused = !paused;
  e.target.textContent = paused ? "Play motion" : "Pause motion";
};
document.querySelector("#record").onclick = async (e) => {
  const button = e.target;
  button.disabled = true;
  document.querySelector("#pause").disabled = true;
  paused = false;
  status.textContent = "Recording 10 seconds…";
  try {
    await record(canvas, "glass-ui-motion");
    status.textContent = "Saved actual glass recording";
  } catch (error) {
    status.textContent = String(error);
  } finally {
    button.disabled = false;
    document.querySelector("#pause").disabled = false;
    document.querySelector("#pause").textContent = "Pause motion";
  }
};
