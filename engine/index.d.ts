export interface Optics {
  edgeIntensity?: number;
  rimIntensity?: number;
  baseIntensity?: number;
  edgeDistance?: number;
  rimDistance?: number;
  baseDistance?: number;
  cornerBoost?: number;
  rippleEffect?: number;
  blurRadius?: number;
  tintOpacity?: number;
}
export interface ContainerOptions {
  borderRadius?: number;
  type?: "rounded" | "circle" | "pill";
  tintOpacity?: number;
  controls?: Optics;
}
export class Container {
  static instances: Container[];
  static pageSnapshot: HTMLCanvasElement | null;
  static captureRoot: HTMLElement | null;
  constructor(options?: ContainerOptions);
  element: HTMLDivElement;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  gl_refs: Record<string, any>;
  children: Container[];
  parent: Container | null;
  disposed: boolean;
  webglInitialized: boolean;
  addChild<T extends Container>(child: T): T;
  removeChild(child: Container): void;
  updateSizeFromDOM(): void;
  updateControls(options: Optics): void;
  destroy(): void;
  render?: () => void;
}
export class Button extends Container {
  constructor(
    options?: ContainerOptions & {
      text?: string;
      size?: number;
      onClick?: (text: string) => void;
      warp?: boolean;
      disabled?: boolean;
    },
  );
  disabled: boolean;
  setupAsNestedGlass(): void;
}
export function validateOptics(value: unknown): Optics;
export const opticalRanges: Record<keyof Optics, [number, number]>;
export function captureBackdrop(root: HTMLElement): Promise<HTMLCanvasElement>;
