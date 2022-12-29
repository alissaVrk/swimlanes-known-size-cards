import { Person } from "../data";

export function Card(props: { item: Person, size: number, top: number }) {
    return (
        <div
            key={props.item.id}
            className="virtual-item-vertical"
            onClick={() => { }}
            style={{
                height: `${props.size}px`,
                transform: `translateY(${props.top}px)`,
                boxSizing: "border-box",
                border: "solid green"
            }}
        >
            {props.item.firstName} {props.item.lastName}
        </div>
    );
}