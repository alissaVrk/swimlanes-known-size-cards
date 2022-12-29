import { useVirtualizer, elementScroll } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { ColumnsType, Person } from "../data";
import { Card } from "./Card";
import { useDataContext } from "./DataContext";
import { COLUMN_WIDTH } from "./sizeHelpers";

export function Column(props: {
  data?: ColumnsType;
  scrollingRef: React.RefObject<HTMLDivElement>;
  start: number;
  left: number;
}) {
  const dataContext = useDataContext();
  const columnRef = useRef<HTMLDivElement>(null);
  const itemsData = props.data?.data;

  const columnVirtualizer = useVirtualizer({
    getScrollElement: () => props.scrollingRef.current,
    count: props.data?.data?.length || 0,
    estimateSize: (index) =>
      itemsData ? dataContext.originalItemHeights[itemsData[index].id] : 0,
    paddingStart: props.start,
    overscan: 2,
    scrollToFn: (offset, options, instance) => {
      if (offset !== 0 || props.start === 0) {
        elementScroll(offset, options, instance);
      }
    },
  });

  useEffect(() => {
    if (columnRef.current) {
      console.log("columnVirtualizer.getTotalSize()", columnVirtualizer.getTotalSize());
      dataContext.setOverrideColumnHeight(props.data!.id, columnVirtualizer.getTotalSize());
    }
  }, [columnVirtualizer.getTotalSize()]);

  return (
    <div
      ref={columnRef}
      className="virtual-item-horizontal"
      style={{
        width: COLUMN_WIDTH,
        left: props.left,
        background: "white",
      }}
    >
      {columnVirtualizer.getVirtualItems().map((virtual) => {
        const item = itemsData![virtual.index];
        return (
          <Card
            key={item.id}
            index={virtual.index}
            item={item}
            size={dataContext.originalItemHeights[item.id]}
            top={virtual.start - props.start}
            measureElement={columnVirtualizer.measureElement}
          />
        );
      })}
    </div>
  );
}
