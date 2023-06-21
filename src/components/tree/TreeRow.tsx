import React, { useEffect, useRef } from "react";


import { LabelCell } from "./LabelCell";
import { TreeCell } from "./TreeCell";
import {
  wrapMoveFocus,
  getFocusableElements
} from "src/shared/focus";

interface TreeRowMember {
  object: any;
  rowClass: string;
  level: number;
  open: boolean;
  path: string;
  name?: string;
  type: string;
  hasChildren?: boolean;
  value?: any;
  hidden?: boolean;
  selected?: boolean;
  active?: boolean;
  loading?: boolean;
}
export type RenderCellFunc = (props: CellProps) => React.ReactNode;

interface TreeRowProps {
  member: TreeRowMember;
  decorator?: {
    getRowClass?: (o: any) => string|string[];
    renderLabelCell?: (o: any) => RenderCellFunc;
    RenderCellFunc?: (o: any, id: string) => RenderCellFunc;
  };
  RenderCellFunc?: RenderCellFunc;
  renderLabelCell?: RenderCellFunc;
  columns: {
    id: string;
  }[];
  id: string;
  provider: {
    getValue: (o: any, id: string) => RenderCellFunc;
  };
  onClick: React.MouseEventHandler;
  onContextMenu?: React.MouseEventHandler;
  onMouseOver?: React.MouseEventHandler;
  onMouseOut?: React.MouseEventHandler;
}

const UPDATE_ON_PROPS = [
  "name",
  "open",
  "value",
  "loading",
  "level",
  "selected",
  "active",
  "hasChildren",
];


interface CellProps extends TreeRowProps {
  key: string;
  id: string;
  value: any;
}

export function TreeRow(props: TreeRowProps) {
  const member = props.member;
  const decorator = props.decorator;
  const treeRowRef = useRef<HTMLTableRowElement>(null);
  const observer = useRef<MutationObserver>();
  const setTabbableState = () => {
    const elms = getFocusableElements(treeRowRef.current!);
    if (elms.length === 0) {
      return;
    }
    const { active } = member;
    if (!active) {
      elms.forEach(elm => elm.setAttribute("tabindex", "-1"));
      return;
    }
    if (!elms.includes(document.activeElement as HTMLElement)) {
      (elms[0] as HTMLElement).focus();
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const { target, key, shiftKey } = e;
    if (key !== "Tab") {
      return;
    }
    const focusMoved = !!wrapMoveFocus(
      getFocusableElements(treeRowRef.current!),
      target as HTMLElement,
      shiftKey
    );
    if (focusMoved) {
      e.preventDefault();
    }
    e.stopPropagation();
  }

  const getRowClass = (object: any) => {
    if (!decorator || !decorator.getRowClass) {
      return [];
    }

    // Decorator can return a simple string or array of strings.
    let classNames = decorator.getRowClass(object);
    if (!classNames) {
      return [];
    }

    if (typeof classNames == "string") {
      classNames = [classNames];
    }

    return classNames;
  }
  useEffect(() => {
    setTabbableState();
    if (treeRowRef.current) {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = undefined;
      }
      const win = treeRowRef.current.ownerDocument.defaultView;
      const { MutationObserver } = win || window;
      observer.current = new MutationObserver(() => {
        setTabbableState();
      });
      observer.current.observe(treeRowRef.current, {
        childList: true,
        subtree: true,
      })
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = undefined;
      }
    };
  }, [treeRowRef.current]);
  const classNames = getRowClass(member.object) || [];
  classNames.push("treeRow");
  classNames.push(member.type + "Row");
  const currentProps: {
    "aria-expanded"?: boolean;
  } = {};
  if (member.hasChildren) {
    classNames.push("hasChildren");

    // There are 2 situations where hasChildren is true:
    // 1. it is an object with children. Only set aria-expanded in this situation
    // 2. It is a long string (> 50 chars) that can be expanded to fully display it
    if (member.type !== "string") {
      currentProps["aria-expanded"] = member.open;
    }
  }

  if (member.open) {
    classNames.push("opened");
  }

  if (member.loading) {
    classNames.push("loading");
  }

  if (member.selected) {
    classNames.push("selected");
  }

  if (member.hidden) {
    classNames.push("hidden");
  }

  const cells: React.ReactNode[] = [];
  let RenderCellFunc = props.RenderCellFunc || TreeCell;
  let renderLabelCell: RenderCellFunc = props.renderLabelCell || LabelCell as RenderCellFunc;
  if (decorator?.renderLabelCell) {
    renderLabelCell = decorator.renderLabelCell(member.object) || renderLabelCell as RenderCellFunc;
  }

  // Render a cell for every column.
  props.columns.forEach(col => {
    const cellProps = Object.assign({}, props, {
      key: col.id,
      id: col.id,
      value: props.provider.getValue(member.object, col.id),
    });

    if (decorator?.RenderCellFunc) {
      RenderCellFunc = decorator.RenderCellFunc(member.object, col.id);
    }
    const Render = col.id == "default" ? renderLabelCell : RenderCellFunc as RenderCellFunc;
    if (Render) {
      cells.push(
        <Render {...cellProps}/>
      );
    }
  });
  return <tr
    id={props.id}
    ref={treeRowRef}
    role="treeitem"
    aria-level={member.level + 1}
    aria-selected={!!member.selected}
    onClick={props.onClick}
    onContextMenu={props.onContextMenu}
    onKeyDownCapture={member.active ? onKeyDown : undefined}
    onMouseOver={props.onMouseOver}
    onMouseOut={props.onMouseOut}
    className={classNames.join(" ")}
    {...currentProps}
  >
    {...cells}
  </tr>
}
