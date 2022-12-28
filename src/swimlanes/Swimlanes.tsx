import { LanesDataType, LETTERS } from "../data";
import { Lane } from "./Lane";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { COLUMN_WIDTH, getLaneHeight, LANE_HEADER_WIDTH } from "./sizeHelpers";

export function Swimlanes(props: {
  data: LanesDataType;
  cardsHeights: { [key: number]: number };
}) {
  const lanesParent = useRef<HTMLDivElement>(null);
  
  const getLaneByIndex = (index: number) => {
    return props.data[index];
  };

  const lanesVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: props.data.length,
    estimateSize: (index) => {
      const lane = getLaneByIndex(index);
      return getLaneHeight(lane, props.cardsHeights) || 0;
    },
    overscan: 1,
  });


  const columnsVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: LETTERS.length,
    estimateSize: (index) => COLUMN_WIDTH,
    horizontal: true,
  });

  return (
      <div ref={lanesParent} style={{ height: '500px', width: '100%', overflow: "scroll" }}>
        <div
          className="virtual-container-vertical"
          style={{ height: lanesVirtualizer.getTotalSize(), width: `${columnsVirtualizer.getTotalSize() + LANE_HEADER_WIDTH}px` }}
        >
          {lanesVirtualizer.getVirtualItems().map((virtual) => {
            const lane = getLaneByIndex(virtual.index);
            return (
              <Lane
                key={virtual.index}
                start={virtual.start}
                data={lane}
                cardsHeights={props.cardsHeights}
                scrollingRef={lanesParent}
                columnsVirtualizer={columnsVirtualizer}
                className="virtual-item-vertical"
                style={{
                  height: virtual.size,
                  // transform: `translateY(${virtual.start}px)`
                  top: `${virtual.start}px`
                }}
              />
            );
          })}
        </div>
      </div>
  );
}
