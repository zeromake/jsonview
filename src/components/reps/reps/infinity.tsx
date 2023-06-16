import React from "react";
import { getGripType, wrapRender } from "./rep-utils";

function InfinityRep(props: {
  object: {type: string;};
  shouldRenderTooltip?: boolean;
}) {
  const { shouldRenderTooltip, object } = props;
  return <span
    className="objectBox objectBox-number"
    title={shouldRenderTooltip ? object.type : undefined}
  ></span>
}

export function supportsObject(object: any, noGrip = false) {
  const type = getGripType(object, noGrip);
    return type == "Infinity" || type == "-Infinity";
}
export const rep = wrapRender(InfinityRep)
