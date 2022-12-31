import {
  elementScroll,
  useVirtualizer,
  Virtualizer,
} from "@tanstack/react-virtual";

type VirtualizerWithOffset<
  TScrollElement extends Element | Window,
  TItemElement extends Element
> = Virtualizer<TScrollElement, TItemElement> & {
  getFixedTotalSize: Virtualizer<TScrollElement, TItemElement>["getTotalSize"];
  getFixedVirtualItems: Virtualizer<
    TScrollElement,
    TItemElement
  >["getVirtualItems"];
};

export function useVirtualizerWithOffset({
  options,
  startOffset,
}: {
  options: Parameters<typeof useVirtualizer>[0];
  startOffset: number;
}) {
  const columnVirtualizer = useVirtualizer({
    ...options,
    paddingStart: startOffset,
    //this is fixing a bug in the library
    scrollToFn: (offset, options, instance) => {
      if (offset !== 0) {
        elementScroll(offset, options, instance);
      }
    },
  }) as VirtualizerWithOffset<Element, Element>;

  columnVirtualizer.getFixedTotalSize = () => {
    return columnVirtualizer.getTotalSize() - startOffset;
  };

  columnVirtualizer.getFixedVirtualItems = () => {
    return columnVirtualizer.getVirtualItems().map((item) => ({
      ...item,
      start: item.start - startOffset,
      end: item.end - startOffset,
    }));
  };

  return columnVirtualizer;
}
