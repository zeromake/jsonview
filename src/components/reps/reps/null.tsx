import React from "react";
import { getGripType, wrapRender } from "./rep-utils";

function Null(props: {
  shouldRenderTooltip?: boolean;
}) {
  const { shouldRenderTooltip } = props;
  return <span
    className="objectBox objectBox-null"
    title={shouldRenderTooltip ? "null" : undefined}
  ></span>
}

export function supportsObject(object: any, noGrip = false) {
  if (noGrip === true) {
    return object === null;
  }

  if (object && object.type && object.type == "null") {
    return true;
  }

  return object == null;
}
export const rep = wrapRender(Null)
