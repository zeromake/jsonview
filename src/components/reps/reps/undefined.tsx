import React from "react";
import { getGripType, wrapRender } from "./rep-utils";

function Undefined(props: {
  shouldRenderTooltip?: boolean;
}) {
  const { shouldRenderTooltip } = props;
  return <span
    className="objectBox objectBox-undefined"
    title={shouldRenderTooltip ? "undefined" : undefined}
  ></span>
}

export function supportsObject(object: any, noGrip = false) {
  if (noGrip === true) {
    return object === undefined;
  }

  return (
    (object && object.type && object.type == "undefined") ||
    getGripType(object, noGrip) == "undefined"
  );
}
export const rep = wrapRender(Undefined)
 