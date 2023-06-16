import React from "react";

import { Toolbar, ToolbarButton } from "./reps/Toolbar";

export interface HeadersToolbarActions {
  onCopyHeaders: () => void;
}

export interface HeadersToolbarProps {
  actions: HeadersToolbarActions;
}

export function HeadersToolbar(props: HeadersToolbarProps) {
  return <Toolbar>
    <ToolbarButton className="btn copy" onClick={() => props.actions.onCopyHeaders()}>
      {JSONView.Locale["jsonViewer.Copy"]}
    </ToolbarButton>
  </Toolbar>
}
