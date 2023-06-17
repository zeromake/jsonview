import React from "react";

import { wrapRender, maybeEscapePropertyName } from "./rep-utils";
import { MODE } from "./constants"
import { Rep } from "./rep"


interface PropRepProps {
  name: string|{};
  mode: symbol;
  object: {};
  equal: string;
  key?: string;
  keyClassName?: string;
  onDOMNodeMouseOver?: (o:any) => void;
  onDOMNodeMouseOut?: (o:any) => void;
  onInspectIconClick?: (o:any) => void;
  suppressQuotes?: boolean;
  shouldRenderTooltip?: boolean;
}

function PropRep(props: PropRepProps) {
  const {
    equal,
    keyClassName,
    mode,
    shouldRenderTooltip,
    suppressQuotes,
  } = props;
  let { name } = props;

  const className = `nodeName${keyClassName ? " " + keyClassName : ""}`;
  let key: React.JSX.Element;
  if (typeof name === "string") {
    if (!suppressQuotes) {
      name = maybeEscapePropertyName(name);
    }
    key = <span
        className={className}
        title={shouldRenderTooltip ? name as string : undefined}
      >
        {name as string}
      </span>
  } else {
    key = <Rep
      {...props}
      className={className}
      object={name}
      mode={mode || MODE.TINY}
    />;
  }
  return <>
    {key}
    <span className="objectEqual">{equal}</span>
    <Rep {...props}/>
  </>
}

export const rep = wrapRender(PropRep)
