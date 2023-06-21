import React, { Component } from "react"

export type RenderValueFunc = (props: TreeCellProps) => string;

interface TreeCellProps {
  value: any;
  object?: any;
  type?: string;
  decorator?: {
    getCellClass?: (o: any, id: string) => string[]|string;
    renderValue?: (o: any, id: string) => (RenderValueFunc|undefined);
  };
  id: string;
  member: {
    object: any;
    open?: boolean;
    type?: string;
  };
  renderValue: RenderValueFunc;
  enableInput?: boolean;
}

interface TreeCellState {
  inputEnabled: boolean;
}

export class TreeCell extends Component<TreeCellProps, TreeCellState> {
  constructor(props: TreeCellProps) {
    super(props);
    this.state = {
      inputEnabled: false,
    };
    this.getCellClass = this.getCellClass.bind(this);
    this.updateInputEnabled = this.updateInputEnabled.bind(this);
  }

  shouldComponentUpdate(nextProps: TreeCellProps, nextState: TreeCellState) {
    return (
      this.props.value != nextProps.value ||
      this.state.inputEnabled !== nextState.inputEnabled ||
      this.props.member.open != nextProps.member.open
    );
  }

  getCellClass(object: any, id: string) {
    const decorator = this.props.decorator;
    if (!decorator || !decorator.getCellClass) {
      return [];
    }

    // Decorator can return a simple string or array of strings.
    let classNames = decorator.getCellClass(object, id);
    if (!classNames) {
      return [];
    }

    if (typeof classNames == "string") {
      classNames = [classNames];
    }

    return classNames;
  }
  updateInputEnabled(evt: React.FocusEvent|React.MouseEvent) {
    this.setState({
      inputEnabled: (evt.target as Element).nodeName.toLowerCase() !== "input",
    });
  }
  render(): React.ReactNode {
    const {
      member,
      id,
      value,
      decorator,
      type = "",
      enableInput,
    } = this.props;
    let {
      renderValue,
    } = this.props;
    const classNames = this.getCellClass(member.object, id) || [];
    classNames.push("treeValueCell");
    classNames.push(type + "Cell");
    renderValue = renderValue || defaultRenderValue;
    if (decorator?.renderValue) {
      renderValue = decorator.renderValue(member.object, id) || renderValue;
    }
    const props = {...this.props, object: value};
    let cellElement: React.ReactElement;
    if (enableInput && this.state.inputEnabled && type !== "object") {
      classNames.push("inputEnabled");
      cellElement = <input
        autoFocus={true}
        onBlur={this.updateInputEnabled}
        readOnly={true}
        value={value}
        aria-labelledby={id}
      />
    } else {
      cellElement = <span
        onClick={type !== "object" ? this.updateInputEnabled : undefined}
        aria-labelledby={id}
      >
        {renderValue(props)}
      </span>
    }
    return <td className={classNames.join(" ")} role="presentation">
      {cellElement}
    </td>
  }
}


function defaultRenderValue(props: TreeCellProps) {
  return props.object + "";
};
