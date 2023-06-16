import type {ReactElement} from "react";
import React from "react";

export interface ToolbarProps {
  children: ReactElement|ReactElement[];
}

export function Toolbar(props: ToolbarProps) {
  return <div className="toolbar">{props.children}</div>
}
export interface ToolbarButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  active?: boolean;
  disabled?: boolean;
  children: string;
}
export function ToolbarButton(props: ToolbarButtonProps) {
  const _props = {
    className: "btn",
    ...props,
  }
  return <button {..._props}>{props.children}</button>
}
