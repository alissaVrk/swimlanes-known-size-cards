import { useEffect, useRef } from "react";
import { ColumnsType } from "../data";
import { Card } from "./Card";
import { useDataContext } from "./DataContext";
import { COLUMN_WIDTH } from "./sizeHelpers";
import { useVirtualizerWithOffset } from "./useVirtualizerWithOffset";

export function Column(props: {
  data?: ColumnsType;
  scrollingRef: HTMLDivElement | null;
  top: number;
  left: number;
}) {
  const dataContext = useDataContext();
  const mounted = useRef<boolean>(false);
  const itemsData = props.data?.data;

  const cardsVirtualizer = useVirtualizerWithOffset({
    startOffset: props.top,
    options: {
      getScrollElement: () => props.scrollingRef,
      count: props.data?.data?.length || 0,
      estimateSize: (index) =>
        itemsData ? dataContext.originalItemHeights[itemsData[index].id] : 0,
      overscan: 2,
    }
  });

  useEffect(() => {
    if (!props.data) {
      return;
    }

    if (mounted.current) {
      dataContext.setOverrideColumnHeight(props.data!.id, cardsVirtualizer.getFixedTotalSize());
    }
    return () => {
      dataContext.resetColumnHeight(props.data!.id, props.data!.data);
    }
  }, [cardsVirtualizer.getFixedTotalSize()]);

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
      {cardsVirtualizer.getFixedVirtualItems().map((virtual) => {
        const item = itemsData![virtual.index];
        return (
          <Card
            key={item.id}
            index={virtual.index}
            item={item}
            size={dataContext.originalItemHeights[item.id]}
            top={virtual.start}
            measureElement={cardsVirtualizer.measureElement}
          />
        );
      })}
    </div>
  );
}
