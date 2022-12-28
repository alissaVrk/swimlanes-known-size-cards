import { LanesDataType, LETTERS } from "../data";
import { Lane } from "./Lane";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef } from "react";
import { COLUMN_WIDTH, getLaneHeight } from "./sizeHelpers";

export function Swimlanes(props: {
  data: LanesDataType;
  cardsHeights: { [key: number]: number };
}) {
  const lanesParent = useRef<HTMLDivElement>(null);
  const keys = useMemo(() => Object.keys(props.data), [props.data]);
  const getLaneByIndex = (index: number) => {
    return props.data[keys[index]];
  };

  const lanesVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: keys.length,
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
      <div ref={lanesParent} style={{ height: '500px', overflow: "scroll" }}>
        <div
          className="virtual-container-vertical"
          style={{ height: lanesVirtualizer.getTotalSize(), width: `${200 * 30}px` }}
        >
          {lanesVirtualizer.getVirtualItems().map((virtual) => {
            const lane = getLaneByIndex(virtual.index);
            return (
              <Lane
                key={virtual.index}
                start={virtual.start}
                laneName={keys[virtual.index]}
                data={lane}
                cardsHeights={props.cardsHeights}
                scrollingRef={lanesParent}
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
