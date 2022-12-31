import { LETTERS } from "../data";
import { Lane } from "./Lane";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import {
  COLUMN_WIDTH,
  HEADER_HEIGHT,
  LANE_HEADER_WIDTH,
  LANE_PADDING,
} from "./sizeHelpers";
import { useDataContext } from "./DataContext";

export function Swimlanes() {
  const lanesParent = useRef<HTMLDivElement>(null);
  const headersParent = useRef<HTMLDivElement>(null);
  const dataContext = useDataContext();

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

    lanes.addEventListener("scroll", handleScroll);

    return () => {
      lanes.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getLaneByIndex = (index: number) => {
    return dataContext.data[index];
  };

  const lanesVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: dataContext.data.length,
    estimateSize: (index) => {
      return dataContext.laneHeights[index] + LANE_PADDING;
    },
    overscan: 1,
  });

  useEffect(() => {
    console.log("global measure");
    lanesVirtualizer.measure();
  }, [dataContext.laneHeights]);

  const columnsVirtualizer = useVirtualizer({
    getScrollElement: () => lanesParent.current,
    count: LETTERS.length,
    estimateSize: () => COLUMN_WIDTH,
    horizontal: true,
    paddingStart: LANE_HEADER_WIDTH,
    overscan: 0,
  });

  return (
    <>
      <div
        ref={headersParent}
        style={{
          height: HEADER_HEIGHT,
          overflow: "hidden",
        }}
      >
        <div style={{ position: 'absolute', background: 'white', zIndex: 1, height: '100%', width: LANE_HEADER_WIDTH }} />
        <div
          style={{
            height: "100%",
            width: `${columnsVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {columnsVirtualizer.getVirtualItems().map((virtual) => {
            return (
              <div
                key={virtual.index}
                className="virtual-item-horizontal"
                style={{
                  width: `${virtual.size}px`,
                  transform: `translateX(${virtual.start}px)`,
                  border: "solid blue",
                  height: "100%",
                }}
              >
                {LETTERS[virtual.index]}
              </div>
            );
          })}
        </div>
      </div>

      <div ref={lanesParent} style={{ height: "500px", overflow: "scroll" }}>
        <div
          style={{
            height: lanesVirtualizer.getTotalSize(),
            width: `${columnsVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {lanesVirtualizer.getVirtualItems().map((virtual) => {
            const lane = getLaneByIndex(virtual.index);
            return (
              <Lane
                key={virtual.index}
                start={virtual.start}
                data={lane}
                scrollingRef={lanesParent.current}
                columnsVirtualizer={columnsVirtualizer}
                className="virtual-item-vertical"
                style={{
                  height: virtual.size,
                  top: `${virtual.start}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
