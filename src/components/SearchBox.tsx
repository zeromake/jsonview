import React, { ChangeEvent, Component, RefObject, createRef } from "react";

export interface SearchBoxProps {
  actions: {
    onSearch: (value: string) => void;
  };
  value?: string;
}

export interface SearchBoxState {
  value: string;
}

const searchDelay = 250;

export class SearchBox extends Component<SearchBoxProps, SearchBoxState> {
  searchTimeout?: number;
  _searchBoxRef: RefObject<HTMLInputElement>;
  constructor(props: SearchBoxProps) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onClearButtonClick = this.onClearButtonClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this._searchBoxRef = createRef();
    this.state = {
      value: props.value || "",
    };
  }
  onSearch(event: ChangeEvent): void {
    const searchBox = event.target as HTMLInputElement;
    const win = searchBox.ownerDocument.defaultView || window;
    if (this.searchTimeout) {
      win.clearTimeout(this.searchTimeout);
    }
    const callback = this.doSearch.bind(this, searchBox);
    this.searchTimeout = win.setTimeout(callback, searchDelay);
  }
  doSearch(searchBox: HTMLInputElement) {
    this.props.actions.onSearch(searchBox.value);
  }
  onClearButtonClick() {
    this.setState({ value: "" });
    this.props.actions.onSearch("");
    if (this._searchBoxRef.current) {
      this._searchBoxRef.current.focus();
    }
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this.onClearButtonClick();
        break;
    }
  }
  render(): React.ReactNode {
    const { value } = this.state;
    return (
      <div className="devtools-searchbox">
        <input
          className="searchBox devtools-filterinput"
          placeholder={JSONView.Locale["jsonViewer.filterJSON"]}
          onChange={this.onSearch}
          onKeyDown={this.onKeyDown}
          value={value}
          ref={this._searchBoxRef}
        ></input>
        <button
          className="devtools-searchinput-clear"
          hidden={!value}
          onClick={this.onClearButtonClick}
        ></button>
      </div>
    )
  }
}
