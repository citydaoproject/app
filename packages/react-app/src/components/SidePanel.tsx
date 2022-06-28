import React, { useEffect, useState } from "react";

import { RootState } from "../store";
import { useAppSelector } from "../hooks";
import PlotList from "./PlotList";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import FilterNote from "./FilterNote";
import { plotsList } from "../data";
import { Plot } from "../models/Plot";
import { LocationDetail, TerrainDetail, PlotDetail } from "./"

interface Props {
    contracts: any;
    injectedProvider: any;
}

export default function SidePanel({ contracts, injectedProvider }: Props) {
    const userAddress = useAppSelector((state: RootState) => state.user.address);
    const fetchingPlots = useAppSelector((state: RootState) => state.plots.fetching);
    const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
    const currentNumDisplay = useAppSelector((state: RootState) => state.plots.numDisplay);
    const activePlot = useAppSelector(state => state.plots.activePlot);
    const [newPlots, setNewPlots] = useState<Plot[]>([])
    const [newPlotsNum, setNewPlotsNum] = useState(0);

    useEffect(() => {
        let plotData = plotsList.features as Plot[];
        plotData.map((plot: Plot, index: number) => {
            if (plot["id"]) {
                return;
            }
            plot["id"] = index + 1;
            return;
        })
        setNewPlots(plotData)
    }, [])

    useEffect(() => {
        let plotData = plotsList.features as Plot[];
        let filteredPlot = [];
        filteredPlot = plotData.filter(plot => {
            return stringifyPlotId(plot.id).includes(idFilter ?? "");
        })
        setNewPlots(filteredPlot)
        setNewPlotsNum(filteredPlot.length);
    }, [idFilter])

    return (
        <div className="plot-tabs overflow-auto">
            {activePlot !== undefined ? (
                <PlotDetail plot={activePlot} contracts={contracts} injectedProvider={injectedProvider} />
            )
            :
            (
                !userAddress ? (
                    <div className="px-10 py-11">
                        <LocationDetail />
                        <TerrainDetail />
                    </div>
                )
                :
                (
                    activePlot !== undefined ? (
                        <PlotDetail plot={activePlot} contracts={contracts} injectedProvider={injectedProvider} />
                    ) : (
                        <>
                            {idFilter && (
                                <FilterNote filterText={idFilter} />
                            )}
                            <PlotList
                                plots={newPlots?.slice(0, currentNumDisplay)}
                                totalNum={newPlotsNum}
                                emptyMessage={fetchingPlots ? "Loading..." : "We're sold out! Be on the lookout for the next drop."}
                            />
                        </>
                    )
                )
            )}
        </div>
    );
}
