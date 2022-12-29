import { useEffect, useState } from "react";
import { Person } from "../data";

export function Card(props: {
    item: Person;
    size: number;
    top: number;
    index: number;
    measureElement: (element: HTMLElement) => void;
}) {
    const [textOverride, setTextOverride] = useState("");

    const text = textOverride || props.item.firstName + " " + props.item.lastName;

    useEffect(() => {
        props.measureElement(document.getElementById(`card-${props.item.id}`)!);
    }, [textOverride]);

    function toggleText() {
        if (textOverride) {
            setTextOverride("");
        } else {
            setTextOverride(
                "This is a really long text that should wrap This is a really long text that should wrap This is a really long text that should wrap This is a really long text that should wrap"
            );
        }
    }
    return (
        <div
            id={`card-${props.item.id}`}
            data-index={props.index}
            className="virtual-item-vertical"
            onClick={toggleText}
            style={{
                minHeight: `${props.size}px`,
                transform: `translateY(${props.top}px)`,
                boxSizing: "border-box",
                border: "solid green",
            }}
        >
            {text}
        </div>
    );
}
