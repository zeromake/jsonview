import React from "react"

interface LabelCellSuffixProps {
    level?: number;
    hasChildren?: boolean;
    loading?: boolean;
    open?: boolean;
    type: string;
    name: string;
}

interface LabelCellProps {
  id: string;
  title?: string;
  member: LabelCellSuffixProps;
  renderSuffix?: (props: LabelCellSuffixProps) => React.ReactNode;
}


export function LabelCell(props: LabelCellProps) {
  const {
    id,
    title,
    member,
    renderSuffix,
  } = props;
  const level = member.level || 0;

  const iconClassList = ["treeIcon"];
  if (member.hasChildren && member.loading) {
    iconClassList.push("devtools-throbber");
  } else if (member.hasChildren) {
    iconClassList.push("theme-twisty");
  }
  if (member.open) {
    iconClassList.push("open");
  }

  return <td
    title={title}
    className="treeLabelCell"
    style={{"--tree-label-cell-indent": `${level * 16}px`}}
    key="default"
    role="presentation"
  >
    <span className={iconClassList.join(" ")} role="presentation"/>
    <span
      className={"treeLabel " + member.type + "Label"}
      title={title}
      aria-labelledby={id}
      data-level={level}
    >
      {member.name}
    </span>
    {renderSuffix && renderSuffix(member)}
  </td>
}
