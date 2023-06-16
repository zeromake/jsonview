import React from "react";

import { Headers } from "./Headers";
import { HeadersToolbar } from "./HeadersToolbar";
import type { HeadersToolbarActions } from "./HeadersToolbar";
import type { HeadersData } from "./Headers";

export interface HeadersPanelProps {
  actions: HeadersToolbarActions;
  data: HeadersData;
}

export function HeadersPanel(props: HeadersPanelProps) {
  const data = props.data;
  return <div className="headersPanelBox tab-panel-inner">
    <HeadersToolbar actions={props.actions}/>
    <div className="panelContent">
      <Headers data={data}/>
    </div>
  </div>
}
