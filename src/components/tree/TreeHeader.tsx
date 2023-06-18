import React from "react"


interface TreeHeaderColumn {
  id: string;
  width?: string;
  title?: string;
}

interface TreeHeaderProps {
  decorator?: {
    getHeaderClass?: (id: string) => (string|string[]);
  };
  header?: boolean;
  columns?: TreeHeaderColumn[];
}

export function TreeHeader(props: TreeHeaderProps) {
  const {
    header: visible,
    columns = [{id: "default"}],
  } = props;
  const cells = columns.map(col => {
    const cellStyle = {
      width: col.width ? col.width : "",
    };

    let classNames: string[] = [];

    if (visible) {
      classNames = getHeaderClass(col.id, props);
      classNames.push("treeHeaderCell");
    }
    return <td
      className={classNames.join(" ")}
      style={cellStyle}
      role="presentation"
      id={col.id}
      key={col.id}
    >
      {visible && <div
        className="treeHeaderCellBox"
        role="presentation"
      >{col.title}</div>}
    </td>
  })
  return <thead role="presentation">
    <tr role="presentation" className={visible ? "treeHeaderRow" : ""}>
      {cells}
    </tr>
  </thead>
}


function getHeaderClass(colId: string, props: TreeHeaderProps): string[] {
  const decorator = props.decorator;
  if (!decorator || !decorator.getHeaderClass) {
    return [];
  }
  // Decorator can return a simple string or array of strings.
  let classNames = decorator.getHeaderClass(colId);
  if (!classNames) {
    return [];
  }

  if (typeof classNames == "string") {
    classNames = [classNames];
  }
  return classNames;
}
