import React, { useEffect, useRef } from "react";
import {
  Container,
  Button,
  type ContainerOptions,
  type Optics,
} from "../engine/index.js";
export * from "../engine/index.js";
/** Capture a permitted backdrop before mounting. Canvas effects never receive React children as HTML. */
export function OpticalButton({
  text,
  options = {},
  onPress,
  disabled = false,
}: {
  text: string;
  options?: ContainerOptions & { size?: number; warp?: boolean };
  onPress?: () => void;
  disabled?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    callback = useRef(onPress);
  callback.current = onPress;
  useEffect(() => {
    const button = new Button({
      ...options,
      text,
      disabled,
      onClick: () => callback.current?.(),
    });
    host.current!.append(button.element);
    button.updateSizeFromDOM();
    return () => button.destroy();
  }, [text, disabled, JSON.stringify(options)]);
  return <div ref={host} />;
}
