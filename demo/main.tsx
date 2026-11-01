import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GlassPanel,
  GlassButton,
  defaults,
  validate,
  serialize,
  deserialize,
  type GlassOptions,
} from "../src/index";
import "./style.css";
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function App() {
  const [options, setOptions] = useState(defaults),
    [message, setMessage] = useState("Ready for your ideas."),
    [draft, setDraft] = useState(""),
    [ready, setReady] = useState("ready");
  const renderer = useRef<unknown | null>(null);
  function change(p: Partial<GlassOptions>) {
    setOptions(validate({ ...options, ...p }));
  }
  return (
    <>
      <header>
        <strong>
          LUXLEAF <small>VISUAL SYSTEMS</small>
        </strong>
        <span className="badge">GLASS-UI / 01</span>
      </header>
      <main>
        <div className="intro">
          <div>
            <small>DESIGN ENGINEERING</small>
            <h1>Clarity, with depth.</h1>
          </div>
          <p>
            Translucent surfaces that keep the content in focus. Tune the tint,
            texture, and light.
          </p>
        </div>
        <div className="workspace">
          <section className="preview" aria-label="Live visual preview">
            <div className="glass-scene">
              <div className="orb one" />
              <div className="orb two" />
              <GlassPanel
                options={options}
                style={{ padding: 32, maxWidth: 380, margin: "70px auto" }}
              >
                <span className="badge">YOUR WORKSPACE</span>
                <h2>Room to think.</h2>
                <p style={{ color: "#fff" }}>
                  A calm surface for your next idea.
                </p>
                <GlassButton
                  options={{ ...options, shape: "pill" }}
                  onClick={() => setMessage("Glass button activated")}
                >
                  Open workspace
                </GlassButton>
                <GlassButton
                  disabled
                  options={options}
                  style={{ marginTop: 12 }}
                >
                  Unavailable
                </GlassButton>
              </GlassPanel>
            </div>
          </section>
          <aside className="controls" aria-label="Visual settings">
            <label>
              Shape
              <select
                value={options.shape}
                onChange={(e) =>
                  change({ shape: e.target.value as GlassOptions["shape"] })
                }
              >
                <option value="rounded">Rounded</option>
                <option value="pill">Pill</option>
                <option value="circle">Circle</option>
              </select>
            </label>
            <label>
              Tint
              <input
                type="color"
                value={options.tint}
                onChange={(e) => change({ tint: e.target.value })}
              />
            </label>
            <label>
              Opacity · {options.opacity}
              <input
                aria-label="Opacity"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.opacity}
                onChange={(e) => change({ opacity: Number(e.target.value) })}
              />
            </label>
            <label>
              Blur · {options.blur}
              <input
                aria-label="Blur"
                type="range"
                min={0}
                max={30}
                step={0.1}
                value={options.blur}
                onChange={(e) => change({ blur: Number(e.target.value) })}
              />
            </label>
            <label>
              Radius · {options.radius}
              <input
                aria-label="Radius"
                type="range"
                min={0}
                max={100}
                step={1}
                value={options.radius}
                onChange={(e) => change({ radius: Number(e.target.value) })}
              />
            </label>
            <label>
              Refraction · {options.refraction}
              <input
                aria-label="Refraction"
                type="range"
                min={0}
                max={30}
                step={0.1}
                value={options.refraction}
                onChange={(e) => change({ refraction: Number(e.target.value) })}
              />
            </label>
            <label>
              Border · {options.border}
              <input
                aria-label="Border"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.border}
                onChange={(e) => change({ border: Number(e.target.value) })}
              />
            </label>
            <button onClick={() => setOptions(defaults)}>Reset settings</button>
          </aside>
        </div>
        <div className="notes">
          <div>
            <strong>Considered by default</strong>
            <p>Native controls retain keyboard and focus behavior.</p>
          </div>
          <div>
            <strong>Your configuration</strong>
            <p>
              Settings are validated before rendering. Save a preset for another
              surface.
            </p>
            <button
              onClick={() => {
                const data = serialize(options);
                setDraft(data);
                download(
                  new Blob([data], { type: "application/json" }),
                  "luxleaf-preset.json",
                );
                setMessage("Preset exported");
              }}
            >
              Export preset
            </button>
          </div>
          <div>
            <strong>Private by design</strong>
            <p>No analytics or uploads. The demo runs on this device.</p>
            <output role="status">
              {message} · renderer {ready}
            </output>
          </div>
        </div>
        <details>
          <summary>Import a preset</summary>
          <textarea
            aria-label="Preset JSON"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
          <button
            onClick={() => {
              try {
                setOptions(deserialize(draft));
                setMessage("Preset imported");
              } catch (error) {
                setMessage((error as Error).message);
              }
            }}
          >
            Apply preset
          </button>
        </details>
      </main>
      <footer>
        Original LuxLeaf product · © 2026 Michelle L. Wu · Private development
        preview
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
