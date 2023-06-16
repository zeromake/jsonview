import React from "react";

import { SearchBox } from "./SearchBox";
import { Toolbar, ToolbarButton } from "./reps/Toolbar";

import type {JSONActions} from "./types";

export interface JsonToolbarProps {
  actions: JSONActions;
  dataSize: number;
}
const EXPAND_THRESHOLD = 100 * 1024;

export function JsonToolbar(props: JsonToolbarProps) {
  return (
    <Toolbar>
      <ToolbarButton className="btn save" onClick={() => props.actions.onSaveJson()}>
        {JSONView.Locale["jsonViewer.Save"]}
      </ToolbarButton>
      <ToolbarButton className="btn copy" onClick={() => props.actions.onCopyJson()}>
        {JSONView.Locale["jsonViewer.Copy"]}
      </ToolbarButton>
      <ToolbarButton className="btn collapse" onClick={() => props.actions.onCollapse()}>
        {JSONView.Locale["jsonViewer.CollapseAll"]}
      </ToolbarButton>
      <ToolbarButton className="btn expand" onClick={() => props.actions.onExpand()}>
        {
          props.dataSize > EXPAND_THRESHOLD
          ? JSONView.Locale["jsonViewer.ExpandAllSlow"]
          : JSONView.Locale["jsonViewer.ExpandAll"]
        }
      </ToolbarButton>
      <div className="devtools-separator"/>
      <SearchBox actions={props.actions}/>
    </Toolbar>
  )
}
