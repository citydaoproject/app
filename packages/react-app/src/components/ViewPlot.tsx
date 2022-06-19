import React from "react";
import { Plot } from "../models/Plot";

interface Props {
  plot?: Plot;
}

export default function ViewPlot({ plot }: Props) {
  return <button className="view-plot-btn btn w-full">View on Opensea</button>;
}
