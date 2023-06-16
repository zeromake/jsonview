import React from "react";

import {TextToolbar} from "./TextToolbar";

import type {TextToolbarActions} from "./TextToolbar";
import { LiveText } from "./LiveText";

export interface TextPanelProps {
  isValidJson: boolean;
  data: string;
  actions: TextToolbarActions;
}

export function TextPanel(props: TextPanelProps) {
  return <div className="textPanelBox tab-panel-inner">
    <TextToolbar actions={props.actions} isValidJson={props.isValidJson}/>
    <div className="panelContent">
      <LiveText data={props.data}/>
    </div>
  </div>
}
