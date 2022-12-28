import { LanesDataType, LETTERS } from "../data";
import { Lane } from "./Lane";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { COLUMN_WIDTH, getLaneHeight, HEADER_HEIGHT, LANE_HEADER_WIDTH } from "./sizeHelpers";

export function Swimlanes(props: {
  data: LanesDataType;
  cardsHeights: { [key: number]: number };
}) {
  const lanesParent = useRef<HTMLDivElement>(null);
  const columnsParent = useRef<HTMLDivElement>(null);

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
    getScrollElement: () => columnsParent.current,
    count: LETTERS.length,
    estimateSize: (index) => COLUMN_WIDTH,
    horizontal: true,
  });

  return (
    <div ref={columnsParent} style={{ height: '500px', width: '700px', overflowX: "scroll" }}>
      <div className="virtual-container-horizontal" style={{ width: `${columnsVirtualizer.getTotalSize() + LANE_HEADER_WIDTH}px` }}>
        <div style={{ height: 50 }}>
          {columnsVirtualizer.getVirtualItems().map((virtual) => {
            return (
              <div
                key={virtual.index}
                className="virtual-item-horizontal"
                style={{
                  width: `${virtual.size}px`,
                  transform: `translateX(${virtual.start + LANE_HEADER_WIDTH}px)`,
                  border: "solid blue",
                  height: HEADER_HEIGHT,
                }}
              >
                {LETTERS[virtual.index]}
              </div>
            );
          })}
        </div>
        <div ref={lanesParent} style={{ height: '450px', width: '100%', overflowY: 'scroll' }}>
          <div
            className="virtual-container-vertical"
            style={{ height: lanesVirtualizer.getTotalSize() }}
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

      </div>
    </div>
  );
}
