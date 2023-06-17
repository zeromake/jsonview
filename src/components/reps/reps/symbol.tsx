import React from "react";

import { rep as StringRep } from "./string";
import { getGripType, wrapRender } from "./rep-utils";

const MAX_STRING_LENGTH = 50;

interface SymbolRepProps {
  className?: string;
  object: {actor?: string; name?: string};
  shouldRenderTooltip?: boolean;
}

function SymbolRep(props: SymbolRepProps) {
  const {
    className = "objectBox objectBox-symbol",
    object,
    shouldRenderTooltip,
  } = props;
  const { name } = object;
  let symbolText: React.JSX.Element|string = name || "";
  if (name && name !== "Symbol.iterator" && name !== "Symbol.asyncIterator") {
    symbolText = StringRep({
      object: symbolText,
      // shouldCrop: true,
      cropLimit: MAX_STRING_LENGTH,
      useQuotes: true,
    });
  }
  return <span
    data-link-actor-id={object.actor}
    className={className}
    title={shouldRenderTooltip ? `Symbol(${name})` : undefined}
  >
    {`Symbol(${symbolText})`}
  </span>
}

export function supportsObject(object: any, noGrip = false) {
  return getGripType(object, noGrip) == "symbol";
}

export const rep = wrapRender(SymbolRep)
