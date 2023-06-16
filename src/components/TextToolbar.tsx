import React from "react";
import { Toolbar, ToolbarButton } from "./reps/Toolbar";

export interface TextToolbarActions {
  onPrettify: () => void;
  onSaveJson: () => void;
  onCopyJson: () => void;
}
export interface TextToolbarProps {
  actions: TextToolbarActions;
  isValidJson: boolean;
}

export function TextToolbar(props: TextToolbarProps) {
  return (
    <Toolbar>
      <ToolbarButton className="btn save" onClick={() => props.actions.onSaveJson()}>
        {JSONView.Locale["jsonViewer.Save"]}
      </ToolbarButton>
      <ToolbarButton className="btn copy" onClick={() => props.actions.onCopyJson()}>
        {JSONView.Locale["jsonViewer.Copy"]}
      </ToolbarButton>
      <ToolbarButton className="btn prettyprint" onClick={() => props.actions.onPrettify()}>
        {JSONView.Locale["jsonViewer.PrettyPrint"]}
      </ToolbarButton>
    </Toolbar>
  )
}
