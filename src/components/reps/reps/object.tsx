import React from "react";

import { wrapRender, ellipsisElement } from "./rep-utils";
import { MODE } from "./constants"
import { Rep } from "./rep"
import { rep as PropRep } from "./prop-rep";

const DEFAULT_TITLE = "Object";

interface ObjectRepProps {
  object: {[k: string]: any};
  mode?: symbol;
  title?: string;
  shouldRenderTooltip?: boolean;
}


function ObjectRep(props: ObjectRepProps) {
  const {
    object,
    shouldRenderTooltip = true,
    mode,
  } = props;
  if (mode === MODE.TINY) {
    const tinyModeItems: (React.JSX.Element|null)[] = [];
    if (getTitle(props) !== DEFAULT_TITLE) {
      tinyModeItems.push(getTitleElement(props));
    } else {
      tinyModeItems.push(
        <span className="objectLeftBrace">{"{"}</span>,
        Object.keys(object).length ? ellipsisElement : null,
        <span className="objectRightBrace">{"}"}</span>,
      );
    }

    return <span
      className="objectBox objectBox-object"
      title={shouldRenderTooltip ? getTitle(props) : undefined}
    >
      {...tinyModeItems}
    </span>
  }

  const propsArray = safePropIterator(props, object);

  return <span
    className="objectBox objectBox-object"
    title={shouldRenderTooltip ? getTitle(props) : undefined}
  >
    {getTitleElement(props)}
    <span className="objectLeftBrace">{" { "}</span>
    {...propsArray}
    <span className="objectRightBrace">{" }"}</span>
  </span>
}

function getTitleElement(props: ObjectRepProps) {
  return <span className="objectTitle">{getTitle(props)}</span>
}


function getTitle(props: ObjectRepProps) {
  return props.title || DEFAULT_TITLE;
}

function safePropIterator(props: ObjectRepProps, object: {[k:string]: any}, max: number = 3) {
  try {
    return propIterator(props, object, max);
  } catch (err) {
    console.error(err);
  }
  return [];
}

function propIterator(props: ObjectRepProps, object: {[k:string]: any}, max: number) {
  // Work around https://bugzilla.mozilla.org/show_bug.cgi?id=945377
  if (Object.prototype.toString.call(object) === "[object Generator]") {
    object = Object.getPrototypeOf(object);
  }

  const elements: (React.JSX.Element|string)[] = [];
  const unimportantProperties: string[] = [];
  let propertiesNumber = 0;
  const propertiesNames = Object.keys(object);

  const pushPropRep = (name: string, value: any) => {
    elements.push(
      <PropRep
        {...props}
        key={name}
        mode={MODE.TINY}
        name={name}
        object={value}
        equal=": "
      />
    );
    propertiesNumber++;

    if (propertiesNumber < propertiesNames.length) {
      elements.push(", ");
    }
  };

  try {
    for (const name of propertiesNames) {
      if (propertiesNumber >= max) {
        break;
      }

      let value;
      try {
        value = object[name];
      } catch (exc) {
        continue;
      }

      // Object members with non-empty values are preferred since it gives the
      // user a better overview of the object.
      if (isInterestingProp(value)) {
        pushPropRep(name, value);
      } else {
        // If the property is not important, put its name on an array for later
        // use.
        unimportantProperties.push(name);
      }
    }
  } catch (err) {
    console.error(err);
  }

  if (propertiesNumber < max) {
    for (const name of unimportantProperties) {
      if (propertiesNumber >= max) {
        break;
      }

      let value;
      try {
        value = object[name];
      } catch (exc) {
        continue;
      }

      pushPropRep(name, value);
    }
  }

  if (propertiesNumber < propertiesNames.length) {
    elements.push(ellipsisElement);
  }

  return elements;
}

function isInterestingProp(value: any) {
  const type = typeof value;
  return type == "boolean" || type == "number" || (type == "string" && value);
}

export function supportsObject(object: any, noGrip = false) {
  return noGrip;
}

export const rep = wrapRender(ObjectRep)
