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
type RenderCell = (props: CellProps) => React.ReactNode;

interface TreeRowProps {
  member: TreeRowMember;
  decorator?: {
    getRowClass?: (o: any) => string|string[]
  };
  renderCell?: RenderCell;
  renderLabelCell?: RenderCell;
  columns: {
    id: string;
  }[];
  id: string;
  provider: {
    getValue: (o: any, id: string) => RenderCell;
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

function TreeRow(props: TreeRowProps) {
  const member = props.member;
  const decorator = props.decorator;
  const treeRowRef = useRef<HTMLElement>();
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
  
  return <tr>

  </tr>
}
