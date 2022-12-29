import { useVirtualizer, elementScroll } from "@tanstack/react-virtual";
import { Person } from "../data";
import { Card } from "./Card";
import { COLUMN_WIDTH } from "./sizeHelpers";

export function Column(props: {
  data?: Person[];
  cardsHeights: { [key: number]: number };
  scrollingRef: React.RefObject<HTMLDivElement>;
  start: number;
  left: number;
}) {
  const columnVirtualizer = useVirtualizer({
    getScrollElement: () => props.scrollingRef.current,
    count: props.data?.length || 0,
    estimateSize: (index) => props.data ? props.cardsHeights[props.data[index].id] : 0,
    paddingStart: props.start,
    overscan: 2,
    scrollToFn: (offset, options, instance) => {
      if (offset !== 0 || props.start === 0) {
        elementScroll(offset, options, instance);
      }
    }
  });


  return (
    <div
      className="virtual-item-horizontal"
      style={{
        width: COLUMN_WIDTH,
        left: props.left,
        background: 'white'
      }}
    >
      {columnVirtualizer.getVirtualItems().map((virtual) => {
        const item = props.data![virtual.index];
        return (<Card key={item.id} item={item} size={virtual.size} top={virtual.start - props.start} />)
      })}
    </div>
  );
}
