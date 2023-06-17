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
  cropLimit?: number,
  urlCropLimit?: number,
  member?: {open: boolean},
  object: any,
  openLink?: (url: string, e: any) => void;
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
    cropLimit = 50,
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
  text = formatText(
    {
      useQuotes,
      escapeWhitespace,
    },
    text
  );
  if (shouldRenderTooltip) {
    config.title = text;
  }
  if (!isLong) {
    if (containsURL(text)) {
      return <span {...config}>
        {getLinkifiedElements({
          text,
          cropLimit: shouldCrop ? cropLimit : 0,
          urlCropLimit,
          openLink,
          isInContentPage,
        })}
      </span>
    }
    text = maybeCropString(
      {
        isLong,
        shouldCrop,
        cropLimit,
      },
      text
    );
  }
  return <span {...config}>{text}</span>
}

function maybeCropString(opts: {
  isLong: boolean;
  shouldCrop: boolean;
  cropLimit: number;
}, text: string) {
  const { shouldCrop, cropLimit } = opts;

  return shouldCrop ? rawCropString(text, cropLimit) : text;
}

function getLinkifiedElements({
  text,
  cropLimit,
  urlCropLimit,
  openLink,
  isInContentPage,
}: {
  text: string;
  cropLimit: number;
  urlCropLimit?: number;
  openLink?: (url: string, e: any) => void;
  isInContentPage?: boolean;
}) {
  const halfLimit = Math.ceil((cropLimit - ELLIPSIS.length) / 2);
  const startCropIndex = cropLimit ? halfLimit : 0;
  const endCropIndex = cropLimit ? text!.length - halfLimit : 0;

  const items = [];
  let currentIndex = 0;
  let contentStart;
  while (true) {
    const url = urlRegex.exec(text);
    // Pick the regexp with the earlier content; index will always be zero.
    if (!url) {
      break;
    }
    contentStart = url.index + url[1].length;
    if (contentStart > 0) {
      const nonUrlText = text.substring(0, contentStart);
      items.push(
        getCroppedString(
          nonUrlText,
          currentIndex,
          startCropIndex,
          endCropIndex
        )
      );
    }

    // There are some final characters for a URL that are much more likely
    // to have been part of the enclosing text rather than the end of the
    // URL.
    let useUrl = url[2];
    const uneat = uneatLastUrlCharsRegex.exec(useUrl);
    if (uneat) {
      useUrl = useUrl.substring(0, uneat.index);
    }

    currentIndex = currentIndex + contentStart;
    const linkText = getCroppedString(
      useUrl,
      currentIndex,
      startCropIndex,
      endCropIndex
    );

    if (linkText) {
      const linkItems = [];
      const shouldCrop = urlCropLimit && useUrl.length > urlCropLimit;
      if (shouldCrop) {
        const urlCropHalf = Math.ceil((urlCropLimit - ELLIPSIS.length) / 2);
        // We cut the string into 3 elements and we'll visually hide the second one
        // in CSS. This way people can still copy the full link.
        linkItems.push(
          <span className="cropped-url-start">
            {useUrl.substring(0, urlCropHalf)}
          </span>,
          <span className="cropped-url-middle">
            {useUrl.substring(urlCropHalf, useUrl.length - urlCropHalf)}
          </span>,
          <span className="cropped-url-end">
            {useUrl.substring(useUrl.length - urlCropHalf)}
          </span>,
        );
      } else {
        linkItems.push(linkText);
      }
      items.push(
        <a
          key={`${useUrl}-${currentIndex}`}
          className={"url" + (shouldCrop ? " cropped-url" : "")}
          title={useUrl}
          draggable={false}
          href={openLink || isInContentPage ? useUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick= {openLink
              ? e => {
                  e.preventDefault();
                  openLink(useUrl, e);
                }
              : undefined}
        >
          {...linkItems}
        </a>
      );
    }

    currentIndex = currentIndex + useUrl.length;
    text = text.substring(url.index + url[1].length + useUrl.length);
  }

  // Clean up any non-URL text at the end of the source string,
  // i.e. not handled in the loop.
  if (text.length) {
    if (currentIndex < endCropIndex) {
      text = getCroppedString(
        text,
        currentIndex,
        startCropIndex,
        endCropIndex
      ) as string;
    }
    items.push(text);
  }

  return items;
}

function getCroppedString(text: string, offset: number = 0, startCropIndex: number, endCropIndex: number) {
  if (!startCropIndex) {
    return text;
  }

  const start = offset;
  const end = offset + text.length;

  const shouldBeVisible = !(start >= startCropIndex && end <= endCropIndex);
  if (!shouldBeVisible) {
    return null;
  }

  const shouldCropEnd = start < startCropIndex && end > startCropIndex;
  const shouldCropStart = start < endCropIndex && end > endCropIndex;
  if (shouldCropEnd) {
    const cutIndex = startCropIndex - start;
    return (
      text.substring(0, cutIndex) +
      ELLIPSIS +
      (shouldCropStart ? text.substring(endCropIndex - start) : "")
    );
  }

  if (shouldCropStart) {
    // The string should be cropped at the beginning.
    const cutIndex = endCropIndex - start;
    return text.substring(cutIndex);
  }

  return text;
}

function formatText(opts: {
  useQuotes: boolean;
  escapeWhitespace: boolean;
}, text: string) {
  const { useQuotes, escapeWhitespace } = opts;

  return useQuotes
    ? escapeString(text, escapeWhitespace)
    : sanitizeString(text);
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

export function isLongString(object: any): boolean {
  const grip = object && object.getGrip ? object.getGrip() : object;
  return grip && grip.type === "longString";
}

export function supportsObject(object: any, noGrip = false) {
  // Accept the object if the grip-type (or type for noGrip objects) is "string"
  if (getGripType(object, noGrip) == "string") {
    return true;
  }

  // Also accept longString objects if we're expecting grip
  if (!noGrip) {
    return isLongString(object);
  }

  return false;
}

export const rep = wrapRender(StringRep)
