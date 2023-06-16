import React from "react";

export interface Header {
  name: string;
  value: string;
}

export interface HeaderListProps {
  headers: Header[];
}

export interface HeadersData {
  request: HeaderListProps;
  response: HeaderListProps;
}

export interface HeadersProps {
  data: HeadersData;
}

export function Headers(props: HeadersProps) {
  const data = props.data;
  return (
    <div className="netInfoHeadersTable">
      <div className="netHeadersGroup">
        <div className="netInfoHeadersGroup">
          {JSONView.Locale["jsonViewer.responseHeaders"]}
        </div>
        <table cellPadding={0} cellSpacing={0}>
          <HeaderList headers={data.response.headers}></HeaderList>
        </table>
      </div>
      <div className="netHeadersGroup">
        <div className="netInfoHeadersGroup">
          {JSONView.Locale["jsonViewer.requestHeaders"]}
        </div>
        <table cellPadding={0} cellSpacing={0}>
          <HeaderList headers={data.request.headers}></HeaderList>
        </table>
      </div>
    </div>
  );
}

export function HeaderList(props: HeaderListProps) {
  const headers = props.headers;
  headers.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });
  const rows = headers.map(header => {
    return <tr key={header.name}>
      <td className="netInfoParamName">
        <span title={header.name}>{header.name}</span>
      </td>
      <td className="netInfoParamValue">{header.value}</td>
    </tr>
  })
  return <tbody>{rows}</tbody>
}
