import React, { PropsWithChildren, useMemo } from "react";
import { makeLaneToColumnsToPersonData, LanesDataType, Person } from "../data";
import { getColumnSize, getLaneHeight } from "./sizeHelpers";

export type ContextType = {
    data: LanesDataType;
    originalItemHeights: { [key: number]: number };
    laneHeights: number[];
    setOverrideColumnHeight: (columnId: string, height: number) => void;
    resetColumnHeight: (columnId: string, columnData: Person[]) => void;
};
export const DataCotext = React.createContext<ContextType>({} as ContextType);

function calcColumnsHeights(data: LanesDataType, heights: { [key: number]: number }) {
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
    const [actualColumnHeights, setActualColumnHeights] = React.useState(calcColumnsHeights(data, height));
    const laneHeights = useMemo(() => data.map(lane => getLaneHeight(lane, actualColumnHeights)), [actualColumnHeights]);

    const value = useMemo(
        () => ({
            data,
            originalItemHeights: height,
            laneHeights,
            setOverrideColumnHeight: (columnId: string, height: number) => {
                setActualColumnHeights((prev) => prev[columnId] === height ? prev : { ...prev, [columnId]: height });
            },
            resetColumnHeight: (columnId: string, columnData: Person[]) => {
                const columnHeight = getColumnSize(columnData, height);
                if (columnHeight === actualColumnHeights[columnId]) {
                    return;
                }
                setActualColumnHeights(prev => ({ ...prev, [columnId]: columnHeight }));
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
