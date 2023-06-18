
function closestScrolledParent(node: HTMLElement) {
  if (node == null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  }

  return closestScrolledParent(node.parentNode as HTMLElement);
}

/**
 * Scrolls the element into view if it is not visible.
 *
 * @param {HTMLElement|undefined} element
 *        The item to be scrolled to.
 *
 * @param {Object|undefined} options
 *        An options object which can contain:
 *          - container: possible scrollable container. If it is not scrollable, we will
 *                       look it up.
 *          - alignTo:   "top" or "bottom" to indicate if we should scroll the element
 *                       to the top or the bottom of the scrollable container when the
 *                       element is off canvas.
 *          - center:    Indicate if we should scroll the element to the middle of the
 *                       scrollable container when the element is off canvas.
 */
export function scrollIntoView(element?: HTMLElement, options: {
  alignTo?: string;
  center?: boolean;
  container?: HTMLElement;
} = {}) {
  if (!element) {
    return;
  }

  const { alignTo, center, container } = options;

  const { top, bottom } = element.getBoundingClientRect();
  const scrolledParent = closestScrolledParent(
    container || (element.parentNode as HTMLElement)
  );
  const scrolledParentRect = scrolledParent
    ? scrolledParent.getBoundingClientRect()
    : null;
  const isVisible =
    !scrolledParent ||
    (top >= scrolledParentRect!.top && bottom <= scrolledParentRect!.bottom);

  if (isVisible) {
    return;
  }

  if (center) {
    element.scrollIntoView({ block: "center" });
    return;
  }

  const scrollToTop = alignTo
    ? alignTo === "top"
    : !scrolledParentRect || top < scrolledParentRect.top;
  element.scrollIntoView(scrollToTop);
}
