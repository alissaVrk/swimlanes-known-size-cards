import React, { useEffect } from "react";
import { map } from "lodash";
import { Person } from "../data";
import { Column } from "./Column";
import { LANE_HEADER_WIDTH } from "./sizeHelpers";

export function Lane(
  props: React.HtmlHTMLAttributes<HTMLDivElement> & {
    data: { [key: string]: Person[] };
    cardsHeights: { [key: number]: number };
    laneName: string;
    scrollingRef: React.RefObject<HTMLDivElement>;
    start: number;
  }
) {
  useEffect;

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
        display: "flex",
        flexDirection: "row",
        background: 'pink',
        height: '100%',
      }}>
        <div style={{
          position: 'sticky',
          top: '0px',
          left: '0px',
          height: 'fit-content',
        }}>
          FFFGDFGDFGDGDFG
        </div>
        {map(props.data, (column, name) => {
          return (
            <Column
              key={name}
              data={column}
              cardsHeights={props.cardsHeights}
              scrollingRef={props.scrollingRef}
              start={props.start}
            />
          );
        })}
      </div>
    </div>
  );
}
