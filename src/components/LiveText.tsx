import React from "react";

export interface LiveTextProps {
  data: string;
}

export function LiveText(props: LiveTextProps): React.ReactNode {
  return <pre className="data">
    {props.data}
  </pre>
}
