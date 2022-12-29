import { useVirtualizer, elementScroll } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { ColumnsType } from "../data";
import { Card } from "./Card";
import { useDataContext } from "./DataContext";
import { COLUMN_WIDTH } from "./sizeHelpers";

export function Column(props: {
  data?: ColumnsType;
  scrollingRef: HTMLDivElement | null;
  start: number;
  left: number;
}) {
  const dataContext = useDataContext();
  const mounted = useRef<boolean>(false);
  const itemsData = props.data?.data;

  const columnVirtualizer = useVirtualizer({
    getScrollElement: () => props.scrollingRef,
    count: props.data?.data?.length || 0,
    estimateSize: (index) =>
      itemsData ? dataContext.originalItemHeights[itemsData[index].id] : 0,
    paddingStart: props.start,
    overscan: 2,
    //this is fixing a bug in the library
    scrollToFn: (offset, options, instance) => {
      if (offset !== 0 || props.start === 0) {
        elementScroll(offset, options, instance);
      }
    },
  });

  useEffect(() => {
    if (!props.data) {
      return;
    }

    if (mounted.current) {
      console.log("columnVirtualizer.getTotalSize()", props.data.id, columnVirtualizer.getTotalSize());
      dataContext.setOverrideColumnHeight(props.data!.id, columnVirtualizer.getTotalSize() - props.start);
    }
    return () => {
      dataContext.resetColumnHeight(props.data!.id, props.data!.data);
    }
  }, [columnVirtualizer.getTotalSize()]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    }
  }, [])

  return (
    <div
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
