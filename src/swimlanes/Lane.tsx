import React from "react";
import { map } from "lodash";
import { LaneType } from "../data";
import { Column } from "./Column";
import { LANE_HEADER_WIDTH } from "./sizeHelpers";
import { Virtualizer } from "@tanstack/react-virtual";

export function Lane(
  props: React.HtmlHTMLAttributes<HTMLDivElement> & {
    data: LaneType;
    scrollingRef: HTMLDivElement | null;
    columnsVirtualizer: Virtualizer<HTMLDivElement, Element>;
    start: number;
  }
) {

  return (
    <div
      className={props.className}
      style={{
        ...props.style,
      }}
    >
      <div style={{
        height: '2px',
        background: 'pink',
        position: 'sticky',
        top: '0px',
        zIndex: 1,
      }}></div>

      <div style={{
        position: 'sticky',
        top: '0px',
        left: '0px',
        height: '100%',
        background: 'pink',
        width: `${LANE_HEADER_WIDTH}px`,
        zIndex: 1,
      }}>
        <div style={{
          position: 'sticky',
          top: '0px',
          left: '0px',
          height: 'fit-content',
          width: `${LANE_HEADER_WIDTH}px`,
        }}>
          {props.data.name}
        </div>
      </div>

      {map(props.columnsVirtualizer.getVirtualItems(), (virtual) => {
        const column = props.data.data[virtual.index];
        return (
          <Column
            key={virtual.index}
            data={column}
            scrollingRef={props.scrollingRef}
            start={props.start}
            left={virtual.start + LANE_HEADER_WIDTH}
          />
        );
      })}
    </div>
  );
}
