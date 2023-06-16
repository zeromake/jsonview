import React from "react";
import { getGripType, wrapRender } from "./rep-utils";

function Number(props: {
  object: {type?: string}|number|boolean;
  shouldRenderTooltip?: boolean;
}) {
  const { shouldRenderTooltip, object } = props;
  const value = stringify(object);
  return <span
    className="objectBox objectBox-number"
    title={shouldRenderTooltip ? value : undefined}
  ></span>
}

function stringify(object: any) {
  const isNegativeZero =
    Object.is(object, -0) || (object.type && object.type == "-0");

  return isNegativeZero ? "-0" : String(object);
}
const SUPPORTED_TYPES = new Set(["boolean", "number", "-0"]);

export function supportsObject(object: any, noGrip = false) {
  return SUPPORTED_TYPES.has(getGripType(object, noGrip));
}
export const rep = wrapRender(Number)
