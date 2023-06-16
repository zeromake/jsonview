import React from "react";
import { getGripType, wrapRender } from "./rep-utils";

function NaNRep(props: {
  shouldRenderTooltip?: boolean;
}) {
  const { shouldRenderTooltip } = props;
  return <span
    className="objectBox objectBox-nan"
    title={shouldRenderTooltip ? "NaN" : undefined}
  ></span>
}

export function supportsObject(object: any, noGrip = false) {
  return getGripType(object, noGrip) == "NaN";
}
export const rep = wrapRender(NaNRep)
