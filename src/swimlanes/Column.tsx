import { useVirtualizer, elementScroll } from "@tanstack/react-virtual";
import { Person } from "../data";

export function Column(props: {
  data: Person[];
  cardsHeights: { [key: number]: number };
  scrollingRef: React.RefObject<HTMLDivElement>;
  start: number;
}) {
  const columnVirtualizer = useVirtualizer({
    getScrollElement: () => props.scrollingRef.current,
    count: props.data.length,
    estimateSize: (index) => props.cardsHeights[props.data[index].id],
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
      style={{
        width: 200,
        position: "relative",
        background: 'white'
      }}
    >
      {columnVirtualizer.getVirtualItems().map((virtual) => {
        const item = props.data[virtual.index];
        return (
          <div
            key={item.id}
            className="virtual-item-vertical"
            style={{
              height: `${virtual.size}px`,
              transform: `translateY(${virtual.start - props.start}px)`,
              boxSizing: "border-box",
              border: "solid green"
            }}
          >
            {item.firstName} {item.lastName}
          </div>
        );
      })}
    </div>
  );
}
