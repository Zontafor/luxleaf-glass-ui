import React, { useId } from "react";
import { number, color, object, parseJSON } from "./validation.js";
export interface GlassOptions {
  tint: string;
  opacity: number;
  blur: number;
  radius: number;
  refraction: number;
  border: number;
  shape: "rounded" | "pill" | "circle";
}
export const defaults: GlassOptions = {
  tint: "#d7f0e1",
  opacity: 0.15,
  blur: 12,
  radius: 24,
  refraction: 8,
  border: 0.3,
  shape: "rounded",
};
export function validate(value: unknown): GlassOptions {
  const v = {
    ...defaults,
    ...object(value, [
      "tint",
      "opacity",
      "blur",
      "radius",
      "refraction",
      "border",
      "shape",
    ]),
  };
  if (!["rounded", "pill", "circle"].includes(v.shape as string))
    throw new Error("Invalid shape");
  return {
    tint: color(v.tint),
    opacity: number(v.opacity, "opacity", 0, 1),
    blur: number(v.blur, "blur", 0, 30),
    radius: number(v.radius, "radius", 0, 100),
    refraction: number(v.refraction, "refraction", 0, 30),
    border: number(v.border, "border", 0, 1),
    shape: v.shape as GlassOptions["shape"],
  };
}
export function serialize(options: GlassOptions) {
  return JSON.stringify(validate(options));
}
export function deserialize(text: string) {
  return validate(parseJSON(text));
}
export function glassStyle(
  options: Partial<GlassOptions> = {},
  filterId?: string,
): React.CSSProperties {
  const o = validate(options);
  const channels = [1, 3, 5].map((i) => parseInt(o.tint.slice(i, i + 2), 16));
  return {
    background: `rgba(${channels.join(",")},${o.opacity})`,
    backdropFilter: `blur(${o.blur}px)${filterId && o.refraction ? ` url(#${filterId})` : ""}`,
    WebkitBackdropFilter: `blur(${o.blur}px)`,
    border: `1px solid rgba(255,255,255,${o.border})`,
    borderRadius:
      o.shape === "circle" ? "50%" : o.shape === "pill" ? 999 : o.radius,
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,.3), 0 12px 36px rgba(0,0,0,.12)",
    color: "#fff",
    position: "relative",
    isolation: "isolate",
  };
}
function Optics({ id, amount }: { id: string; amount: number }) {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".012 .025"
            numOctaves="2"
            seed="7"
            result="field"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="field"
            scale={amount}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
export function GlassPanel({
  options = {},
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { options?: Partial<GlassOptions> }) {
  const id = "luxleaf-" + useId().replace(/[^a-z0-9_-]/gi, "");
  const o = validate(options);
  return (
    <div {...props} style={{ ...glassStyle(o, id), ...style }}>
      <Optics id={id} amount={o.refraction} />
      {children}
    </div>
  );
}
export function GlassButton({
  options = {},
  children,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  options?: Partial<GlassOptions>;
}) {
  const id = "luxleaf-" + useId().replace(/[^a-z0-9_-]/gi, "");
  const o = validate(options);
  return (
    <button
      type="button"
      {...props}
      style={{
        ...glassStyle(o, id),
        font: "inherit",
        padding: "12px 22px",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Optics id={id} amount={o.refraction} />
      {children}
    </button>
  );
}
let sequence = 0;
export function mountGlass(
  element: HTMLElement,
  options: Partial<GlassOptions> = {},
) {
  let current = validate(options),
    dead = false;
  const original = element.getAttribute("style");
  const ns = "http://www.w3.org/2000/svg",
    svg = document.createElementNS(ns, "svg"),
    defs = document.createElementNS(ns, "defs"),
    filter = document.createElementNS(ns, "filter"),
    noise = document.createElementNS(ns, "feTurbulence"),
    map = document.createElementNS(ns, "feDisplacementMap");
  const id = `luxleaf-glass-${++sequence}`;
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  filter.id = id;
  noise.setAttribute("baseFrequency", ".012 .025");
  noise.setAttribute("numOctaves", "2");
  noise.setAttribute("result", "field");
  map.setAttribute("in", "SourceGraphic");
  map.setAttribute("in2", "field");
  map.setAttribute("xChannelSelector", "R");
  map.setAttribute("yChannelSelector", "G");
  filter.append(noise, map);
  defs.append(filter);
  svg.append(defs);
  element.append(svg);
  const update = (next: Partial<GlassOptions>) => {
    if (dead) throw new Error("Glass disposed");
    current = validate({ ...current, ...next });
    const style = glassStyle(current, id);
    for (const [key, value] of Object.entries(style))
      (element.style as unknown as Record<string, string>)[key] =
        typeof value === "number" ? `${value}px` : String(value);
    map.setAttribute("scale", String(current.refraction));
  };
  update(current);
  return {
    update,
    destroy() {
      if (dead) return;
      dead = true;
      svg.remove();
      if (original === null) element.removeAttribute("style");
      else element.setAttribute("style", original);
    },
  };
}
