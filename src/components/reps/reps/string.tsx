import React from "react";
import {
  containsURL,
  escapeString,
  getGripType,
  rawCropString,
  sanitizeString,
  wrapRender,
  ELLIPSIS,
  uneatLastUrlCharsRegex,
  urlRegex,
} from "./rep-utils";

interface StringRepProps {
  useQuotes?: boolean,
  escapeWhitespace?: boolean,
  style?: {};
  cropLimit: number,
  urlCropLimit?: number,
  member?: {open: boolean},
  object: any,
  openLink?: (url: string) => void;
  className?: string;
  title?: string;
  isInContentPage?: boolean;
  transformEmptyString?: boolean;
  shouldRenderTooltip?: boolean;
}

function StringRep(props: StringRepProps) {
  const {
    className,
    style,
    cropLimit,
    urlCropLimit,
    object,
    useQuotes = true,
    escapeWhitespace = true,
    member,
    openLink,
    title,
    isInContentPage,
    transformEmptyString = false,
    shouldRenderTooltip,
  } = props;
  let text = object;
  const config = getElementConfig({
    className,
    style,
    actor: object.actor,
    title,
  });
  if (text == "" && transformEmptyString && !useQuotes) {
    return <span {...config} title="<empty string>" className={`${config.className} objectBox-empty-string`}>
      {"<empty string>"}
    </span>
  }
  const isLong = isLongString(object);
  const isOpen = member && member.open;
  const shouldCrop = !!(!isOpen && cropLimit && text.length > cropLimit);
  if (isLong) {
    text = maybeCropLongString(
      {
        shouldCrop,
        cropLimit,
      },
      text
    );
    const { fullText } = object;
    if (isOpen && fullText) {
      text = fullText as string;
    }
  }
}

function maybeCropLongString(opts: { shouldCrop: boolean; cropLimit: number }, object: any) {
  const { shouldCrop, cropLimit } = opts;

  const grip = object && object.getGrip ? object.getGrip() : object;
  const { initial, length } = grip;

  let text = shouldCrop ? initial.substring(0, cropLimit) : initial;

  if (text.length < length) {
    text += ELLIPSIS;
  }
  return text;
}

function isLongString(object: any): boolean {
  const grip = object && object.getGrip ? object.getGrip() : object;
  return grip && grip.type === "longString";
}

function getElementConfig(opts: {
  className?: string;
  style?: {};
  actor?: string;
  title?: string;
}) {
  const { className, style, actor, title } = opts;

  const config: {
    "data-link-actor-id"?: string;
    "title"?: string;
    "className"?: string;
    "style"?: {};
  } = {};

  if (actor) {
    config["data-link-actor-id"] = actor;
  }

  if (title) {
    config.title = title;
  }

  const classNames = ["objectBox", "objectBox-string"];
  if (className) {
    classNames.push(className);
  }
  config.className = classNames.join(" ");

  if (style) {
    config.style = style;
  }

  return config;
}
