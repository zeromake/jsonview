import React from "react";

import { wrapRender } from "./rep-utils";
import { MODE } from "./constants"
import { Rep } from "./rep"

const maxLengthMap = new Map();
maxLengthMap.set(MODE.SHORT, 3);
maxLengthMap.set(MODE.LONG, 10);

interface ArrayRepProps {
  mode: symbol;
  object: any[];
  shouldRenderTooltip?: boolean;
}

function ArrayRep(props: ArrayRepProps) {
  const {
    object,
    mode = MODE.SHORT,
    shouldRenderTooltip = true
  } = props;
  let brackets;
  let items: React.JSX.Element[] = [];
  if (mode === MODE.TINY) {
    const isEmpty = object.length === 0;
    if (isEmpty) {
      items = [];
    } else {
      items = [
        <span className="more-ellipsis">…</span>,
      ];
    }
    brackets = needSpace(false);
  } else {
    items = arrayIterator(props, object, maxLengthMap.get(mode));
    brackets = needSpace(!!items.length);
  }
  return <span
    className="objectBox objectBox-array"
    title={shouldRenderTooltip ? "Array" : undefined}
  >
    <span className="arrayLeftBracket">
      {brackets.left}
    </span>
    {...items}
    <span className="arrayRightBracket">
      {brackets.right}
    </span>
  </span>
}

function arrayIterator(props: ArrayRepProps, array: any[], max: number) {
  const items: React.JSX.Element[] = [] = [];

  for (let i = 0; i < array.length && i < max; i++) {
    const config = {
      mode: MODE.TINY,
      delim: i == array.length - 1 ? "" : ", ",
    };
    let item;

    try {
      item = ItemRep({
        ...props,
        ...config,
        object: array[i],
      });
    } catch (exc) {
      item = ItemRep({
        ...props,
        ...config,
        object: exc,
      });
    }
    items.push(item);
  }

  if (array.length > max) {
    items.push(
      <span className="more-ellipsis">…</span>
    );
  }

  return items;
}

function needSpace(space: boolean) {
  return space ? { left: "[ ", right: " ]" } : { left: "[", right: "]" };
}

interface ItemRepProps {
  object: any;
  delim: string;
  mode: symbol;
}

function ItemRep(props: ItemRepProps) {
  const { object, delim, mode } = props;
  return <span>
    <Rep {...props} object={object} mode={mode}></Rep>
    {delim}
  </span>
}

function getLength(object: any[]) {
  return object.length;
}

function supportsObject(object: any, noGrip = false) {
  return (
    noGrip &&
    (Array.isArray(object) ||
      Object.prototype.toString.call(object) === "[object Arguments]")
  );
}
export const rep = wrapRender(ArrayRep)
export {
  supportsObject,
  maxLengthMap,
  getLength,
}
