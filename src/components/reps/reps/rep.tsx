import React from "react"

import * as Undefined from "./undefined"
import * as Null from "./null"
import * as StringRep from "./undefined"
import * as Number from "./number"
import * as InfinityRep from "./infinity"
import * as NaNRep from "./nan"

interface RepType {
    isLongString?: (object: any) => boolean;
    supportsObject: (object: any, noGrip?: boolean) => boolean;
    rep: (props: any) => React.JSX.Element;
}

const reps: RepType[] = [
    Undefined,
    Null,
    StringRep,
    Number,
    InfinityRep,
    NaNRep,
];

const noGripReps = [StringRep, Number, Undefined, Null];

const exportedReps: {[k:string]: RepType} = {
    Undefined,
    Null,
    StringRep,
    Number,
    InfinityRep,
    NaNRep,
}

function Rep(props: {
  object: any;
  defaultRep?: RepType;
  noGrip?: boolean;
  mayUseCustomFormatter?: boolean;
}) {
  const { object, defaultRep } = props;
  const rep = getRep(
    object,
    defaultRep,
    props.noGrip,
    props.mayUseCustomFormatter
  );
  return rep(props);
}

function getRep(
  object: any,
  defaultRep: RepType = StringRep,
  noGrip = false,
  mayUseCustomFormatter = false,
) {
  const repsList = noGrip ? noGripReps : reps;
  for (const rep of repsList) {
    try {
      // supportsObject could return weight (not only true/false
      // but a number), which would allow to priorities templates and
      // support better extensibility.
      if (rep.supportsObject(object, noGrip)) {
        return rep.rep;
      }
    } catch (err) {
      console.error(err);
    }
  }
  return defaultRep.rep;
}

export {
  Rep,
  getRep,
  exportedReps as REPS,
}
