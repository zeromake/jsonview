import React from "react";

import { ObjectProvider } from "./ObjectProvider";
import type { RenderValueFunc } from "./TreeCell";
import { TreeRow, RenderCellFunc } from "./TreeRow";
import { TreeHeader } from "./TreeHeader";
import { scrollIntoView } from "src/shared/scroll";

const SUPPORTED_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "End",
  "Home",
  "Enter",
  " ",
  "Escape",
];
const defaultProps = {
  object: null,
  renderRow: null,
  provider: ObjectProvider,
  expandedNodes: new Set(),
  selected: null,
  defaultSelectFirstNode: true,
  active: null,
  expandableStrings: true,
  columns: [],
};

interface TreeViewProps {
  object: any;
  className?: string;
  label?: string;
  provider: {
    getChildren: (o: any) => any[];
    hasChildren: (o: any) => boolean;
    getLabel?: (o: any) => void;
    getValue?: (o: any) => void;
    getKey?: (o: any) => void;
    getLevel?: (o: any, level: number) => number;
    getType?: (o: any) => string;
  };
  decorator: {
    getRowClass?: (o: any) => string|string[];
    getCellClass?: (o: any) => string|string[];
    getHeaderClass?: (o: any) => string|string[];
    renderValue?: () => RenderValueFunc;
    renderRow?: () => typeof TreeRow;
    renderCell?: () => RenderCellFunc;
    renderLabelCell?: () => RenderCellFunc;
  };
  // Custom tree row (node) renderer
  renderRow?: typeof TreeRow;
  // Custom cell renderer
  renderCell?: RenderCellFunc;
  // Custom value renderer
  renderValue?: RenderValueFunc;
  // Custom tree label (including a toggle button) renderer
  renderLabelCell?: RenderCellFunc;
  expandedNodes?: Set<string>;
}
