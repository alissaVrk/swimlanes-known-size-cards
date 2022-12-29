import { LanesDataType, LETTERS } from "../data";
import { Lane } from "./Lane";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { COLUMN_WIDTH, getLaneHeight, HEADER_HEIGHT, LANE_HEADER_WIDTH, LANE_PADDING } from "./sizeHelpers";

export function Swimlanes(props: {
  data: LanesDataType;
  cardsHeights: { [key: number]: number };
}) {
  const lanesParent = useRef<HTMLDivElement>(null);
  const headersParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lanes = lanesParent.current;
    if (!lanes) {
      return;
    }


    const handleScroll = () => {
      if (headersParent.current) {
        headersParent.current.scrollTo(lanes.scrollLeft, 0);
      }
    };

    lanes.addEventListener('scroll', handleScroll);

    return () => {
      lanes.removeEventListener('scroll', handleScroll);
    }
  }, [])

  const getLaneByIndex = (index: number) => {
    return props.data[index];
  };

  const lanesVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: props.data.length,
    estimateSize: (index) => {
      const lane = getLaneByIndex(index);
      return (getLaneHeight(lane, props.cardsHeights) || 0) + LANE_PADDING;
    },
    overscan: 1,
  });


  const columnsVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: LETTERS.length,
    estimateSize: () => COLUMN_WIDTH,
    horizontal: true,
  });

  return (
    <>
      <div ref={headersParent} style={{ height: HEADER_HEIGHT, overflow: 'hidden', marginLeft: LANE_HEADER_WIDTH }}>
        <div style={{ height: '100%', width: `${columnsVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {columnsVirtualizer.getVirtualItems().map((virtual) => {
            return (
              <div
                key={virtual.index}
                className="virtual-item-horizontal"
                style={{
                  width: `${virtual.size}px`,
                  transform: `translateX(${virtual.start}px)`,
                  border: "solid blue",
                  height: '100%',
                }}
              >
                {LETTERS[virtual.index]}
              </div>
            );
          })}
        </div>
      </div>

      <div ref={lanesParent} style={{ height: '500px', overflow: "scroll" }}>

        <div
          style={{ height: lanesVirtualizer.getTotalSize(), width: `${columnsVirtualizer.getTotalSize() + LANE_HEADER_WIDTH}px`, position: 'relative' }}
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
                  top: `${virtual.start}px`
                }}
              />
            );
          })}
        </div>
      </div>
    </>

  );
}
