import React, { PropsWithChildren, useMemo } from "react";
import { makeLaneToColumnsToPersonData, LanesDataType } from "../data";
import { getColumnSize, getLaneHeight } from "./sizeHelpers";

export type ContextType = {
    data: LanesDataType;
    originalItemHeights: { [key: number]: number };
    laneHeights: number[];
    setOverrideColumnHeight: (columnId: string, height: number) => void;
};
export const DataCotext = React.createContext<ContextType>({} as ContextType);

function calcColumnHeights(data: LanesDataType, heights: { [key: number]: number }) {
    const columnHeights: { [key: string]: number } = {};

    data.forEach((lane) => {
        lane.data.forEach((column) => {
            columnHeights[column.id] = getColumnSize(column.data, heights);
        });
    });
    return columnHeights;
}

export function DataProvider(props: PropsWithChildren<any>) {
    const { data, height } = useMemo(() => makeLaneToColumnsToPersonData(), []);
    const [actualColumnHeights, setActualColumnHeights] = React.useState(calcColumnHeights(data, height));
    const laneHeights = useMemo(() => data.map(lane => getLaneHeight(lane, actualColumnHeights)), [actualColumnHeights]);

    const value = useMemo(
        () => ({
            data,
            originalItemHeights: height,
            laneHeights,
            setOverrideColumnHeight: (columnId: string, height: number) => {
                setActualColumnHeights((prev) => ({ ...prev, [columnId]: height }));
            },
        }),
        [data, height, setActualColumnHeights, laneHeights]
    );

    return (
        <DataCotext.Provider value={value}>{props.children}</DataCotext.Provider>
    );
}

export function useDataContext() {
    return React.useContext<ContextType>(DataCotext);
}
