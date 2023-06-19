

const focusableSelector = [
  "a[href]:not([tabindex='-1'])",
  "button:not([disabled], [tabindex='-1'])",
  "iframe:not([tabindex='-1'])",
  "input:not([disabled], [tabindex='-1'])",
  "select:not([disabled], [tabindex='-1'])",
  "textarea:not([disabled], [tabindex='-1'])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Wrap and move keyboard focus to first/last focusable element inside a container
 * element to prevent the focus from escaping the container.
 *
 * @param  {Array} elms
 *         focusable elements inside a container
 * @param  {HTMLElement} current
 *         currently focused element inside containter
 * @param  {Boolean} back
 *         direction
 * @return {HTMLElement}
 *         newly focused element
 */
export function wrapMoveFocus(elms: HTMLElement[], current: HTMLElement, back?: boolean) {
  let next;

  if (elms.length === 0) {
    return undefined;
  }

  if (back) {
    if (elms.indexOf(current) === 0) {
      next = elms[elms.length - 1];
      next.focus();
    }
  } else if (elms.indexOf(current) === elms.length - 1) {
    next = elms[0];
    next.focus();
  }

  return next;
}

/**
 * Get a list of all elements that are focusable with a keyboard inside the parent element
 *
 * @param  {DOMNode} parentEl
 *         parent DOM element to be queried
 * @return {Array}
 *         array of focusable children elements inside the parent
 */
export function getFocusableElements(parentEl: HTMLElement) {
  return (parentEl
    ? Array.from(parentEl.querySelectorAll(focusableSelector))
    : []) as HTMLElement[];
}
