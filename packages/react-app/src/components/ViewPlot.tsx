import React from "react";
import { Plot } from "../models/Plot";
import { PARCEL_OPENSEA } from "../constants";

interface Props {
  plot?: Plot;
}

export default function ViewPlot({ plot }: Props) {
  return <button className="view-plot-btn btn w-full text-sm" onClick={() => window.open(PARCEL_OPENSEA + plot?.id, "_blank")}>View on Opensea</button>;
}
